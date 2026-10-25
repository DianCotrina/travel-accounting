// PreToolUse guard: no edits, commits, merges, or pushes while on main; no force pushes; no pushes
// targeting main. Pushing release tags (vX.Y.Z) is allowed from any branch.
import { PROTECTED_BRANCH, block, currentBranch, isInside, projectDir, readInput } from "./lib.mjs";

const input = readInput();
const dir = projectDir(input);
const branch = currentBranch(dir);
if (!branch) process.exit(0); // not a git checkout

const onProtected = PROTECTED_BRANCH.test(branch);
const tool = input.tool_name;
const toolInput = input.tool_input ?? {};

const fix = "Create a working branch first: git switch -c <type>/<name> origin/main && git branch --unset-upstream";

if (tool !== "Bash") {
  const file = toolInput.file_path ?? toolInput.notebook_path;
  if (onProtected && file && isInside(file, dir)) {
    block(`guard-branch: editing files on protected branch '${branch}' is not allowed.\n${fix}`);
  }
  process.exit(0);
}

const command = String(toolInput.command ?? "");
// Split chained commands so each git invocation is checked on its own.
const segments = command.split(/&&|\|\||;|\n/).map((s) => s.trim()).filter(Boolean);
const switchesBranch = segments.some((s) => /^git\s+(switch|checkout)\b/.test(s));

for (const segment of segments) {
  const push = segment.match(/^git\s+push\b(.*)$/);
  if (push) {
    const args = push[1];
    if (/(^|\s)(--force|-f)(\s|$)/.test(args)) {
      block("guard-branch: force push is not allowed. Use --force-with-lease on your own working branch only if strictly necessary.");
    }
    if (/(^|[\s:+])(refs\/heads\/)?(main|master)(\s|$)/.test(args)) {
      block("guard-branch: pushing to main is not allowed. Open a pull request from your working branch instead.");
    }
    const tagOnly = /(^|\s)(--tags|refs\/tags\/\S+|v\d+\.\d+\.\d+\S*)(\s|$)/.test(args) && !/(^|\s)HEAD(\s|:|$)/.test(args);
    if (onProtected && !switchesBranch && !tagOnly) {
      block(`guard-branch: pushing while on protected branch '${branch}' is not allowed.\n${fix}`);
    }
  }

  const mutating = segment.match(/^git\s+(commit|merge|cherry-pick|revert|am|rebase)\b/) || /^git\s+reset\b.*--hard/.test(segment);
  if (mutating && onProtected && !switchesBranch) {
    block(`guard-branch: '${segment}' on protected branch '${branch}' is not allowed.\n${fix}`);
  }
}

process.exit(0);
