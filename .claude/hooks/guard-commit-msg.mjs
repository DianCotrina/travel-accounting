// PreToolUse guard: commit subjects must follow Conventional Commits 1.0.0.
// Checks `git commit -m "<msg>"` and heredoc forms (`-m "$(cat <<'EOF' … EOF)"`). Commits that open
// an editor or use -F cannot be inspected here and are left to review.
import { block, readInput } from "./lib.mjs";

const TYPES = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"];
const SUBJECT = new RegExp(`^(${TYPES.join("|")})(\\([a-z0-9][a-z0-9./-]*\\))?!?: \\S.*$`);
const MAX_SUBJECT = 72;

const input = readInput();
if (input.tool_name !== "Bash") process.exit(0);
const command = String(input.tool_input?.command ?? "");
if (!/(^|[;&|\n]\s*)git\s+commit\b/.test(command)) process.exit(0);
if (/\s--amend\b/.test(command) && !/\s-m\b/.test(command)) process.exit(0); // amend keeping message

function extractSubject(cmd) {
  // Heredoc: first non-empty line after <<'EOF' / <<EOF / <<"EOF".
  const heredoc = cmd.match(/<<-?\s*['"]?(\w+)['"]?\s*\n([\s\S]*?)\n\s*\1\b/);
  if (heredoc && /-m\s+["']?\$\(/.test(cmd)) {
    return heredoc[2].split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  }
  const quoted = cmd.match(/(?:^|\s)(?:-m|--message)(?:\s+|=)(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/);
  if (quoted) {
    const message = (quoted[1] ?? quoted[2] ?? "").replace(/\\"/g, '"');
    return message.split("\n")[0].trim();
  }
  return null;
}

const subject = extractSubject(command);
if (subject === null) process.exit(0);

// Git's own generated subjects are fine.
if (/^(Merge|Revert) /.test(subject)) process.exit(0);

const problems = [];
if (!SUBJECT.test(subject)) {
  problems.push(`subject must match '<type>(<scope>)!: <summary>' with type one of: ${TYPES.join(", ")}`);
}
if (subject.length > MAX_SUBJECT) problems.push(`subject is ${subject.length} characters (max ${MAX_SUBJECT})`);
if (/\.$/.test(subject)) problems.push("subject must not end with a period");

if (problems.length) {
  block(
    `guard-commit-msg: commit message is not Conventional Commits.\n  > ${subject}\n- ${problems.join("\n- ")}\n` +
      "Examples: 'feat(trips): add archive filter', 'fix(reports)!: rename CSV columns' + 'BREAKING CHANGE: …' footer.",
  );
}
process.exit(0);
