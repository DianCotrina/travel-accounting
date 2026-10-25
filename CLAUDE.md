# CLAUDE.md — Project Context & Development Rules

## Project Purpose
Travel accounting web application. Users register daily expenses (Uber rides, meals, tourist activities, museum entries, snacks) in the local currency of the country they visit.
Example: an American user traveling in Argentina records expenses in ARS while tracking value relative to USD.

## Tech Stack
- **Backend:** .NET 10, ASP.NET Core, C# 14
- **Frontend:** React 19 + TypeScript + Vite 7, Tailwind CSS v4 + shadcn
- **Architecture:** Modular layered design (Domain → Application → Infrastructure → API)
- **Testing:** xUnit (backend), Vitest (frontend)

## Project Structure

```
src/
├── backend/
│   ├── TravelAccounting.Api/           # Controllers, auth, request models, Program.cs
│   ├── TravelAccounting.Application/   # Services, DTOs, interfaces, DI (AddApplication)
│   ├── TravelAccounting.Domain/        # Entities, value objects, enums
│   ├── TravelAccounting.Infrastructure/# Repositories, HTTP clients, DI (AddInfrastructure)
│   └── tests/                          # xUnit integration + unit tests
└── frontend/
    └── web/                            # Vite + React SPA
        ├── src/app/                    # AuthContext, types, shared catalog
        └── src/components/             # Pages, sections, UI primitives
```

## Branching Strategy
- Base release branch: `release/2026.1.0`
- New work starts in module branches from the release branch.
- Branch naming: `<module-name>` or `module/<module-name>`.
- First step for any new module: create and switch to its branch from `release/2026.1.0`.

---

## Backend Architecture & Patterns

### Layer Dependency Rule
```
API → Application → Domain ← Infrastructure
```
Domain has zero dependencies. Infrastructure implements Application interfaces. API wires everything via DI.

### Domain Entities — private setters + constructor validation
```csharp
// Trip.cs — aggregate root
public sealed class Trip
{
    public Guid Id { get; private set; }
    public string OwnerUserId { get; private set; }
    public string Name { get; private set; }
    public Currency HomeCurrency { get; private set; }
    public TripStatus Status { get; private set; }
    // ...

    public Trip(Guid id, string ownerUserId, string name, /* ... */)
    {
        if (id == Guid.Empty) throw new ArgumentException("Trip id cannot be empty.", nameof(id));
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Trip name cannot be empty.", nameof(name));
        // ... assign after validation
        Status = TripStatus.Active;
    }

    public void Update(string name, /* ... */) { /* validate, then mutate */ }
    public void Archive() { /* guard against double-archive, then set Status */ }
}
```

### Value Objects — sealed records with validation
```csharp
public sealed record Money(decimal Amount, Currency Currency);
public sealed record Currency  // 3-char ISO code, normalized uppercase
{
    public string Code { get; }
    public Currency(string code) { /* validate length=3, uppercase */ Code = normalizedCode; }
}
public readonly record struct TravelDate(DateOnly Value);
```

### Repository Interfaces — async, return `IReadOnlyList<T>` and `Task<T?>`
```csharp
public interface ITripRepository
{
    Task<IReadOnlyList<Trip>> ListAsync(CancellationToken cancellationToken);
    Task<Trip?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Trip trip, CancellationToken cancellationToken);
}
// Same pattern for IExpenseRepository, IExchangeRateRepository
```

### Services — primary constructors, injected dependencies
```csharp
internal sealed class TripsService(
    ITripRepository tripRepository,
    ICurrentUserContext currentUserContext) : ITripsService
{
    public async Task<TripDto> CreateAsync(CreateTripRequest request, CancellationToken ct)
    {
        var trip = new Trip(Guid.NewGuid(), currentUserContext.UserId, request.Name, /* ... */);
        await tripRepository.AddAsync(trip, ct);
        return MapToDto(trip);
    }
}
```

### DTOs — sealed records
```csharp
public sealed record TripDto(
    Guid Id, string Name, string DestinationCountry,
    string HomeCurrency, string LocalCurrency,
    DateOnly StartDate, DateOnly EndDate, string Status);

public sealed record CreateTripRequest(
    string Name, string DestinationCountry,
    string HomeCurrency, string LocalCurrency,
    DateOnly StartDate, DateOnly EndDate);
```

### Controllers — `[ApiController]`, `[Authorize]`, primary constructors
```csharp
[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class TripsController(ITripsService tripsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TripDto>>> List(CancellationToken ct)
    {
        var trips = await tripsService.ListAsync(ct);
        return Ok(trips);
    }
}
```

### DI Registration — extension methods
```csharp
// Infrastructure/InfrastructureServiceCollectionExtensions.cs
public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
{
    services.AddSingleton<ITripRepository, InMemoryTripRepository>();      // ← will become EF Core
    services.AddSingleton<IExpenseRepository, InMemoryExpenseRepository>();
    services.AddSingleton<IExchangeRateRepository, InMemoryExchangeRateRepository>();
    return services;
}
```

### Authentication — header-based (to be replaced with JWT)
```csharp
// Current: X-User-Id header → ClaimsPrincipal
public sealed class HeaderUserIdAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger, UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string SchemeName = "HeaderUserId";
    public const string HeaderName = "X-User-Id";
    // Reads header → creates ClaimsIdentity with NameIdentifier claim
}

// ICurrentUserContext reads ClaimTypes.NameIdentifier from HttpContext.User
public interface ICurrentUserContext { string UserId { get; } }
```

### Current Repositories — in-memory (ConcurrentDictionary)
All three repos (`InMemoryTripRepository`, `InMemoryExpenseRepository`, `InMemoryExchangeRateRepository`) use `ConcurrentDictionary` and are registered as singletons. Data is lost on server restart.

---

## Frontend Architecture & Patterns

### Routing — conditional on auth state
```tsx
// App.tsx
function AppRoutes() {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <LandingPage />;
}
```

### Auth Context — hardcoded credentials (to be replaced with Auth0/Firebase)
```tsx
// AuthContext.tsx — current state
const login = useCallback((email: string, password: string): boolean => {
  if (email === "test@gmail.com" && password === "123456789") {
    const u: User = { email };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return true;
  }
  setError("Invalid email or password.");
  return false;
}, []);
```

### API Helper — generic typed fetch wrapper
```tsx
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// Usage:
const trips = await api<Trip[]>("/api/trips");
const created = await api<Trip>("/api/trips", { method: "POST", body: JSON.stringify(form) });
```

### Component Organization
- `src/components/LandingPage.tsx` — marketing page with sign-in modal
- `src/components/DashboardPage.tsx` — authenticated app (trips, expenses, ledger, reports)
- `src/components/ui/` — shadcn primitives (Button, Dialog, Input, etc.)
- `src/app/AuthContext.tsx` — auth state management

---

## Current State (Modules 1–7 Complete)

| # | Module | Status | Key Pattern |
|---|--------|--------|-------------|
| 1 | Foundation | Done | .NET 10 scaffold, React shell, CI, domain primitives |
| 2 | Trips | Done | Trip CRUD, aggregate root pattern |
| 3 | Expenses | Done | Expense CRUD linked to trips, Money value object |
| 4 | Exchange Rates | Done | Per-day rate storage, external provider |
| 5 | Accounting Ledger | Done | Aggregation by day/category/trip |
| 6 | Reports & Export | Done | Filtered summary, CSV export |
| 7 | Auth & Multiuser | Done | Header-based user isolation |

### Critical Gaps (Next Phases)
1. **No persistent storage** — in-memory repos, data lost on restart → Phase 8: PostgreSQL + EF Core
2. **No real authentication** — hardcoded credentials, X-User-Id header → Phase 9: Auth0/Firebase + JWT
3. **No audit trail** — accounting edits untracked → Phase 10: Audit service
4. **No production hardening** — no CORS, no rate limiting, no structured logging → Phase 11: Hardening

See `DEVELOPMENT_PLAN.md` for detailed phase specifications with diagrams and code examples.

---

## Engineering Rules
- Optimize for correctness, clarity, and reliability over speed.
- Follow existing codebase conventions (patterns, helpers, naming, formatting).
- Do not add broad try/catch blocks or success-shaped fallbacks.
- Do not swallow errors; surface or propagate them explicitly.
- Do not silently fail invalid input; follow repository logging/notification patterns.
- Maintain type safety and pass build/type-check.
- Search for prior art before adding helpers; reuse or extract shared code.
- End each task with concrete edits, or a specific blocker plus a targeted question.

## Delivery Workflow
- After making code changes, run the relevant checks:
  ```bash
  # Backend
  dotnet build
  dotnet test

  # Frontend
  npm --prefix src/frontend/web run typecheck
  npm --prefix src/frontend/web run lint
  npm --prefix src/frontend/web run test
  ```
- If checks pass, commit and push automatically.
- If checks fail, report failures clearly and do not push until resolved.

## Documentation
- Keep `README.md` and code-level docs aligned with behavior.
- Record notable user-facing or architectural changes in `CHANGELOG.md`.

---

## Frontend Design & UI Rules

### Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

### After Every Change
- After completing and verifying each code change, **commit and push** automatically.
- Use a concise, descriptive commit message summarizing the change.
- Push to the current branch.

### Reference Images
- If provided: match layout, spacing, typography, and color exactly.
- If not: design from scratch with high craft (see guardrails below).
- Screenshot → compare → fix → re-screenshot. At least 2 rounds.

### Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start: `npm --prefix src/frontend/web run dev` (serves at `http://localhost:5173`)

### Screenshot Workflow
- Puppeteer: `src/frontend/web/node_modules/puppeteer-core`
- Script: `src/frontend/web/scripts/screenshot.mjs`
- Env var: `BRAVE_EXECUTABLE_PATH=<path to brave.exe>`
- Run: `npm --prefix src/frontend/web run screenshot -- http://localhost:5173`
- Output: `src/frontend/web/temporary-screenshots/screenshot-N.png`
- After screenshotting, read the PNG with the Read tool.

### Output Defaults (This Repo)
- Default to React components within `src/frontend/web`, not single-file HTML.
- Reuse existing app structure and patterns before introducing new UI architecture.
- Mobile-first responsive by default.

### Brand Assets
- Check `assets/` (especially `assets/logos/` and `assets/design-inspirations/`).
- Use provided logos, palettes, and style guides exactly when available.

### Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette. Use project-appropriate palettes (orange/black theme).
- **Shadows:** Layered, color-tinted shadows with low opacity.
- **Typography:** Pair display/serif with clean sans. Tight tracking on large headings.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states.

### Hard Rules
- Do not add sections, features, or content not in the reference.
- Do not "improve" a reference design — match it.
- Do not stop after one screenshot pass.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo as primary color.
