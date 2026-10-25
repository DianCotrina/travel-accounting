// Shared helpers for Claude Code hooks. Cross-platform (macOS, Linux, Windows) — Node.js only, no bash.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const PROTECTED_BRANCH = /^(main|master|release\/.+)$/;

export function readInput() {
  const raw = readFileSync(0, "utf8");
  return raw.trim() ? JSON.parse(raw) : {};
}

export function projectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

/** Run a command; returns { ok, code, output }. `shell: true` resolves npm/npx .cmd shims on Windows. */
export function run(command, cwd, timeoutMs = 600_000) {
  const res = spawnSync(command, { cwd, shell: true, encoding: "utf8", timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 });
  if (res.error) {
    return { ok: false, code: null, output: String(res.error) };
  }
  return { ok: res.status === 0, code: res.status, output: `${res.stdout ?? ""}${res.stderr ?? ""}` };
}

export function hasCommand(name, cwd) {
  const probe = process.platform === "win32" ? `where ${name}` : `command -v ${name}`;
  return run(probe, cwd, 10_000).ok;
}

export function git(args, cwd, env) {
  const res = spawnSync("git", args, { cwd, encoding: "utf8", env: env ? { ...process.env, ...env } : process.env });
  return { ok: res.status === 0, out: (res.stdout ?? "").trim(), err: (res.stderr ?? "").trim() };
}

export function currentBranch(cwd) {
  const res = git(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
  return res.ok ? res.out : null;
}

export function isInside(file, dir) {
  const rel = path.relative(path.resolve(dir), path.resolve(dir, file));
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

export function toPosix(p) {
  return p.split(path.sep).join("/");
}

/** Exit 2: blocks the action (PreToolUse/Stop) or feeds the error back to Claude (PostToolUse). */
export function block(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

/** Non-blocking: shows `userMessage` to the user and `context` to Claude. */
export function notify(event, { userMessage, context }) {
  const out = {};
  if (userMessage) out.systemMessage = userMessage;
  if (context) out.hookSpecificOutput = { hookEventName: event, additionalContext: context };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

export function tail(text, lines = 60) {
  const all = text.trimEnd().split(/\r?\n/);
  return all.length <= lines ? all.join("\n") : `…(${all.length - lines} lines omitted)\n${all.slice(-lines).join("\n")}`;
}

// Per-machine hook state, gitignored (.claude/.state/).
export function stateFile(dir, name) {
  const stateDir = path.join(dir, ".claude", ".state");
  mkdirSync(stateDir, { recursive: true });
  return path.join(stateDir, name);
}

export function readState(dir, name) {
  const file = stateFile(dir, name);
  return existsSync(file) ? readFileSync(file, "utf8").trim() : "";
}

export function writeState(dir, name, value) {
  writeFileSync(stateFile(dir, name), String(value));
}

/** Warn about missing tooling once per session instead of on every edit. */
export function firstTimeThisSession(dir, input, key) {
  const name = `warned-${key}`;
  const session = input.session_id || "no-session";
  if (readState(dir, name) === session) return false;
  writeState(dir, name, session);
  return true;
}
