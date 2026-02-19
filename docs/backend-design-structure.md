# Backend Design Structure

## Purpose
Define the backend architecture for the travel-accounting application using .NET 10, with modular boundaries and behavior-safe defaults.

## Architecture Style
- Modular monolith first.
- Clean separation of concerns across API, Application, Domain, and Infrastructure layers.
- Feature modules own their use cases and data contracts.

## Solution Layout
```text
src/
  backend/
    TravelAccounting.Api/
    TravelAccounting.Application/
    TravelAccounting.Domain/
    TravelAccounting.Infrastructure/
    Modules/
      Foundation/
      Trips/
      Expenses/
      ExchangeRates/
      AccountingLedger/
      ReportsExport/
      AuthMultiUser/   (optional)
```

## Layer Responsibilities
1. `TravelAccounting.Api`
- HTTP endpoints, request/response DTO mapping, auth wiring, and validation entry points.
- No business rules.

2. `TravelAccounting.Application`
- Use cases, commands/queries, orchestrations, and transaction boundaries.
- Calls domain objects and repository abstractions.

3. `TravelAccounting.Domain`
- Core business model: entities, value objects, domain services, and invariants.
- No framework or persistence dependencies.

4. `TravelAccounting.Infrastructure`
- Data access, external providers (exchange rates), and implementation of repositories.
- Handles EF Core/db concerns and external API clients.

## Dependency Rules
- `Api -> Application`
- `Api -> Infrastructure` only for composition root wiring (DI registration).
- `Application -> Domain`
- `Infrastructure -> Application` (implements interfaces) and `Infrastructure -> Domain`
- `Domain` references nothing from other layers.
- Module-to-module calls go through Application contracts, never direct Infrastructure coupling.

## Dependency Injection
- Composition root is the API startup (`Program.cs`).
- Register application services through `AddApplication()`.
- Register infrastructure services through `AddInfrastructure(IConfiguration)`.
- Controllers depend on application contracts, not infrastructure implementations.

## Module Internal Structure
Each module follows the same pattern:
```text
Modules/<ModuleName>/
  Api/
  Application/
  Domain/
  Infrastructure/
  Tests/
```

## Request Flow
1. API receives request and validates basic shape.
2. Application handler executes use case.
3. Domain enforces invariants and business rules.
4. Infrastructure persists/retrieves data.
5. Application returns explicit result.
6. API maps to HTTP response with consistent error format.

## Error Handling Strategy
- No broad `try/catch` wrappers that mask failures.
- Validation errors return explicit 4xx responses with field-level details.
- Domain rule violations return clear business errors.
- Unexpected failures bubble to centralized exception middleware and return a standardized 5xx response.
- No silent early returns on invalid input.

## Data and Accounting Rules
- Money is a value object (`Amount`, `Currency`).
- Store original local currency amount for each expense.
- Store conversion rate used for USD reporting to preserve auditability.
- Use deterministic rounding rules shared in Domain.

## Persistence Baseline
- Database: relational (provider to be chosen during foundation scaffolding).
- Migrations managed in Infrastructure.
- Repositories expose focused methods aligned to use cases (no generic repository abstraction).
- During early module rollout (Trips), in-memory repositories are allowed for fast vertical slicing before DB integration.

## Testing Strategy
- Domain tests: invariants, money math, rounding, and category rules.
- Application tests: use case behavior and error paths.
- API integration tests: request/response contracts and error mapping.
- Infrastructure tests: repository behavior and migration sanity checks.

## Cross-Cutting Concerns
- Structured logging with correlation id per request.
- Input validation at API boundary plus invariant validation in Domain.
- Configuration by environment with strongly typed options.
- Configuration validation at startup (`ValidateOnStart`) for required and format-constrained settings.
- Authentication/authorization introduced in `AuthMultiUser` module when enabled.

## Delivery Rule
A module is complete only when API, Application, Domain, Infrastructure, tests, and docs are updated together.
