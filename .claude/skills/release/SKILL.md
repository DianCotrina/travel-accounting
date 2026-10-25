---
name: release
description: Cut a SemVer release of travel-accounting from main — compute the next version from Conventional Commits since the last tag, bump versions, finalize CHANGELOG.md, merge via PR, and tag vX.Y.Z. Use when the user asks to release, cut a version, bump the version, or tag.
---

# Release (SemVer)

Releases are annotated tags `vX.Y.Z` on `main`. There are no release branches.

## 1. Inspect what is unreleased
```bash
git fetch origin --tags
LAST=$(git describe --tags --abbrev=0 --match "v*" origin/main 2>/dev/null || echo "")
git log --format='%s' ${LAST:+$LAST..}origin/main
```
If there is no tag yet, the release is the version already in `src/backend/Directory.Build.props` (initial release).

## 2. Compute the next version
From the commit subjects (and `BREAKING CHANGE:` footers) since `LAST`:

| Change found | `>= 1.0.0` | `0.x` (current line) |
|---|---|---|
| breaking (`!` or `BREAKING CHANGE:`) | MAJOR | MINOR |
| `feat` | MINOR | PATCH |
| `fix` / `perf` / `revert` | PATCH | PATCH |
| only `docs`/`chore`/`ci`/`test`/`style`/`refactor`/`build` | no release needed (ask the user) | same |

State the computed version and the reason in your reply. Moving to `1.0.0` is a product decision — only on explicit user request.

## 3. Prepare the release branch
```bash
git switch -c chore/release-vX.Y.Z origin/main
git branch --unset-upstream
```
Update, all to the same `X.Y.Z`:
- `src/backend/Directory.Build.props` → `<Version>X.Y.Z</Version>`
- frontend: `npm --prefix src/frontend/web version X.Y.Z --no-git-tag-version` (updates `package.json` and `package-lock.json`)
- `CHANGELOG.md`:
  - rename `## [Unreleased]` content into a new `## [X.Y.Z] - YYYY-MM-DD` section and leave an empty `## [Unreleased]` above it;
  - check every notable commit since `LAST` is represented; mark breaking changes **BREAKING** with migration notes;
  - update the compare links at the bottom: `[Unreleased]: …/compare/vX.Y.Z...HEAD`, `[X.Y.Z]: …/compare/vPREV...vX.Y.Z` (or `…/releases/tag/vX.Y.Z` for the first release).

Verify versions match:
```bash
grep -o '<Version>[^<]*' src/backend/Directory.Build.props
node -p "require('./src/frontend/web/package.json').version"
```

## 4. Verify, commit, PR
- Run the full required checks (backend and frontend) — a release is never cut on unverified code.
- Commit: `chore(release): vX.Y.Z`, push, open a PR to `main` titled `chore(release): vX.Y.Z` with the changelog section as the body.
- Enable auto-merge: `gh pr merge <number> --auto --merge --subject "chore(release): vX.Y.Z (#<number>)"`, and tag (step 5) once it has merged.

## 5. Tag (after the PR has merged)
```bash
git fetch origin
git switch main && git pull --ff-only
git tag -a vX.Y.Z -m "vX.Y.Z" <merge-commit-sha>
git push origin vX.Y.Z
```
Optionally publish a GitHub release from the tag with the changelog section:
```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <changelog-section-file>
```
Never delete, move, or recreate a pushed tag; fix mistakes with a new PATCH release.
