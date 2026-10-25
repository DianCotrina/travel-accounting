# AGENTS.md

Core engineering standards for any coding agent (Claude Code, Codex, others) working in this repository.
Area-specific rules live in `.claude/rules/` — read the matching file before editing that area:

| Area | Rules file |
|---|---|
| Backend (`src/backend/**`) | `.claude/rules/backend.md` |
| Frontend code (`src/frontend/web/**`) | `.claude/rules/frontend.md` |
| Frontend visual design (components, CSS, landing) | `.claude/rules/frontend-design.md` |

Product scope and open questions: `docs/PRD.md` (when present). Architecture: `docs/backend-design-structure.md`.

## Project Purpose
Sacatucuenta is a travel accounting web app. Travelers register daily expenses (Uber rides, meals, tourist activities, museum entries, snacks) in the local currency of the country they visit and track their value in their home currency (USD first).
Example: an American traveling in Argentina records expenses in ARS and sees the USD impact.

## Tech Stack
- Backend: .NET 10 / ASP.NET Core / C#, EF Core + PostgreSQL, JWT bearer auth, xUnit.
- Frontend: React 19 + TypeScript (strict) + Vite, Tailwind CSS v4, Vitest + Testing Library.
- Architecture: modular monolith with layered projects (Api → Application → Domain ← Infrastructure).

## Repository Map
```
src/backend/
  TravelAccounting.Api/             Controllers, API request models, auth wiring, Program.cs (composition root)
  TravelAccounting.Application/     Use-case services, DTOs, repository/provider interfaces, AddApplication()
  TravelAccounting.Domain/          Entities, value objects, enums — no framework dependencies
  TravelAccounting.Infrastructure/  EF Core (AppDbContext, migrations, repositories), external providers, AddInfrastructure()
  tests/                            TravelAccounting.Domain.Tests, TravelAccounting.Api.Tests
src/frontend/web/
  src/app/                          Auth context, shared types, catalogs
  src/components/                   Pages, sections, landing UI
docs/                               PRD, architecture, workflow diagrams
```
Feature modules (Trips, Expenses, ExchangeRates, AccountingLedger, ReportsExport, Audit, Auth) are folders inside each layer project.

## Branching Strategy
- Base release branch: `release/2026.1.0`.
- Never commit or push directly to `main` or `release/*`.
- New work starts in its own branch created from `release/2026.1.0`:
  - `module/<module-name>` for features/modules, `fix/<topic>`, `docs/<topic>`, `chore/<topic>` otherwise.
- New branches must not track `release/*` as upstream; publish with `git push -u origin HEAD`.

## Engineering Rules
- Optimize for correctness, clarity, and reliability over speed.
- Avoid risky shortcuts, speculative changes, and messy hacks.
- Solve the root cause or core ask, not only a symptom.
- Follow existing codebase conventions (patterns, helpers, naming, formatting, localization). If divergence is necessary, state the reason explicitly.
- Cover all relevant surfaces end-to-end (backend route ↔ frontend call ↔ tests ↔ docs) so behavior stays consistent.
- Preserve intended behavior and UX by default. For intentional behavior changes, gate or flag the change and add tests.
- Do not add broad try/catch blocks or success-shaped fallbacks.
- Do not swallow errors; surface or propagate them explicitly.
- Do not silently fail invalid input (no quiet early returns); return explicit errors.
- Maintain type safety; avoid `as any`, `as unknown as ...`, and `dynamic`. Prefer proper types and guards.
- Search for prior art before adding helpers; reuse or extract shared code instead of duplicating logic.
- Never commit real secrets. Local-only values must be clearly marked dev-only; real keys go in user-secrets or environment variables.
- Read enough context first, then batch coherent edits instead of many micro-edits.
- Bias to action: implement with reasonable assumptions unless truly blocked.
- End each task with concrete edits, or a specific blocker plus a targeted question.

## Required Checks
Run the checks for every area you touched before committing:
```bash
# Backend
dotnet build src/backend/TravelAccounting.sln
dotnet test src/backend/TravelAccounting.sln

# Frontend
npm --prefix src/frontend/web run typecheck
npm --prefix src/frontend/web run lint
npm --prefix src/frontend/web run test
```
If a required tool is missing (no .NET SDK, no `node_modules`), say so explicitly — never report unverified work as passing.

## Delivery Workflow
- After code changes, run the required checks.
- If checks pass, commit and push automatically to the current working branch (never `main` or `release/*`).
- If checks fail, report the failures clearly and do not commit or push until resolved.
- Commit messages: imperative, concise subject describing the change (e.g. `Add CSV export for trip reports`).
- In PowerShell, do not chain commands with `&&`; use `;` or separate commands.

## Definition of Done (per module or feature)
- API endpoints and contracts implemented; frontend wired to the real routes.
- Domain/Application/Infrastructure slices updated together; EF migration added when the schema changes.
- Unit/integration tests added or updated and passing; build and type-check clean.
- `README.md`, `CHANGELOG.md` (and `DEVELOPMENT_PLAN.md` for modules) updated.

## Documentation
- Keep `README.md` and code-level docs aligned with behavior.
- Record notable user-facing or architectural changes in `CHANGELOG.md` under `[Unreleased]`.
- Repository docs are written in English.
