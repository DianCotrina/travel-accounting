---
name: new-module
description: Start and deliver a new feature module in travel-accounting (branch from main, vertical slices across Domain/Application/Infrastructure/API/frontend, tests, docs). Use when the user asks to build a new module, phase, or feature area.
---

# New Module

Deliver a module as one vertical slice that meets the Definition of Done in `AGENTS.md`.

## 1. Branch
```bash
git fetch origin
git switch -c module/<module-name> origin/main
git branch --unset-upstream
```
Keep the branch current by rebasing (`git fetch origin && git rebase origin/main`), never by merging `main` in.
Confirm `git branch --show-current` is the new branch before editing anything.

## 2. Scope
- Read `docs/PRD.md` (requirements, open questions) and the module's section in `DEVELOPMENT_PLAN.md`.
- Write down in your reply: endpoints, domain changes, schema changes, frontend surfaces, and which PRD requirements/questions this touches. If a blocking PRD question applies, ask it before coding.

## 3. Implement in this order
1. **Domain** — entities/value objects with invariants (`.claude/rules/backend.md`). Domain tests first for new invariants.
2. **Application** — interfaces, `sealed record` DTOs, `internal sealed` service; ownership checks and audit logging on mutations. Register in `AddApplication()`.
3. **Infrastructure** — EF configuration + repository, registered in `AddInfrastructure()`. Schema change → `ef-migration` skill.
4. **API** — controller + class-based request models. Follow `add-endpoint` for each endpoint.
5. **Frontend** — types in `src/app/types.ts`, calls via `api<T>()` with exact backend routes, UI per `.claude/rules/frontend*.md`.

## 4. Tests
- Domain tests for invariants and money math.
- API integration tests: happy path, validation errors, not-found, cross-user isolation, audit entries for mutations.
- Frontend tests asserting request paths and user-visible behavior.

## 5. Docs
- `README.md`: new section `## <Module> Module (Phase N)` listing endpoints and UI behavior.
- `CHANGELOG.md` `[Unreleased]`: Added/Changed entries (mark **BREAKING** changes).
- `DEVELOPMENT_PLAN.md`: mark status and set the next module.
- `docs/PRD.md`: update requirement status / resolved questions if applicable.

## 6. Ship
Run the `ship` skill.
