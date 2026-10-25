// PreToolUse guard: no edits, commits, merges, or pushes while on main; no force pushes; no pushes
// targeting main. Pushing release tags (vX.Y.Z) is allowed from any branch. Linear history: no
// non-fast-forward `git merge`, no `git pull` without rebase, PRs merge only via auto rebase-merge.
import { PROTECTED_BRANCH, block, currentBranch, git, isInside, projectDir, readInput } from "./lib.mjs";

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

  // PR merges must wait for required checks (auto-merge, never --admin) and keep history linear (rebase only).
  const prMerge = segment.match(/^gh\s+pr\s+merge\b(.*)$/);
  if (prMerge) {
    const args = prMerge[1];
    const flag = (name) => new RegExp(`(^|\\s)--${name}(\\s|=|$)`).test(args);
    if (flag("admin")) {
      block("guard-branch: `gh pr merge --admin` bypasses required checks and is not allowed. Use `gh pr merge <n> --auto --rebase`.");
    }
    if (!flag("disable-auto")) {
      if (!flag("auto")) {
        block("guard-branch: merge PRs with auto-merge so required checks gate them: `gh pr merge <n> --auto --rebase`.");
      }
      if (flag("merge") || flag("squash") || !flag("rebase")) {
        block("guard-branch: linear history requires rebase-and-merge: `gh pr merge <n> --auto --rebase` (no --merge, no --squash).");
      }
    }
  }

  // Linear history: integrate by rebasing, never with merge commits.
  const gitMerge = segment.match(/^git\s+merge(\s.*)?$/);
  if (gitMerge && !/(^|\s)--(ff-only|abort|continue|quit)(\s|$)/.test(gitMerge[1] ?? "")) {
    block("guard-branch: `git merge` creates merge commits. Keep history linear: `git rebase origin/main` (or `git merge --ff-only`).");
  }
  const gitPull = segment.match(/^git\s+pull(\s.*)?$/);
  if (gitPull) {
    const args = gitPull[1] ?? "";
    const rebaseFlag = /(^|\s)(--rebase(=\S+)?|-r|--ff-only)(\s|$)/.test(args);
    const noRebase = /(^|\s)(--no-rebase|--no-ff|--rebase=false)(\s|$)/.test(args);
    const configured = ["true", "merges", "interactive"].includes(git(["config", "--get", "pull.rebase"], dir).out)
      || git(["config", "--get", "pull.ff"], dir).out === "only";
    if (noRebase || (!rebaseFlag && !configured)) {
      block("guard-branch: pull with rebase to keep history linear: `git pull --rebase` (or set `git config pull.rebase true`).");
    }
  }

  const mutating = segment.match(/^git\s+(commit|merge|cherry-pick|revert|am|rebase)(\s|$)/) || /^git\s+reset\b.*--hard/.test(segment);
  if (mutating && onProtected && !switchesBranch) {
    block(`guard-branch: '${segment}' on protected branch '${branch}' is not allowed.\n${fix}`);
  }
}

process.exit(0);
