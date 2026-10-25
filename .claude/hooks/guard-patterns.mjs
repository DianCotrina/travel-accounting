// PreToolUse guard: blocks newly introduced anti-patterns and secrets. Only lines that are new
// relative to the replaced text (Edit) or the current file (Write) are checked, so pre-existing
// code never blocks unrelated edits. A same-line `guard-allow: <reason>` marks a justified exception.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { block, projectDir, readInput, toPosix } from "./lib.mjs";

const input = readInput();
const toolInput = input.tool_input ?? {};
const file = toolInput.file_path;
if (!file) process.exit(0);

const absolute = path.resolve(projectDir(input), file);
// The hooks themselves contain the patterns they detect.
if (toPosix(absolute).includes("/.claude/hooks/")) process.exit(0);
const name = path.basename(absolute);
const ext = path.extname(absolute).toLowerCase();

let added = "";
let baseline = "";
if (input.tool_name === "Write") {
  added = toolInput.content ?? "";
  baseline = existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
} else if (input.tool_name === "Edit") {
  added = toolInput.new_string ?? "";
  baseline = toolInput.old_string ?? "";
} else if (input.tool_name === "MultiEdit") {
  added = (toolInput.edits ?? []).map((e) => e.new_string ?? "").join("\n");
  baseline = (toolInput.edits ?? []).map((e) => e.old_string ?? "").join("\n");
}

const baselineLines = new Set(baseline.split(/\r?\n/).map((l) => l.trim()));
const newLines = added
  .split(/\r?\n/)
  .map((text, i) => ({ text, line: i + 1 }))
  .filter(({ text }) => text.trim() && !baselineLines.has(text.trim()) && !/guard-allow:\s*\S/.test(text));

const normalize = (s) => s.replace(/\s+/g, " ").trim();
const baselineNormalized = normalize(baseline);

const isScript = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext);
const isStyle = [".css", ".scss"].includes(ext);
const isCSharp = ext === ".cs";
const isAppSettings = /^appsettings(\.[\w-]+)?\.json$/i.test(name);

const violations = [];
const lineRule = (applies, regex, message) => {
  if (!applies) return;
  for (const { text, line } of newLines) {
    if (regex.test(text)) violations.push(`  line ${line}: ${message}\n    > ${text.trim()}`);
  }
};

lineRule(isScript, /\bas\s+any\b/, "`as any` — use a proper type or type guard.");
lineRule(isScript, /\bas\s+unknown\s+as\b/, "`as unknown as` — use a proper type or type guard.");
lineRule(isScript || isStyle, /\btransition-all\b|transition(-property)?\s*:\s*all\b/, "`transition-all` — transition only transform/opacity.");
lineRule(isCSharp, /catch\s*\(\s*(System\.)?Exception(\s+\w+)?\s*\)/, "broad `catch (Exception)` — catch specific exceptions or let it propagate.");
lineRule(isCSharp, /\bcatch\s*\{/, "untyped `catch { }` — catch specific exceptions or let it propagate.");
lineRule(isCSharp, /\bdynamic\s+\w+\s*[=;]/, "`dynamic` — use a concrete type.");

// Multi-line rule: empty catch blocks (C#/TS/JS).
if (isCSharp || isScript) {
  for (const match of added.matchAll(/catch\s*(\([^)]*\))?\s*\{\s*\}/g)) {
    const lineStart = added.lastIndexOf("\n", match.index) + 1;
    const lineEnd = added.indexOf("\n", match.index);
    const lineText = added.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    if (/guard-allow:\s*\S/.test(lineText) || baselineNormalized.includes(normalize(match[0]))) continue;
    violations.push(`  empty catch block — handle, log, or propagate the error.\n    > ${normalize(match[0])}`);
  }
}

if (isAppSettings) {
  const placeholder = /(^$|dev|change-?me|placeholder|example|local|^\$\{)/i;
  for (const { text, line } of newLines) {
    const kv = text.match(/"(\w*(?:AccessKey|ApiKey|Secret|SigningKey|Password|Token)\w*)"\s*:\s*"([^"]*)"/i);
    if (kv && !placeholder.test(kv[2])) {
      violations.push(`  line ${line}: '${kv[1]}' looks like a real secret — use dotnet user-secrets or environment variables.`);
    }
    const pwd = text.match(/Password=([^;"]+)/i);
    if (pwd && !placeholder.test(pwd[1])) {
      violations.push(`  line ${line}: connection string password looks real — use user-secrets or environment variables.`);
    }
  }
}

if (violations.length) {
  block(
    `guard-patterns: blocked edit to ${file}\n${violations.join("\n")}\n` +
      "Fix the code. Only for a genuinely justified exception, add `guard-allow: <reason>` on the same line.",
  );
}
process.exit(0);
