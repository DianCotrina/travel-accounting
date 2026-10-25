---
name: ship
description: Final verification and delivery for travel-accounting work — run required checks for touched areas, confirm docs, commit, and push the current working branch. Use when a task is complete or the user says ship, commit, or push.
---

# Ship

## 1. Branch sanity
```bash
git branch --show-current
```
Must not be `main`. If it is, stop and create the proper branch (see `AGENTS.md`).

## 2. Determine touched areas
```bash
git status --short
git diff --name-only origin/main...HEAD
```

## 3. Run required checks (only for touched areas)
- `src/backend/**` → `dotnet build src/backend/TravelAccounting.sln` and `dotnet test src/backend/TravelAccounting.sln`
- `src/frontend/web/**` → `npm --prefix src/frontend/web run typecheck`, `run lint`, `run test`

If any check fails: fix and re-run. If a tool is missing, stop and tell the user exactly what is missing — do not commit unverified code as if it passed.

## 4. Docs
- `CHANGELOG.md` `[Unreleased]` entry for notable changes.
- `README.md` / `DEVELOPMENT_PLAN.md` / `docs/PRD.md` updated if behavior, endpoints, or module status changed.

## 5. Commit and push
- Stage only files that belong to this change (no screenshots, local settings, or build output).
- Conventional Commits subject (`feat(scope): …`, `fix(scope): …`, `!` + `BREAKING CHANGE:` footer for breaking changes); body explains why when not obvious.
- Push: `git push -u origin HEAD`, then open or update the PR against `main`.
- Enable auto-merge right away (standing authorization, do not ask): `gh pr merge <number> --auto --merge --subject "<conventional subject> (#<number>)"`. It merges when required checks pass; never use `--admin`.

## 6. Report
State what was verified (with the commands run), what was not, and the branch/commit pushed.
