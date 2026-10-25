---
paths:
  - "src/backend/**"
---

# Backend Rules (.NET 10)

## Layering
- Dependency direction: `Api → Application → Domain ← Infrastructure`. `Api → Infrastructure` only for DI wiring in `Program.cs`.
- Domain references nothing else (no EF, no ASP.NET, no HTTP).
- Application defines interfaces (`I*Repository`, `I*Provider`, `I*Service`); Infrastructure implements them.
- Controllers depend on Application service interfaces only — never on repositories, `AppDbContext`, or Infrastructure types.
- New feature code goes in the feature folder of each layer (`Trips/`, `Expenses/`, …). Do not create cross-feature "Helpers"/"Utils" dumping grounds.

## Domain
- Entities: `sealed` classes, `private set` properties, invariants validated in the constructor and mutation methods (`Update`, `Archive`) before assignment; throw `ArgumentException` with `nameof(param)`.
- Value objects: `sealed record` (or `readonly record struct`) that validates on construction — `Currency` (ISO 4217, normalized uppercase), `Money`, `TravelDate`.
- Money is always `decimal` wrapped in `Money`; never `double`/`float` for amounts or rates.
- Rounding: today `decimal.Round(x, 2, MidpointRounding.AwayFromZero)` (see `Money`). Do not add new copies of this rule in services — reuse a single shared domain helper. Per-currency decimals are an open question (PRD Q-7).

## Application
- Services: `internal sealed class XService(...) : IXService` with primary constructors, registered in `AddApplication()`.
- All I/O is async and takes a `CancellationToken`; repositories return `Task<T?>` / `Task<IReadOnlyList<T>>`.
- Ownership: every trip-scoped operation loads the trip and checks `trip.OwnerUserId == currentUserContext.UserId`. A trip owned by another user is treated as not found (no information leak).
- Audit: every accounting-sensitive mutation (create/update/delete of trips, expenses, exchange rates) calls `IAuditService.LogAsync(...)` with before/after state.
- DTOs returned to the API are `sealed record`s; map explicitly — no AutoMapper-style reflection.
- Exchange-rate provider failures are non-fatal: the expense is saved and conversion fields stay `null`. Do not convert them into 500s or silent zero rates.

## API
- Controllers: `[ApiController]`, `[Authorize]`, primary constructor, `sealed`, return `ActionResult<T>`.
- **API request models are classes with `init` properties and data annotations** (`[Required]`, etc.), e.g. `Api/Trips/UpsertTripRequest.cs`. Do not use positional `record` request models (they caused validation 500s). If a record is unavoidable, put annotations on constructor parameters.
- Error responses: `NotFound()` for missing/not-owned resources; `BadRequest(new { error = "..." })` for business validation failures (current convention). Keep the shape consistent across endpoints.
- Routes are lowercase, plural, trip-scoped where applicable: `api/trips/{tripId:guid}/<feature>`.
- Any route change must update the frontend caller and its test in the same change.

## Infrastructure
- Persistence via EF Core (`AppDbContext`, PostgreSQL/Npgsql). Repositories are scoped and expose focused methods — no generic repository.
- Schema changes require an EF migration (use the `ef-migration` skill). Never edit an applied migration.
- External HTTP clients are typed `HttpClient`s registered in `AddInfrastructure()` with options bound from configuration.
- Configuration: typed options + `ValidateOnStart()`. No real secrets in `appsettings*.json` — use `dotnet user-secrets` or environment variables; committed values must be dev-only placeholders.

## Error handling
- No broad `try/catch`, no `catch (Exception)` outside a top-level handler, no empty catch blocks.
- Catch only specific, expected exceptions where there is a meaningful recovery, and log them.

## Tests
- Domain invariants and money math → `tests/TravelAccounting.Domain.Tests`.
- Endpoint behavior, validation, ownership, and audit → `tests/TravelAccounting.Api.Tests` using `CustomWebApplicationFactory` (EF in-memory) and `JwtTestTokenFactory` for bearer tokens.
- Every bug fix gets a regression test; every new endpoint gets happy-path, validation, and cross-user isolation tests.
