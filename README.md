# travel-accounting

Travel accounting web application to register daily expenses in local currency and track totals in home currency (USD first).

## Structure

Backend scaffold lives in `src/backend`:

- `TravelAccounting.Api`
- `TravelAccounting.Application`
- `TravelAccounting.Domain`
- `TravelAccounting.Infrastructure`
- `tests/TravelAccounting.Domain.Tests`

Frontend scaffold lives in `src/frontend/web`:

- React + TypeScript + Vite
- Health check shell connected to `/api/health`
- Vitest + Testing Library baseline
- Modular UI structure:
  - `src/frontend/web/src/app` for shared app-level types/state defaults
  - `src/frontend/web/src/components` for feature UI sections (`HealthCard`, `TripsSection`, `ExpensesSection`)

## Foundation Coverage

Implemented foundation domain primitives:

- `Currency` value object
- `Money` value object
- `TravelDate` value object
- `ExpenseCategory` enum

Implemented API baseline:

- `GET /api/health`

Implemented DI baseline:

- Composition root in `src/backend/TravelAccounting.Api/Program.cs`
- `AddApplication()` in `src/backend/TravelAccounting.Application/ApplicationServiceCollectionExtensions.cs`
- `AddInfrastructure(...)` in `src/backend/TravelAccounting.Infrastructure/InfrastructureServiceCollectionExtensions.cs`
- `HealthController` resolves `IHealthStatusService` from DI

Implemented configuration baseline:

- Typed options section: `App` (`HomeCurrency`, `SupportedCurrencies`)
- Startup validation via `ValidateDataAnnotations()`, custom validation, and `ValidateOnStart()`

## Trips Module (Phase 2)

Implemented backend functionality:

- `GET /api/trips`
- `GET /api/trips/{id}`
- `POST /api/trips`
- `PUT /api/trips/{id}`
- `POST /api/trips/{id}/archive`

Implemented frontend functionality:

- Create trip form
- Edit trip flow
- Archive trip action
- Trip list view with status and currencies

Current persistence scope:

- EF Core repository backed by PostgreSQL.
- Data persists across API process restarts.

## Expenses Module (Phase 3)

Implemented backend functionality:

- `GET /api/trips/{tripId}/expenses`
- `GET /api/trips/{tripId}/expenses/{id}`
- `POST /api/trips/{tripId}/expenses`
- `PUT /api/trips/{tripId}/expenses/{id}`
- `DELETE /api/trips/{tripId}/expenses/{id}`
- `GET /api/reference/countries`

Implemented frontend functionality:

- Expense create/edit/delete UI linked to selected trip
- Category/amount/currency/date/notes fields
- Destination country selector fed by reference endpoint
- Clear currency labeling:
  - Origin currency (home currency)
  - Destination currency (local currency)

## Exchange Rates Module (Phase 4)

Implemented backend functionality:

- `GET /api/trips/{tripId}/exchange-rates`
- `PUT /api/trips/{tripId}/exchange-rates`
- Expense list now includes converted home-currency fields:
  - `homeAmount`
  - `homeCurrency`
  - `exchangeRateUsed`

Implemented frontend functionality:

- Automatic exchange-rate assignment from provider during expense conversion
- Saved rates list
- Home-currency equivalent display per expense
- Conversion fallback message when a rate is missing

## Accounting Ledger Module (Phase 5)

Implemented backend functionality:

- `GET /api/trips/{tripId}/ledger/summary`

Implemented frontend functionality:

- Ledger summary for the selected trip in Expenses section.
- Aggregated totals:
  - Trip totals in local and home currency.
  - Totals by category.
  - Totals by day.
  - Converted vs missing-conversion counts.

## Reports Export Module (Phase 6)

Implemented backend functionality:

- `GET /api/trips/{tripId}/reports/summary`
- `GET /api/trips/{tripId}/reports/export/csv`

Implemented frontend functionality:

- Report filter UI by date range and category.
- Filtered report summary (counts and totals by category).
- CSV export download for accounting workflows.

## Auth and Multiuser Module (Phase 7)

Implemented backend functionality:

- Per-user ownership on trips and user-isolated access for:
  - Trips
  - Expenses
  - Exchange rates
  - Ledger summaries
  - Reports/exports

Implemented frontend functionality:

- Session-based login state and protected dashboard routing.

## Real Authentication Module (Phase 9)

Implemented backend functionality:

- Replaced header-based auth with JWT bearer authentication.
- Validates `iss`, `aud`, lifetime, and signature (symmetric key mode or authority mode).
- User identity is read from JWT `sub` claim by `ICurrentUserContext`.
- Removed development header auth handler.

Implemented frontend functionality:

- Dashboard API calls now send `Authorization: Bearer <token>`.
- Auth context stores a bearer token in session and blocks login when token is not configured.
- Added `.env` support for `VITE_AUTH_BEARER_TOKEN`.

## Database Persistence Module (Phase 8)

Implemented backend functionality:

- Replaced in-memory persistence with EF Core + PostgreSQL:
  - `EfTripRepository`
  - `EfExpenseRepository`
  - `EfExchangeRateRepository`
- Added database context and mappings:
  - `src/backend/TravelAccounting.Infrastructure/Data/AppDbContext.cs`
  - `src/backend/TravelAccounting.Infrastructure/Data/Configurations/`
- Added initial migration:
  - `src/backend/TravelAccounting.Infrastructure/Data/Migrations/`
- API startup applies pending migrations automatically for relational providers.
- API integration tests run against EF Core in-memory provider for isolated test runs.

## Local Commands

Build backend:

```powershell
dotnet build src/backend/TravelAccounting.sln
```

Run backend tests:

```powershell
dotnet test src/backend/TravelAccounting.sln
```

Run API:

```powershell
dotnet run --project src/backend/TravelAccounting.Api
```

Start local PostgreSQL (Phase 8):

```powershell
docker compose up -d
```

Generate EF migration:

```powershell
dotnet dotnet-ef migrations add <MigrationName> --project src/backend/TravelAccounting.Infrastructure --startup-project src/backend/TravelAccounting.Api --output-dir Data/Migrations
```

Apply EF migration:

```powershell
dotnet dotnet-ef database update --project src/backend/TravelAccounting.Infrastructure --startup-project src/backend/TravelAccounting.Api
```

Install frontend dependencies:

```powershell
cd src/frontend/web
npm install
```

Run frontend checks:

```powershell
npm run lint
npm run typecheck
npm run test
```

Run frontend app:

```powershell
npm run dev
```

Health check endpoint:

```text
GET http://localhost:<port>/api/health
```

Trips endpoints quick check:

```text
GET http://localhost:<port>/api/trips
POST http://localhost:<port>/api/trips
```

Expenses endpoints quick check:

```text
GET http://localhost:<port>/api/trips/{tripId}/expenses
POST http://localhost:<port>/api/trips/{tripId}/expenses
```

Exchange rates endpoints quick check:

```text
GET http://localhost:<port>/api/trips/{tripId}/exchange-rates
PUT http://localhost:<port>/api/trips/{tripId}/exchange-rates
```

Ledger endpoint quick check:

```text
GET http://localhost:<port>/api/trips/{tripId}/ledger/summary
```

Reports endpoints quick check:

```text
GET http://localhost:<port>/api/trips/{tripId}/reports/summary
GET http://localhost:<port>/api/trips/{tripId}/reports/export/csv
```

Auth header for protected endpoints:

```text
Authorization: Bearer <your-jwt-token>
```

Auto-rate behavior:

- When an expense is listed and no local rate exists for that trip/day/currency pair, backend fetches a rate from configured provider and persists it.
- Current provider: exchangerate.host (`ExternalServices:ExchangeRates:BaseUrl`).
- Required setting: `ExternalServices:ExchangeRates:AccessKey`.

Trips regression safety:

- API integration tests in `src/backend/tests/TravelAccounting.Api.Tests/TripsApiTests.cs` now cover create-trip model binding/validation to prevent record-DTO validation regressions from surfacing as `500`.

Frontend API base URL (optional):

```text
src/frontend/web/.env.example
```

Includes:

- `VITE_API_BASE_URL`
- `VITE_AUTH_BEARER_TOKEN`

Frontend screenshot helper (optional, Brave + `puppeteer-core`):

- Script: `src/frontend/web/scripts/screenshot.mjs`
- Command:

```powershell
npm --prefix src/frontend/web run screenshot -- http://localhost:5173
```

- Required env var:

```powershell
$env:BRAVE_EXECUTABLE_PATH="<put your path here>"
```

Frontend landing page:

- The app now includes a standalone landing page built with reusable React components and the project logo (`assets/logos/sacatucuenta-logo.png`, served in frontend public assets).
- The landing page includes a product-preview/video placeholder section and visual design references for future UI iterations.
- Landing categories are backed by JSON data (`src/frontend/web/src/app/landingCategories.json`) for reuse in dropdowns and filters.
- The landing page includes a 4-step "How it works" timeline and a placeholder current-users/ratings social-proof section.
- The landing page now includes explicit `About`, `Testimonials`, `Contact Us`, and `Footer` sections with visible contact information and clear CTAs.
- Login options UI includes provider-style entry methods for Gmail, phone number, iCloud, and passkey (frontend preview only).

## Troubleshooting

`Unexpected token '<', "<!doctype "... is not valid JSON` on API Health:

- Root cause: frontend requested `/api/health` from the Vite dev server without proxying to backend, so the response was `index.html` instead of JSON.
- Signal: response body starts with `<!doctype html>` while code expects JSON.
- Fix applied in repo: Vite proxy routes `/api` to backend (`src/frontend/web/vite.config.ts`), and frontend falls back to relative `/api/health` when `VITE_API_BASE_URL` is not set.
- If you still see it: restart `npm run dev` after config changes and ensure API is running.

`[vite] http proxy error ... ECONNREFUSED` for `/api/*`:

- Root cause: frontend proxy cannot reach backend API target.
- Typical causes:
  - API process is not running.
  - API running on a different port than proxy target.
- Repo defaults:
  - API HTTP profile: `http://localhost:5214`
  - Frontend env example: `src/frontend/web/.env.example` uses `VITE_API_BASE_URL=http://localhost:5214`
- Fix:
  - Start API: `dotnet run --project src/backend/TravelAccounting.Api`
  - Restart frontend dev server after env/config changes.

`500` with `Record type 'X' has validation metadata defined on property ... will be ignored`:

- Symptom: MVC throws before controller logic runs, usually inside model-binding validation.
- Root cause: request DTO defined as a positional `record` with validation attributes on properties, while ASP.NET expects record validation metadata on constructor parameters for that shape.
- Fix applied in repo: changed request DTO to a class with init properties and data annotations (`src/backend/TravelAccounting.Api/Trips/UpsertTripRequest.cs`).
- Standard going forward: for API request DTOs, default to `class` + `[Required]`/annotations on properties.
- If a `record` is required: place validation attributes on constructor parameters, not only on generated properties.

`500` from exchange-rate provider with `HttpRequestException` (for example 404):

- Symptom: expense creation/list can fail if external rate lookup exceptions are not handled.
- Root cause: provider/network failures can bubble into conversion flow if not handled as optional conversion.
- Fix applied in repo:
  - Provider no longer throws on non-success responses; logs warning and returns `null`.
  - Expense conversion now treats provider request failures as non-fatal and keeps expense creation successful.
- User-visible behavior: expense is saved; conversion fields show unavailable (`homeAmount` null) until a rate can be resolved.

`Exchange rate provider returned missing access key / auth errors`:

- Root cause: exchangerate.host now requires `access_key`.
- Fix: configure `ExternalServices:ExchangeRates:AccessKey` (in secrets or environment-specific config).
- User-visible behavior while missing: expense is saved; conversion fields remain unavailable.

## Framework

Backend projects target `net10.0`.
Required SDK: `.NET SDK 10.x` (validated with `10.0.103`).

## Architecture Visual

- Workflow diagram: `docs/workflow-diagram.md`
