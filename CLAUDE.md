# CLAUDE.md

@AGENTS.md

## Claude Code Setup

This repo ships shared Claude Code configuration in `.claude/` (committed). Personal overrides go in `.claude/settings.local.json` or `CLAUDE.local.md` (both gitignored).

### Rules (`.claude/rules/`)
Loaded automatically when you work on matching paths:
- `backend.md` — `src/backend/**`
- `frontend.md` — `src/frontend/web/**`
- `frontend-design.md` — frontend components, CSS, and brand assets

### Skills (`.claude/skills/`)
Use the matching skill instead of improvising the workflow:
- `new-module` — start a module: branch, vertical slices, tests, docs, Definition of Done.
- `add-endpoint` — add or change an API endpoint end-to-end (domain → API → frontend call → tests).
- `ef-migration` — change the database schema safely with EF Core migrations.
- `ship` — final verification, docs, commit, and push for the current branch.
- `release` — cut a SemVer release from `main`: compute the bump, update versions and `CHANGELOG.md`, tag `vX.Y.Z`.

### Guards (`.claude/hooks/`, wired in `.claude/settings.json`)
These run automatically; treat a block as a real defect to fix, not something to work around:
- `guard-branch` — blocks edits, commits, and pushes while on `main`, force pushes, and pushes targeting `main` (tag pushes are allowed); PR merges must use `--auto --rebase` and never `--admin`; `git merge` (non fast-forward) and `git pull` without rebase are blocked to keep history linear.
- `guard-commit-msg` — blocks `git commit -m` messages that are not Conventional Commits.
- `guard-patterns` — blocks `as any`, `as unknown as`, `transition-all`, empty catch blocks, broad `catch (Exception)`, and real-looking secrets in `appsettings*.json`.
- `post-edit-check` — after each edit, runs ESLint on edited TS/TSX files and `dotnet build` on the edited .NET project; fix reported errors before moving on.
- `stop-gate` — before a turn ends with changes under `src/`, runs the required checks for touched areas and blocks until they pass.

Legitimate exceptions to `guard-patterns` must carry an inline justification on the same line: `guard-allow: <reason>` (e.g. a top-level exception-handling middleware). Never add `guard-allow` just to get past a check.

### Linear history and auto-merge (standing authorization)
- Keep history linear: `git pull --rebase`, update branches with `git rebase origin/main` (or `git rebase --onto`), publish rebased branches with `git push --force-with-lease`. Never merge `main` into a branch.
- After opening a PR to `main`, enable auto-merge without asking: `gh pr merge <n> --auto --rebase`. Required checks gate the merge.
- Both commands are pre-approved in `.claude/settings.json`.

### Working notes
- Prefer the skills' checklists over memory for multi-step work.
- When a guard reports missing tooling (.NET SDK, `node_modules`), tell the user instead of claiming checks passed.
