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

```bash
# Backend
dotnet build
dotnet test

# Frontend
npm run lint
npm run typecheck
npm run test
```
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

```http
GET /api/trips/{tripId}/ledger/summary
```
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

## Reports Export Status
- Status: Completed (MVP)
- Implemented filtered reporting endpoint:

```http
GET /api/trips/{tripId}/reports/summary
```

- Implemented CSV export endpoint:

```http
GET /api/trips/{tripId}/reports/export/csv
```
- Added report filters by date range and category.
- Added frontend report summary + CSV download workflow.
- Added API integration tests for summary filters and CSV export.

## Next Module
1. `module/auth-and-multiuser` (if needed)
- Add ownership boundaries and authentication model.
- Define audit requirements for accounting-sensitive edits.

## Auth and Multiuser Status
- Status: Completed (MVP)
- Implemented header-based authentication for protected APIs (`X-User-Id`).
- Added per-user trip ownership in domain (`Trip.OwnerUserId`).
- Enforced user data isolation across trips, expenses, exchange rates, ledger, and reports.
- Added integration tests for:
  - unauthorized access without user header (`401`)
  - cross-user trip access isolation (`404`)
- Updated frontend API calls to send `X-User-Id` via `VITE_USER_ID`.

---

# Production MVP - Next Development Phases

> **Document type:** Technical Delivery Plan
> **Last updated:** 2026-02-28
> **Release:** 2026.1.0
> **Audience:** Business Analyst, Product Owner, Engineering

---

## Executive Summary

All 7 core feature modules have been delivered at MVP level. The application is fully functional end-to-end - users can create trips, log expenses in local currency, track exchange rates, view accounting ledger summaries, and export reports as CSV.

However, the current implementation has **three critical gaps** that must be resolved before the application can serve real users:

| Gap | Risk | Impact |
|-----|------|--------|
| **No persistent storage** | All data is lost when the server restarts | Users cannot rely on the system for real accounting |
| **No real authentication** | Login uses hardcoded credentials; API uses a debug header (`X-User-Id`) | No real user accounts; no security boundary |
| **No audit trail** | Accounting-sensitive edits are not tracked | Does not meet basic accounting compliance expectations |

The following 4 phases close these gaps and bring the application to **production-ready MVP** status.

---

## System Architecture Overview

### Current Architecture (Modules 1-7)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + TypeScript + Vite)           │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Landing Page  │  │  Sign-In     │  │  Dashboard   │  │  Auth      │  │
│  │ (Marketing)   │  │  Modal       │  │  Page        │  │  Context   │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  └─────┬──────┘  │
│                                              │                │         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌┴────────┐ ┌─────┴──────┐  │
│  │  Trips    │ │ Expenses  │ │  Ledger   │ │ Reports │ │ Exchange   │  │
│  │  Section  │ │ Section   │ │ Summary   │ │ Summary │ │ Rates List │  │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └────┬────┘ └─────┬──────┘  │
│        └──────────────┴──────────────┴────────────┴────────────┘        │
│                                    │                                    │
│                        fetch() + X-User-Id header ◄── WILL BE REPLACED │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │ HTTP/JSON
┌────────────────────────────────────┼────────────────────────────────────┐
│                     BACKEND (.NET 10 — Layered Architecture)            │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                        API Layer (Controllers)                     │  │
│  │  Trips · Expenses · ExchangeRates · Ledger · Reports · Health     │  │
│  │  Auth: HeaderUserIdAuthenticationHandler ◄── WILL BE REPLACED     │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                    Application Layer (Services)                    │  │
│  │  TripsService · ExpensesService · ExchangeRatesService            │  │
│  │  AccountingLedgerService · ReportsExportService                   │  │
│  │  ICurrentUserContext → user isolation per request                  │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                      Domain Layer (Entities)                      │  │
│  │  Trip (aggregate) · Expense (aggregate) · ExchangeRate            │  │
│  │  Value Objects: Money · Currency · TravelDate                     │  │
│  │  Enums: TripStatus · ExpenseCategory                              │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │                  Infrastructure Layer (Repositories)               │  │
│  │  InMemoryTripRepository       ◄── WILL BE REPLACED (EF Core)     │  │
│  │  InMemoryExpenseRepository    ◄── WILL BE REPLACED (EF Core)     │  │
│  │  InMemoryExchangeRateRepository ◄── WILL BE REPLACED (EF Core)   │  │
│  │  ExchangeRateHostProvider (external API)                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                       ⚠ NO DATABASE — In-Memory Only                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Target Architecture (After Phases 8–11)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + TypeScript + Vite)           │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Landing Page  │  │  Sign-In     │  │  Dashboard   │  │  Auth      │  │
│  │ (Marketing)   │  │  Modal ──────┼──┼─► Auth0 SDK  │  │  Context   │  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘  └─────┬──────┘  │
│                                              │                │         │
│                        Authorization: Bearer <JWT token>               │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │ HTTP/JSON + JWT
┌────────────────────────────────────┼────────────────────────────────────┐
│                         BACKEND (.NET 10)                               │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │  API Layer + Middleware Pipeline                                   │  │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────┐ ┌──────────────────┐  │  │
│  │  │ CORS     │→│ Rate      │→│ JWT Bearer │→│ Controllers      │  │  │
│  │  │ Policy   │ │ Limiting  │ │ Auth       │ │ + [Authorize]    │  │  │
│  │  └──────────┘ └───────────┘ └────────────┘ └──────────────────┘  │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │  Application Layer                                                │  │
│  │  Services + IAuditService (logs all mutations)                    │  │
│  │  ICurrentUserContext → reads JWT "sub" claim                      │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │  Domain Layer (unchanged)                                         │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────┴─────────────────────────────────┐  │
│  │  Infrastructure Layer                                             │  │
│  │  EfTripRepository · EfExpenseRepository · EfExchangeRateRepository│  │
│  │  EfAuditService · Serilog                                         │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│                          EF Core + Npgsql                              │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                 │
               ┌────┴─────┐   ┌─────┴──────┐   ┌─────┴──────┐
               │PostgreSQL │   │  Auth0 /   │   │ Exchange   │
               │   16      │   │  Firebase  │   │ Rate API   │
               │ (Docker)  │   │  (Cloud)   │   │ (External) │
               └───────────┘   └────────────┘   └────────────┘
```

---

## Current State (Modules 1–7 Complete)

| # | Module | Branch | Status | Key Deliverables |
|---|--------|--------|--------|-----------------|
| 1 | Foundation | `module/foundation` | Completed | .NET 10 backend, React/TypeScript frontend, CI pipeline, domain primitives |
| 2 | Trips | `module/trips` | Completed (MVP) | Trip CRUD (create, edit, list, archive), destination/currency selection |
| 3 | Expenses | `module/expenses` | Completed (MVP) | Expense CRUD linked to trips, category system, country reference |
| 4 | Exchange Rates | `module/exchange-rates` | Completed (MVP) | Per-day rate storage, auto-provider lookup, home-currency conversion |
| 5 | Accounting Ledger | `module/accounting-ledger` | Completed (MVP) | Aggregation by day/category/trip, conversion coverage counters |
| 6 | Reports & Export | `module/reports-export` | Completed (MVP) | Filtered summary reports, CSV export, date/category filters |
| 7 | Auth & Multiuser | `module/auth-and-multiuser` | Completed (MVP) | Header-based user isolation, per-user trip ownership |

**Recent additions (latest sprint):**
- Functional sign-in modal with provider UI (Google, phone, iCloud, passkey — UI only, not wired to backend)
- Dashboard page consolidating all module UIs (trips, expenses, ledger, reports)
- Frontend auth context with session-based state management

### API Endpoints (Current)

| Endpoint | Methods | Module |
|----------|---------|--------|
| `GET /api/health` | GET | Foundation |
| `/api/trips` | GET, POST | Trips |
| `/api/trips/{id}` | GET, PUT | Trips |
| `/api/trips/{id}/archive` | POST | Trips |
| `/api/trips/{tripId}/expenses` | GET, POST | Expenses |
| `/api/trips/{tripId}/expenses/{id}` | GET, PUT, DELETE | Expenses |
| `/api/trips/{tripId}/exchange-rates` | GET, PUT | Exchange Rates |
| `/api/trips/{tripId}/ledger/summary` | GET | Accounting Ledger |
| `/api/trips/{tripId}/reports/summary` | GET | Reports |
| `/api/trips/{tripId}/reports/export/csv` | GET | Reports |
| `/api/reference/countries` | GET | Foundation |

### Domain Model (Current)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Domain Entities                               │
│                                                                      │
│  ┌──────────────────────────────┐    ┌───────────────────────────┐  │
│  │ Trip (Aggregate Root)         │    │ Expense (Aggregate Root)  │  │
│  ├──────────────────────────────┤    ├───────────────────────────┤  │
│  │ Id            : Guid         │    │ Id             : Guid     │  │
│  │ OwnerUserId   : string       │    │ TripId         : Guid ──────► FK
│  │ Name          : string       │    │ Category       : enum     │  │
│  │ DestinationCountry : string  │    │ Amount         : Money    │  │
│  │ HomeCurrency  : Currency     │    │ OccurredAtUtc  : DateTimeOffset│
│  │ LocalCurrency : Currency     │    │ Notes          : string   │  │
│  │ StartDate     : TravelDate   │    └───────────────────────────┘  │
│  │ EndDate       : TravelDate   │                                    │
│  │ Status        : TripStatus   │    ┌───────────────────────────┐  │
│  └──────────────────────────────┘    │ ExchangeRate (DTO)        │  │
│                                      ├───────────────────────────┤  │
│  ┌────────────────────────┐          │ TripId         : Guid ──────► FK
│  │ Value Objects           │          │ Date           : DateOnly │  │
│  ├────────────────────────┤          │ FromCurrency   : string   │  │
│  │ Money(Amount, Currency) │          │ ToCurrency     : string   │  │
│  │ Currency(Code: 3-char)  │          │ Rate           : decimal  │  │
│  │ TravelDate(DateOnly)    │          └───────────────────────────┘  │
│  └────────────────────────┘                                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │ Enums                                                        │    │
│  │ TripStatus: Active(1) | Archived(2)                          │    │
│  │ ExpenseCategory: Transport(1) | Meal(2) | TouristActivity(3) │    │
│  │                  Museum(4) | Snack(5) | Lodging(6) | Other(99)│    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 8: Database Persistence

> **Branch:** `module/persistence`
> **Priority:** Critical — blocks all subsequent phases
> **Estimated scope:** Backend-heavy

### Business Objective
Replace in-memory data storage with a real PostgreSQL database so that user data survives server restarts and is durable.

### What Changes

| Area | Change |
|------|--------|
| **Database** | PostgreSQL 16 via Docker Compose for local development |
| **ORM** | Entity Framework Core with Npgsql provider |
| **Repositories** | All 3 in-memory repositories replaced with EF Core implementations |
| **Schema** | Initial database migration with tables, indexes, and foreign keys |
| **Configuration** | Connection strings added to app settings |
| **Tests** | Existing integration tests continue to pass (in-memory DB for test isolation) |

### Entity-Relationship Diagram

```
┌────────────────────────────────┐
│            trips                │
├────────────────────────────────┤
│ PK  id              uuid       │
│     owner_user_id   varchar    │──── INDEX (owner_user_id)
│     name            varchar    │
│     destination_country varchar│
│     home_currency   char(3)    │
│     local_currency  char(3)    │
│     start_date      date       │
│     end_date        date       │
│     status          smallint   │
└──────────┬─────────────────────┘
           │
           │ 1:N (cascade delete)
           │
┌──────────┴─────────────────────┐      ┌─────────────────────────────────────┐
│          expenses               │      │         exchange_rates               │
├────────────────────────────────┤      ├─────────────────────────────────────┤
│ PK  id              uuid       │      │ PK  trip_id         uuid ───────────┤ FK
│ FK  trip_id         uuid ──────│      │ PK  date            date            │
│     category        smallint   │      │ PK  from_currency   char(3)         │
│     amount          decimal    │      │ PK  to_currency     char(3)         │
│     currency_code   char(3)    │      │     rate            decimal(18,8)   │
│     occurred_at_utc timestamptz│      └─────────────────────────────────────┘
│     notes           text       │
└────────────────────────────────┘
           │
           INDEX (trip_id)
```

### Docker Compose (Local Development)

```yaml
# docker-compose.yml (repository root)
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: travel_accounting
      POSTGRES_USER: ta_user
      POSTGRES_PASSWORD: ta_dev_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Code Examples

**AppDbContext** — new file at `Infrastructure/Data/AppDbContext.cs`:

```csharp
namespace TravelAccounting.Infrastructure.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Trip> Trips => Set<Trip>();
    public DbSet<Expense> Expenses => Set<Expense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
```

**TripConfiguration** — EF entity config mapping the domain entity to PostgreSQL:

```csharp
namespace TravelAccounting.Infrastructure.Data.Configurations;

internal sealed class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.ToTable("trips");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");
        builder.Property(t => t.OwnerUserId).HasColumnName("owner_user_id").IsRequired();
        builder.Property(t => t.Name).HasColumnName("name").HasMaxLength(200).IsRequired();
        builder.Property(t => t.DestinationCountry).HasColumnName("destination_country").IsRequired();
        builder.Property(t => t.Status).HasColumnName("status");

        // Value object: Currency → flattened to string column
        builder.Property(t => t.HomeCurrency)
            .HasColumnName("home_currency")
            .HasMaxLength(3)
            .HasConversion(c => c.Code, code => new Currency(code));

        builder.Property(t => t.LocalCurrency)
            .HasColumnName("local_currency")
            .HasMaxLength(3)
            .HasConversion(c => c.Code, code => new Currency(code));

        // Value object: TravelDate → flattened to DateOnly column
        builder.Property(t => t.StartDate)
            .HasColumnName("start_date")
            .HasConversion(d => d.Value, v => new TravelDate(v));

        builder.Property(t => t.EndDate)
            .HasColumnName("end_date")
            .HasConversion(d => d.Value, v => new TravelDate(v));

        builder.HasIndex(t => t.OwnerUserId);
    }
}
```

**EfTripRepository** — replaces `InMemoryTripRepository`, implements the same interface:

```csharp
namespace TravelAccounting.Infrastructure.Data.Repositories;

// Implements the existing ITripRepository interface unchanged.
// The service layer (TripsService) requires no modifications.
internal sealed class EfTripRepository(AppDbContext db) : ITripRepository
{
    public async Task<IReadOnlyList<Trip>> ListAsync(CancellationToken cancellationToken)
    {
        return await db.Trips
            .OrderBy(t => t.StartDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<Trip?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        return await db.Trips.FindAsync([id], cancellationToken);
    }

    public async Task AddAsync(Trip trip, CancellationToken cancellationToken)
    {
        db.Trips.Add(trip);
        await db.SaveChangesAsync(cancellationToken);
    }
}
```

**DI Registration** — swap in `InfrastructureServiceCollectionExtensions.cs`:

```csharp
// BEFORE (current — in-memory):
services.AddSingleton<ITripRepository, InMemoryTripRepository>();
services.AddSingleton<IExpenseRepository, InMemoryExpenseRepository>();
services.AddSingleton<IExchangeRateRepository, InMemoryExchangeRateRepository>();

// AFTER (Phase 8 — EF Core):
services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
services.AddScoped<ITripRepository, EfTripRepository>();
services.AddScoped<IExpenseRepository, EfExpenseRepository>();
services.AddScoped<IExchangeRateRepository, EfExchangeRateRepository>();
```

### Migration Strategy

```
1. docker compose up -d                           ← start PostgreSQL
2. dotnet ef migrations add InitialCreate \
     --project src/backend/TravelAccounting.Infrastructure \
     --startup-project src/backend/TravelAccounting.Api   ← generate migration
3. dotnet ef database update \
     --startup-project src/backend/TravelAccounting.Api   ← apply to DB
4. dotnet run --project src/backend/TravelAccounting.Api  ← verify API starts
5. dotnet test                                             ← all tests pass
```

### Files Changed

| Action | File | Description |
|--------|------|-------------|
| **New** | `docker-compose.yml` | PostgreSQL 16 service |
| **New** | `Infrastructure/Data/AppDbContext.cs` | EF DbContext |
| **New** | `Infrastructure/Data/Configurations/TripConfiguration.cs` | Trip table mapping |
| **New** | `Infrastructure/Data/Configurations/ExpenseConfiguration.cs` | Expense table mapping |
| **New** | `Infrastructure/Data/Configurations/ExchangeRateConfiguration.cs` | Exchange rate table mapping |
| **New** | `Infrastructure/Data/Repositories/EfTripRepository.cs` | Persistent trip storage |
| **New** | `Infrastructure/Data/Repositories/EfExpenseRepository.cs` | Persistent expense storage |
| **New** | `Infrastructure/Data/Repositories/EfExchangeRateRepository.cs` | Persistent exchange rate storage |
| **New** | `Infrastructure/Data/Migrations/` | Initial migration files |
| **Mod** | `Infrastructure/TravelAccounting.Infrastructure.csproj` | Add Npgsql + EF Design packages |
| **Mod** | `Infrastructure/InfrastructureServiceCollectionExtensions.cs` | Swap InMemory → EF repos |
| **Mod** | `Api/appsettings.json` | Add connection string |
| **Mod** | `Api/appsettings.Development.json` | Local PostgreSQL connection |

### Acceptance Criteria
- [ ] `docker compose up -d` starts PostgreSQL and the API connects successfully
- [ ] Creating a trip, adding expenses, and restarting the API retains all data
- [ ] All existing API integration tests pass without modification
- [ ] Database migration applies cleanly on first run
- [ ] No in-memory data loss scenarios remain in production configuration

---

## Phase 9: Real Authentication

> **Branch:** `module/real-auth`
> **Priority:** Critical — required for real user accounts
> **Depends on:** Phase 8 (user identity stored in DB)
> **Estimated scope:** Full-stack (backend + frontend)

### Business Objective
Replace the development-only hardcoded login with a real identity provider (Auth0 or Firebase Auth) so users can create accounts, sign in securely, and have their data protected by industry-standard authentication.

### Authentication Flow (Sequence)

```
  Browser                    Auth0/Firebase              .NET API
    │                            │                          │
    │  1. Click "Log In"         │                          │
    │ ──────────────────────►    │                          │
    │                            │                          │
    │  2. Login form (hosted)    │                          │
    │ ◄──────────────────────    │                          │
    │                            │                          │
    │  3. Submit credentials     │                          │
    │ ──────────────────────►    │                          │
    │                            │                          │
    │  4. JWT access token       │                          │
    │ ◄──────────────────────    │                          │
    │                            │                          │
    │  5. API call + Bearer token│                          │
    │ ─────────────────────────────────────────────────►    │
    │                            │                          │
    │                            │  6. Validate JWT         │
    │                            │ ◄────────────────────    │
    │                            │                          │
    │                            │  7. Token valid          │
    │                            │ ────────────────────►    │
    │                            │                          │
    │                            │  8. Extract sub claim    │
    │                            │     → ICurrentUserContext │
    │                            │                          │
    │  9. JSON response          │                          │
    │ ◄─────────────────────────────────────────────────    │
    │                            │                          │
    │  ... (silent refresh when token expires) ...          │
```

### What Changes

| Area | Change |
|------|--------|
| **Identity Provider** | Auth0 or Firebase Auth handles signup, login, password reset, social login (Google) |
| **Backend auth** | JWT bearer token validation replaces `X-User-Id` header; user identity extracted from token `sub` claim |
| **Frontend auth** | Auth provider SDK handles login/logout flow; access tokens sent as `Authorization: Bearer` on all API calls |
| **Sign-in modal** | Provider buttons (Google, email/password) wired to real authentication flows |
| **Dashboard** | Displays real user info (email, name) from authenticated session |

### Code Examples

**Backend — JWT configuration in `Program.cs`**:

```csharp
// BEFORE (current — header-based debug auth):
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = HeaderUserIdAuthenticationHandler.SchemeName;
        options.DefaultChallengeScheme = HeaderUserIdAuthenticationHandler.SchemeName;
    })
    .AddScheme<AuthenticationSchemeOptions, HeaderUserIdAuthenticationHandler>(
        HeaderUserIdAuthenticationHandler.SchemeName, _ => { });

// AFTER (Phase 9 — JWT bearer):
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Auth:Authority"];
        options.Audience = builder.Configuration["Auth:Audience"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };
    });
```

**Backend — `ICurrentUserContext` stays unchanged** (reads from claims):

```csharp
// HttpCurrentUserContext.cs — NO changes needed.
// It already reads ClaimTypes.NameIdentifier, which is populated
// by both the old HeaderUserIdAuthenticationHandler and the new JWT bearer.
public string UserId
{
    get
    {
        var user = httpContextAccessor.HttpContext?.User;
        var userId = user?.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? user?.Identity?.Name;
        if (string.IsNullOrWhiteSpace(userId))
            throw new InvalidOperationException("Authenticated user context is not available.");
        return userId;
    }
}
```

**Frontend — AuthContext.tsx** (conceptual, Auth0 example):

```tsx
// BEFORE (hardcoded credentials):
const login = (email: string, password: string) => {
  if (email === "test@gmail.com" && password === "123456789") {
    setUser({ email });
    sessionStorage.setItem("user", JSON.stringify({ email }));
  }
};

// AFTER (Auth0 SDK):
import { useAuth0 } from "@auth0/auth0-react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();

  const getToken = useCallback(async () => {
    return await getAccessTokenSilently();
  }, [getAccessTokenSilently]);

  // All API calls use: Authorization: Bearer <token>
}
```

**Frontend — API wrapper** (token injection):

```tsx
// BEFORE:
const response = await fetch(url, {
  headers: { "Content-Type": "application/json", "X-User-Id": userId },
});

// AFTER:
const token = await getToken();
const response = await fetch(url, {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});
```

### What Gets Removed
- `HeaderUserIdAuthenticationHandler.cs` — entire file deleted
- Hardcoded credentials (`test@gmail.com` / `123456789`) in frontend
- `VITE_USER_ID` environment variable

### Files Changed

| Action | File | Description |
|--------|------|-------------|
| **Del** | `Api/Auth/HeaderUserIdAuthenticationHandler.cs` | Removed — replaced by JWT |
| **Mod** | `Api/Program.cs` | JWT bearer config replaces header auth |
| **Mod** | `Api/appsettings.json` | Add Auth section (Authority, Audience) |
| **New** | `frontend/web/src/app/authConfig.ts` | Auth0/Firebase config (domain, clientId) |
| **Mod** | `frontend/web/src/app/AuthContext.tsx` | Real provider SDK integration |
| **Mod** | `frontend/web/src/components/ui/SignInModal.tsx` | Wire buttons to real auth |
| **Mod** | `frontend/web/src/components/DashboardPage.tsx` | Real user info display |
| **Mod** | `frontend/web/package.json` | Add `@auth0/auth0-react` or `firebase` |

### Acceptance Criteria
- [ ] New users can sign up with email/password
- [ ] Existing users can sign in with email/password
- [ ] Google social login works end-to-end
- [ ] API returns 401 for requests without a valid JWT token
- [ ] User data isolation works correctly (userId from JWT `sub` claim)
- [ ] Token refresh happens transparently (no forced re-login during active sessions)
- [ ] Hardcoded credentials and debug auth headers are fully removed

---

## Phase 10: Audit Trail

> **Branch:** `module/audit-trail`
> **Priority:** High — accounting compliance requirement
> **Depends on:** Phase 8 (audit records stored in DB), Phase 9 (userId from JWT)
> **Estimated scope:** Backend-heavy, minimal frontend

### Business Objective
Track all accounting-sensitive operations (expense creation/editing/deletion, exchange rate changes, trip modifications) with a full audit log showing who made what change and when.

### Audit Data Flow

```
 User action (e.g., update expense)
          │
          ▼
 ┌─────────────────────────┐
 │   ExpensesService        │
 │                           │
 │   1. Load current state   │ ─── before snapshot
 │   2. Apply domain update  │
 │   3. Save to DB           │
 │   4. auditService.Log(    │ ─── after snapshot
 │        userId,            │
 │        action: "Update",  │
 │        entityType,        │
 │        entityId,          │
 │        changes: diff)     │
 └────────────┬──────────────┘
              │
              ▼
 ┌─────────────────────────┐     ┌──────────────────────────────────┐
 │   EfAuditService         │     │  audit_entries table              │
 │                           │────►│  ┌────────────────────────────┐  │
 │   Writes AuditEntry to   │     │  │ id: a1b2c3d4               │  │
 │   AppDbContext            │     │  │ user_id: "auth0|123"       │  │
 │                           │     │  │ action: "Update"           │  │
 └───────────────────────────┘     │  │ entity_type: "Expense"     │  │
                                   │  │ entity_id: "e5f6g7h8"     │  │
                                   │  │ timestamp: 2026-02-28T...  │  │
                                   │  │ changes: {                 │  │
                                   │  │   "amount": {              │  │
                                   │  │     "before": 150.00,      │  │
                                   │  │     "after": 175.50        │  │
                                   │  │   },                       │  │
                                   │  │   "notes": {               │  │
                                   │  │     "before": "Lunch",     │  │
                                   │  │     "after": "Team lunch"  │  │
                                   │  │   }                        │  │
                                   │  │ }                          │  │
                                   │  └────────────────────────────┘  │
                                   └──────────────────────────────────┘
```

### What Gets Tracked

| Entity | Tracked Actions | Audit Data Captured |
|--------|----------------|---------------------|
| **Expense** | Create, Update, Delete | User, timestamp, action type, field-level before/after diff |
| **Trip** | Create, Update, Archive | User, timestamp, action type, field-level before/after diff |
| **Exchange Rate** | Create, Update | User, timestamp, action type, previous rate vs new rate |

### Code Examples

**AuditEntry domain entity** — new file at `Domain/Audit/AuditEntry.cs`:

```csharp
namespace TravelAccounting.Domain.Audit;

public sealed class AuditEntry
{
    public Guid Id { get; }
    public string UserId { get; }
    public AuditAction Action { get; }
    public string EntityType { get; }
    public Guid EntityId { get; }
    public DateTimeOffset Timestamp { get; }
    public string Changes { get; }  // JSON: { "field": { "before": ..., "after": ... } }

    public AuditEntry(
        Guid id, string userId, AuditAction action,
        string entityType, Guid entityId,
        DateTimeOffset timestamp, string changes)
    {
        Id = id;
        UserId = userId;
        Action = action;
        EntityType = entityType;
        EntityId = entityId;
        Timestamp = timestamp;
        Changes = changes;
    }
}

public enum AuditAction { Create = 1, Update = 2, Delete = 3 }
```

**IAuditService** — application interface:

```csharp
namespace TravelAccounting.Application.Audit;

public interface IAuditService
{
    Task LogAsync(
        AuditAction action,
        string entityType,
        Guid entityId,
        object? before,
        object? after,
        CancellationToken cancellationToken);
}
```

**Integration into existing services** — minimal change to `ExpensesService`:

```csharp
// ExpensesService — only the mutation methods get audit calls.
// Constructor adds IAuditService via primary constructor injection.
internal sealed class ExpensesService(
    IExpenseRepository expenseRepository,
    ITripRepository tripRepository,
    IExchangeRateRepository exchangeRateRepository,
    IExchangeRateProvider exchangeRateProvider,
    ICurrentUserContext currentUserContext,
    IAuditService auditService) : IExpensesService        // ◄── added
{
    public async Task<ExpenseDto?> UpdateAsync(
        Guid id, UpdateExpenseRequest request, CancellationToken cancellationToken)
    {
        var expense = await expenseRepository.GetAsync(id, cancellationToken);
        if (expense is null) return null;

        var before = SnapshotExpense(expense);             // ◄── capture before
        expense.Update(category, amount, occurredAtUtc, notes);
        var after = SnapshotExpense(expense);              // ◄── capture after

        await auditService.LogAsync(                       // ◄── log diff
            AuditAction.Update, "Expense", id, before, after, cancellationToken);

        return await MapToDto(expense, trip, cancellationToken);
    }
}
```

### API Endpoint

| Endpoint | Method | Query Params | Description |
|----------|--------|-------------|-------------|
| `/api/audit` | GET | `entityType`, `entityId`, `userId`, `fromDate`, `toDate` | Query audit history |

**Example response:**
```json
[
  {
    "id": "a1b2c3d4-...",
    "userId": "auth0|abc123",
    "action": "Update",
    "entityType": "Expense",
    "entityId": "e5f6g7h8-...",
    "timestamp": "2026-02-28T14:30:00Z",
    "changes": {
      "amount": { "before": 150.00, "after": 175.50 },
      "notes": { "before": "Lunch", "after": "Team lunch" }
    }
  }
]
```

### Files Changed

| Action | File | Description |
|--------|------|-------------|
| **New** | `Domain/Audit/AuditEntry.cs` | Audit entity + AuditAction enum |
| **New** | `Application/Audit/IAuditService.cs` | Service interface |
| **New** | `Infrastructure/Audit/EfAuditService.cs` | EF implementation |
| **New** | `Infrastructure/Data/Configurations/AuditEntryConfiguration.cs` | Table mapping |
| **New** | `Api/Controllers/AuditController.cs` | GET endpoint |
| **New** | Migration for `audit_entries` table | Schema update |
| **Mod** | `Infrastructure/Data/AppDbContext.cs` | Add `DbSet<AuditEntry>` |
| **Mod** | `Application/Expenses/ExpensesService.cs` | Add audit logging |
| **Mod** | `Application/Trips/TripsService.cs` | Add audit logging |
| **Mod** | `Application/ExchangeRates/ExchangeRatesService.cs` | Add audit logging |

### Acceptance Criteria
- [ ] Creating an expense generates an audit entry with action=Create and full field snapshot
- [ ] Editing an expense generates an audit entry with before/after diff for each changed field
- [ ] Deleting an expense generates an audit entry with action=Delete
- [ ] Audit entries are immutable — no update or delete operations allowed
- [ ] Audit entries include the authenticated userId from the JWT token
- [ ] `GET /api/audit?entityType=Expense&entityId={id}` returns the full change history

---

## Phase 11: Production Hardening

> **Branch:** `module/hardening`
> **Priority:** Medium — required before any production deployment
> **Depends on:** Phases 8–10
> **Estimated scope:** Backend configuration, no new features

### Business Objective
Apply security, observability, and reliability improvements so the application is safe to expose to real users.

### Middleware Pipeline (Target)

```
Incoming Request
       │
       ▼
┌──────────────┐
│  CORS Policy  │ ── reject unauthorized origins
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Rate Limiter │ ── 429 if over per-user threshold
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Serilog      │ ── structured request logging + correlation ID
│  Middleware    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  JWT Bearer   │ ── validate token, extract claims
│  Auth         │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Authorization│ ── enforce [Authorize] on controllers
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller   │ ── handle request, return response
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Exception    │ ── catch unhandled errors → { error, message, correlationId }
│  Middleware   │
└──────────────┘
```

### What Changes

| Area | Change | Why |
|------|--------|-----|
| **CORS** | Restrict allowed origins to frontend domain only | Prevent unauthorized cross-origin API access |
| **Structured logging** | Add Serilog with structured JSON output | Enable log aggregation, searching, and alerting |
| **Health checks** | Enhance `/api/health` to verify PostgreSQL connectivity | Enable monitoring to detect infrastructure issues |
| **Input sanitization** | Validate text fields for HTML/script injection | Prevent XSS and injection attacks |
| **Rate limiting** | Per-user request throttling | Prevent abuse and protect API availability |
| **Error responses** | Consistent JSON format with correlation IDs | Enable support to trace user-reported issues |

### Code Examples

**CORS + Rate Limiting + Serilog in `Program.cs`**:

```csharp
// CORS — restrict origins
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Rate limiting — per-user
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("per-user", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User?.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

// Serilog
builder.Host.UseSerilog((context, config) =>
    config.ReadFrom.Configuration(context.Configuration));
```

**Standardized error response**:

```json
{
  "error": "ValidationError",
  "message": "Trip end date cannot be before start date.",
  "correlationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

### Files Changed

| Action | File | Description |
|--------|------|-------------|
| **Mod** | `Api/Program.cs` | CORS, rate limiting, Serilog, health checks |
| **Mod** | `Api/TravelAccounting.Api.csproj` | Add Serilog + rate limiting packages |
| **Mod** | `Api/appsettings.json` | CORS origins, Serilog config |
| **New** | `Api/Middleware/ExceptionHandlerMiddleware.cs` | Consistent error responses |

### Acceptance Criteria
- [ ] API rejects requests from origins not in the allowed list
- [ ] Application logs are structured JSON with request correlation IDs
- [ ] `/api/health` reports database connection status
- [ ] Rapid-fire API requests from a single user are throttled (429 response)
- [ ] Text inputs with `<script>` or HTML tags are rejected or sanitized
- [ ] All error responses follow a consistent `{ error, message, correlationId }` shape

---

## Execution Timeline

```
  Phase 8              Phase 9              Phase 10             Phase 11
  Persistence          Auth                 Audit Trail          Hardening
  ┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
  │ EF Core │          │ JWT +   │          │ Audit   │          │ CORS    │
  │ Postgres│──────────│ Auth0 / │──────────│ Service │──────────│ Serilog │
  │ Docker  │          │ Firebase│          │ Logging │          │ Limits  │
  └─────────┘          └─────────┘          └─────────┘          └─────────┘
  module/              module/              module/              module/
  persistence          real-auth            audit-trail          hardening
       │                    │                    │                    │
       └────────────────────┴────────────────────┴────────────────────┘
                          All branches from release/2026.1.0
```

Phases are **sequential** — each depends on the previous:
- Phase 9 requires Phase 8 (user data must persist to pair with auth identity)
- Phase 10 requires Phases 8 + 9 (audit writes to DB, captures userId from JWT)
- Phase 11 can partially overlap with Phase 10

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | PostgreSQL 16 | Open-source, widely supported, excellent for structured accounting data |
| ORM | Entity Framework Core + Npgsql | Native .NET integration, migration tooling, type-safe queries |
| Auth Provider | Auth0 or Firebase Auth | External service handles signup/login complexity; JWT tokens for API auth |
| Local Dev DB | Docker Compose | Consistent environment, no local PostgreSQL installation required |
| Logging | Serilog | Structured logging standard for .NET; pluggable sinks for any environment |
| Deployment | Deferred | Focus on feature completion first; deployment infrastructure planned for later |

---

## Definition of Done (Per Phase)

- [ ] All acceptance criteria met
- [ ] Existing integration tests pass (no regressions)
- [ ] New tests added for new functionality
- [ ] Build and quality checks clean:

```bash
dotnet build
dotnet test
npm run typecheck
npm run lint
```
- [ ] `CHANGELOG.md` updated
- [ ] Code reviewed and merged to `release/2026.1.0`

---

## Future Enhancements (Post-Production MVP)

These items are out of scope for the current Production MVP but are captured for future planning:

| Enhancement | Description | Estimated Complexity |
|-------------|-------------|---------------------|
| User settings & profile | Profile page, preferences, password change, default currency | Medium |
| Mobile optimization | Responsive dashboard, touch-friendly expense entry | Medium |
| Advanced reporting | Charts and visualizations, trend analysis, budget tracking | High |
| Notifications | Email/SMS alerts for trip reminders, budget thresholds | Medium |
| Trip sharing | Share trips with team members for collaborative expense tracking | High |
| Batch operations | Bulk import/export of expenses, bulk edits | Medium |
| Real-time sync | WebSocket or SSE for live updates across devices | High |
