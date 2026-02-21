# Development Plan

## Goal
Deliver a modular travel-accounting web app where travelers record expenses in local currency and track value in home currency (USD first).

## Delivery Strategy
Use vertical modules with clear ownership and integration points.
Each module ships with backend API, frontend UI, validation, tests, and docs updates.

## Module Roadmap
1. `module/foundation`
- Create backend and frontend solution structure.
- Add shared domain primitives (Money, Currency, Date, ExpenseCategory).
- Add baseline CI checks (build, type-check, tests).
- Add environment and configuration strategy.

2. `module/trips`
- Trip lifecycle: create, edit, archive.
- Set home currency and trip local currency.
- Define trip date range and destination.

3. `module/expenses`
- Expense CRUD with category, notes, date/time, amount, and currency.
- UX optimized for fast daily entry (mobile-first forms).
- Validation and error surfacing across API/UI.

4. `module/exchange-rates`
- Store and apply exchange rates per trip day.
- Manual rate entry first; provider integration can follow.
- Compute USD equivalent for each expense.

5. `module/accounting-ledger`
- Aggregate totals by day, category, and trip.
- Reconciliation view and discrepancy handling.
- Accounting-safe rounding strategy and tests.

6. `module/reports-export`
- Summary dashboard (local + USD totals).
- Export CSV for accounting workflows.
- Filters by date range, category, and trip.

7. `module/auth-and-multiuser` (if needed)
- User auth, ownership, and data isolation.
- Audit trail for critical accounting edits.

## Cross-Cutting Standards
- Backend: .NET 10 with modular project boundaries.
- Frontend: React.js with strict TypeScript.
- No silent failures; surface validation and system errors explicitly.
- Reuse shared helpers and avoid duplicated business logic.
- Add tests whenever behavior changes.

## Definition of Done (Per Module)
- API endpoints + contracts implemented.
- Frontend screens/components wired to real API.
- Unit/integration tests passing.
- Build/type-check clean.
- `README.md` and `CHANGELOG.md` updated.

## Immediate Next Execution (Foundation)
1. Scaffold solution structure:
- `src/backend/TravelAccounting.Api`
- `src/backend/TravelAccounting.Application`
- `src/backend/TravelAccounting.Domain`
- `src/backend/TravelAccounting.Infrastructure`
- `src/frontend/web`

2. Add first domain model set:
- Currency value object
- Money value object
- Expense category enum

3. Add health endpoint + basic React shell.

4. Add automated checks:
- `.NET` build + test
- React type-check + test/lint

5. Document local run steps in `README.md`.

## Foundation Status
- Status: Completed
- Backend solution scaffolded and targeting .NET 10.
- Shared domain primitives added (`Currency`, `Money`, `TravelDate`, `ExpenseCategory`).
- Health endpoint implemented and wired through DI.
- Frontend React shell scaffolded in `src/frontend/web`.
- Baseline checks implemented:
  - Backend: `dotnet build`, `dotnet test`
  - Frontend: `npm run lint`, `npm run typecheck`, `npm run test`
- CI workflow added in `.github/workflows/ci.yml`.
- Environment/config strategy implemented through typed `App` options with startup validation.

## Trips Status
- Status: Completed (MVP)
- Implemented lifecycle operations: create, edit, list, get, archive.
- Added backend domain/application/infrastructure slices for trips.
- Added frontend trips UI integrated with backend endpoints.
- Persistence is currently in-memory; database persistence remains for a later module increment.

## Next Module
1. `module/expenses`
- Add expense CRUD with category, date/time, amount, and currency.
- Link expenses to trips.
- Keep conversion-ready data for exchange-rate module.

## Expenses Status
- Status: Completed (MVP)
- Implemented expense lifecycle operations: create, edit, list, get, delete.
- Linked expenses to trips at API and service level.
- Added reference endpoint for destination country/currency metadata.
- Updated frontend with country selector and explicit origin vs destination currency labels.
- Added API integration test coverage for expense creation flow.

## Next Module
1. `module/exchange-rates`
- Add per-day exchange rate storage per trip.
- Compute USD-equivalent amounts per expense.
- Keep manual exchange-rate entry as first implementation.

## Exchange Rates Status
- Status: Completed (MVP)
- Implemented per-day trip exchange rate storage and upsert/list API.
- Applied conversion from expense currency to trip home currency during expense reads.
- Exposed conversion fields (`homeAmount`, `homeCurrency`, `exchangeRateUsed`) in expense DTO.
- Added automatic provider-based rate assignment with converted-amount display in frontend.
- Added API integration tests for conversion path and exchange-rate endpoint validation.

## Next Module
1. `module/accounting-ledger`
- Aggregate totals by day/category/trip in local and home currency.
- Add discrepancy/reconciliation views.
- Define rounding/reporting rules for accounting exports.

## Accounting Ledger Status
- Status: Completed (MVP)
- Implemented backend ledger summary endpoint:
  - `GET /api/trips/{tripId}/ledger/summary`
- Added trip-scoped aggregation in local/home currency:
  - Totals across the trip
  - Totals by category
  - Totals by day
  - Converted vs missing-conversion counters
- Added frontend ledger summary section in expenses workflow.
- Added API integration test coverage for ledger summary aggregation.

## Next Module
1. `module/reports-export`
- Build report/export views with accounting filters.
- Add CSV export for accounting workflows.
