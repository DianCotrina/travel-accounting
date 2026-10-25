// PostToolUse check: lint the edited frontend file or build the edited .NET project and feed
// errors straight back to Claude. Missing tooling is reported once per session, never hidden.
import { existsSync } from "node:fs";
import path from "node:path";
import { block, firstTimeThisSession, hasCommand, notify, projectDir, readInput, run, tail, toPosix } from "./lib.mjs";

const input = readInput();
const dir = projectDir(input);
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const absolute = path.resolve(dir, file);
const rel = toPosix(path.relative(dir, absolute));
const ext = path.extname(absolute).toLowerCase();
const event = "PostToolUse";

const webDir = path.join(dir, "src", "frontend", "web");
if (rel.startsWith("src/frontend/web/") && [".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
  if (!existsSync(path.join(webDir, "node_modules"))) {
    if (firstTimeThisSession(dir, input, "node-modules")) {
      notify(event, {
        userMessage: "post-edit-check: src/frontend/web/node_modules is missing — frontend lint/type checks cannot run. Run: npm --prefix src/frontend/web install",
        context: "Frontend checks could not run because node_modules is missing. Tell the user; do not claim frontend checks passed.",
      });
    }
    process.exit(0);
  }
  const lint = run(`npx eslint --no-warn-ignored "${absolute}"`, webDir, 120_000);
  if (!lint.ok) block(`post-edit-check: ESLint errors in ${rel}\n${tail(lint.output)}`);
  process.exit(0);
}

if (rel.startsWith("src/backend/") && [".cs", ".csproj"].includes(ext)) {
  if (!hasCommand("dotnet", dir)) {
    if (firstTimeThisSession(dir, input, "dotnet")) {
      notify(event, {
        userMessage: "post-edit-check: .NET SDK (dotnet) not found — backend build checks cannot run. Install .NET SDK 10.x.",
        context: "Backend build could not run because the .NET SDK is missing. Tell the user; do not claim backend checks passed.",
      });
    }
    process.exit(0);
  }
  // Nearest project file above the edited file.
  let current = path.dirname(absolute);
  let project = null;
  while (!project && current.startsWith(path.join(dir, "src", "backend"))) {
    const candidate = path.join(current, `${path.basename(current)}.csproj`);
    if (existsSync(candidate)) project = candidate;
    current = path.dirname(current);
  }
  if (!project) process.exit(0);
  const build = run(`dotnet build "${project}" --nologo -v q -clp:ErrorsOnly`, dir, 300_000);
  if (!build.ok) block(`post-edit-check: dotnet build failed for ${toPosix(path.relative(dir, project))}\n${tail(build.output)}`);
}

process.exit(0);
