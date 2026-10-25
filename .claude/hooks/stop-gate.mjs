// Stop gate: before a turn ends, run the required checks for every area changed on this branch
// (vs origin/main, including uncommitted and untracked files). A passing working tree is
// remembered by its git tree hash, so unchanged work is not re-verified (e.g. after committing).
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { block, git, hasCommand, projectDir, readInput, readState, run, stateFile, tail, writeState } from "./lib.mjs";

const MAX_BLOCKS = 3;
const BASE_REF = "origin/main";

const input = readInput();
const dir = projectDir(input);
if (!git(["rev-parse", "--is-inside-work-tree"], dir).ok) process.exit(0);

const mergeBase = git(["merge-base", "HEAD", BASE_REF], dir);
const base = mergeBase.ok ? mergeBase.out : "HEAD";
const changed = [
  ...git(["diff", "--name-only", base], dir).out.split("\n"),
  ...git(["ls-files", "--others", "--exclude-standard"], dir).out.split("\n"),
].filter(Boolean);

const areas = {
  backend: changed.some((f) => f.startsWith("src/backend/")),
  frontend: changed.some((f) => f.startsWith("src/frontend/web/")),
};
if (!areas.backend && !areas.frontend) process.exit(0);

// Hash the full working tree (tracked + untracked, respecting .gitignore) without touching the real index.
const indexFile = stateFile(dir, "gate-index");
if (existsSync(indexFile)) rmSync(indexFile);
const env = { GIT_INDEX_FILE: indexFile };
git(["read-tree", "HEAD"], dir, env);
git(["add", "-A"], dir, env);
const tree = git(["write-tree"], dir, env).out;
const key = `${tree}:${areas.backend ? "b" : ""}${areas.frontend ? "f" : ""}`;
if (tree && readState(dir, "gate-ok") === key) process.exit(0);

const failures = [];
const missing = [];

if (areas.backend) {
  if (!hasCommand("dotnet", dir)) {
    missing.push(".NET SDK (dotnet) not found — backend build/tests not run.");
  } else {
    const sln = "src/backend/TravelAccounting.sln";
    const build = run(`dotnet build ${sln} --nologo -v q -clp:ErrorsOnly`, dir);
    if (!build.ok) failures.push(`dotnet build failed:\n${tail(build.output)}`);
    else {
      const test = run(`dotnet test ${sln} --nologo --no-build -v q`, dir);
      if (!test.ok) failures.push(`dotnet test failed:\n${tail(test.output)}`);
    }
  }
}

if (areas.frontend) {
  const web = path.join(dir, "src", "frontend", "web");
  if (!existsSync(path.join(web, "node_modules"))) {
    missing.push("src/frontend/web/node_modules missing — frontend checks not run (npm --prefix src/frontend/web install).");
  } else {
    for (const script of ["typecheck", "lint", "test"]) {
      const res = run(`npm run ${script} --silent`, web);
      if (!res.ok) failures.push(`npm run ${script} failed:\n${tail(res.output)}`);
    }
  }
}

const sessionKey = `gate-blocks-${input.session_id || "no-session"}`;

if (failures.length) {
  // Count consecutive blocks only within one stop sequence; a fresh stop starts at zero.
  const blocks = input.stop_hook_active ? Number(readState(dir, sessionKey) || 0) : 0;
  if (input.stop_hook_active && blocks >= MAX_BLOCKS) {
    writeState(dir, sessionKey, 0);
    process.stdout.write(JSON.stringify({
      systemMessage: `stop-gate: checks still failing after ${MAX_BLOCKS} attempts — this work is NOT verified.\n${failures.join("\n\n")}`,
    }));
    process.exit(0);
  }
  writeState(dir, sessionKey, blocks + 1);
  block(`stop-gate: required checks failed. Fix them before finishing (do not commit or push failing work).\n\n${failures.join("\n\n")}`);
}

writeState(dir, sessionKey, 0);
if (missing.length) {
  // Tooling gaps are surfaced to the user but cannot be fixed by Claude, so they do not block.
  process.stdout.write(JSON.stringify({ systemMessage: `stop-gate: some checks could not run:\n- ${missing.join("\n- ")}` }));
  process.exit(0);
}
writeState(dir, "gate-ok", key);
process.exit(0);
