# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog, with versions listed in reverse chronological order.

## [Unreleased]

### Added

- Added `AGENTS.md` to define Codex collaboration and engineering conventions.
- Added `CHANGELOG.md` to track notable project changes.
- Added `DEVELOPMENT_PLAN.md` with phased modular roadmap and immediate foundation execution steps.
- Added `docs/backend-design-structure.md` to define backend modular architecture, layer boundaries, dependency rules, and error-handling strategy.
- Added backend foundation scaffold under `src/backend` with API/Application/Domain/Infrastructure projects and solution wiring.
- Added domain primitives: `Currency`, `Money`, and `ExpenseCategory`.
- Added baseline health endpoint: `GET /api/health`.
- Added DI registration extensions for Application and Infrastructure layers.
- Added `IHealthStatusService` application service and wired health endpoint through DI.
- Added `TravelDate` domain value object.
- Added backend test project `TravelAccounting.Domain.Tests` with coverage for currency, money, and travel date primitives.
- Added React + TypeScript frontend shell at `src/frontend/web` with health-check integration.
- Added frontend quality gates: ESLint, TypeScript type-check, and Vitest.
- Added `.github/workflows/ci.yml` to run backend and frontend checks in CI.
- Added root `.gitignore` for `.NET` and Node build artifacts.
- Added typed API configuration section (`App`) with startup validation.
- Added trips backend domain model (`Trip`, `TripStatus`) with lifecycle rules.
- Added trips application layer contracts/services and trip DTO/request models.
- Added trips API endpoints for list/get/create/update/archive.
- Added in-memory trips repository in infrastructure for phase-2 MVP persistence.
- Added trips frontend UI for create/edit/archive and list rendering.
- Added domain tests for trip lifecycle validations.
- Added API integration tests for trips create endpoint (`TravelAccounting.Api.Tests`) to guard against model-binding/validation regressions returning `500`.
- Added expenses backend domain model and application services for expense CRUD linked to trips.
- Added expenses API endpoints for list/get/create/update/delete under trip scope.
- Added reference endpoint `GET /api/reference/countries` for destination/currency metadata.
- Added in-memory expenses repository for phase-3 MVP persistence.
- Added expenses frontend UI with create/edit/delete flows and trip-scoped listing.
- Added UI support for destination country selection and explicit origin/destination currency labeling.
- Added API integration tests for expense create flow and countries reference endpoint.
- Added exchange-rate application contracts/services/repository interfaces.
- Added in-memory exchange-rate repository and API endpoints for per-day trip rates.
- Added expense conversion output fields (`homeAmount`, `homeCurrency`, `exchangeRateUsed`) computed from exchange rates.
- Added frontend exchange-rate UI (save/list rates) and home-currency equivalents in expense list.
- Added API integration tests for exchange-rate conversion behavior.
- Added external exchange-rate provider integration (`ExchangeRateHostProvider`) with automatic fetch-and-cache on conversion.
- Added `docs/workflow-diagram.md` with end-to-end and conversion-flow diagrams.
- Added accounting-ledger application module with trip summary DTOs/service and aggregation logic.
- Added accounting-ledger API endpoint `GET /api/trips/{tripId}/ledger/summary`.
- Added frontend ledger summary UI for trip/category/day totals and conversion coverage.
- Added API integration tests for ledger aggregation (`AccountingLedgerApiTests`).
- Added reports-export application module with filtered summary and CSV export services.
- Added reports API endpoints:
  - `GET /api/trips/{tripId}/reports/summary`
  - `GET /api/trips/{tripId}/reports/export/csv`
- Added frontend reports section with date/category filters and CSV download.
- Added API integration tests for reports summary filtering and CSV export (`ReportsApiTests`).
- Added auth-and-multiuser MVP with header-based authentication (`X-User-Id`) and per-user ownership isolation.
- Added authenticated user context abstraction (`ICurrentUserContext`) and HTTP implementation.
- Added API integration tests for unauthorized access and cross-user data isolation (`AuthApiTests`).
- Added modular frontend component architecture by splitting `App.tsx` into shared app types and section components (`HealthCard`, `TripsSection`, `ExpensesSection`).
- Added a component-based landing page for Sacatucuenta with logo-driven hero section and direct CTA into the accounting workspace.

### Changed

- Replaced `AGENTS.md` template with project-specific context, modular branch strategy, and strict engineering execution rules.
- Updated `README.md` with backend structure, run/build commands, and framework note.
- Upgraded backend target frameworks from `net7.0` to `net10.0` after installing `.NET SDK 10.0.103`.
- Updated backend architecture docs and README to document DI composition-root and dependency rules.
- Renamed DI extension classes/files to explicit names: `ApplicationServiceCollectionExtensions` and `InfrastructureServiceCollectionExtensions`.
- Updated `README.md` with frontend workflow, test commands, and environment configuration details.
- Updated `DEVELOPMENT_PLAN.md` to mark Foundation as completed and define `module/trips` as next module.
- Added troubleshooting documentation for frontend JSON parse error caused by missing API proxy (`Unexpected token '<'`).
- Updated `DEVELOPMENT_PLAN.md` to mark Trips MVP as completed and set `module/expenses` as next module.
- Updated `README.md` with phase-2 trips module usage and endpoint documentation.
- Added troubleshooting note for ASP.NET model-binding validation failure on positional record request DTOs.
- Refined troubleshooting guidance with a concrete standard: class-based request DTOs by default, and constructor-parameter annotations when records are used.
- Updated `README.md` with phase-3 expenses module endpoints and UI capabilities.
- Updated `DEVELOPMENT_PLAN.md` to mark Expenses MVP completed and set `module/exchange-rates` as next.
- Updated frontend startup behavior to surface a clear API connectivity error when backend is offline.
- Updated frontend env default API port in `.env.example` to `5214` and documented `ECONNREFUSED` proxy troubleshooting.
- Updated `README.md` with phase-4 exchange-rate module endpoints and conversion behavior.
- Updated `DEVELOPMENT_PLAN.md` to mark Exchange Rates MVP completed and set `module/accounting-ledger` as next.
- Updated phase-4 UX from manual rate input to automatic provider-based assignment.
- Hardened exchange-rate provider/conversion flow to prevent 500s on external rate lookup failures (non-success HTTP or request errors).
- Switched exchange-rate provider implementation to exchangerate.host and added access-key based configuration support.
- Updated `DEVELOPMENT_PLAN.md` to mark Accounting Ledger MVP completed and set `module/reports-export` as next.
- Updated `README.md` with phase-5 accounting ledger endpoint and UI behavior.
- Updated `DEVELOPMENT_PLAN.md` to mark Reports Export MVP completed and set `module/auth-and-multiuser` as next.
- Updated `README.md` with phase-6 reports/export endpoints and UI workflow.
- Updated services/controllers to enforce trip ownership checks across trips, expenses, exchange rates, ledger, and reports.
- Updated frontend API calls to include `X-User-Id`, with new `VITE_USER_ID` env support.
- Updated `DEVELOPMENT_PLAN.md` to mark Auth and Multiuser MVP completed.
- Updated `README.md` with phase-7 auth/multiuser behavior and usage.
- Refreshed frontend UI styling for landing + workspace sections, preserving existing accounting flows with improved layout and visual hierarchy.
- Evolved the landing page into a product-marketing surface with social proof, a 4-step workflow timeline, and JSON-driven category catalog preview.
- Expanded landing page information architecture with About, Testimonials, Contact Us, and Footer sections plus visible contact info and provider-styled login method UI.
- Added `StatsBand` component for full-width stats section with gradient numbers.
- Added `CLAUDE.md` with frontend design workflow, screenshot tooling, and anti-generic guardrails.
- Replaced backend persistence from in-memory repositories to EF Core + PostgreSQL.
- Updated infrastructure DI registrations to use scoped EF repositories and `AppDbContext`.
- Added initial database migration files under `src/backend/TravelAccounting.Infrastructure/Data/Migrations`.
- Added local PostgreSQL development orchestration (`docker-compose.yml`) and local `dotnet-ef` tool manifest (`dotnet-tools.json`).
- Updated API integration test host to override persistence with EF Core in-memory provider for test isolation.

### Changed (Landing Page Redesign — Yeldra-inspired)

- Redesigned landing page from scratch with modern premium SaaS aesthetic inspired by yeldra.com, preserving the orange-black brand palette.
- Replaced constrained `64rem` page container with full-bleed layout where each section manages its own `max-width: 72rem` inner container.
- Increased inter-section spacing from `1.65rem` to `clamp(4rem, 8vw, 7rem)` for generous modern whitespace.
- Removed visible section divider lines in favor of pure spacing separation.
- Redesigned navbar: removed dropdown panel menus, switched to flat links with glassmorphism-on-scroll effect (`backdrop-filter: blur(16px)`).
- Redesigned hero section: increased heading to `clamp(3rem, 7vw, 5.5rem)` with orange gradient keywords, removed pill badge, added trusted-by company band, removed inline stats.
- Added floating 3D tilt effect to dashboard preview (`perspective(1200px) rotateX(2deg)`) with orange glow shadow.
- Extracted `HowItWorks` from `BenefitsSection` into a standalone section with its own `#how-it-works` hash anchor.
- Simplified `HowItWorks` step cards: removed benefit lists, kept icon + title + description only. Enhanced connecting line with orange gradient.
- Restructured `BenefitsSection` from two-column intro+cards layout into centered header + 3-column icon card grid with Lucide icons (Receipt, ArrowLeftRight, FileSpreadsheet).
- Removed `proofPoints` and `workflow` props from `BenefitsSection` interface.
- Redesigned `PricingSection`: removed two-column intro and "rail" side panel, switched to centered header + 3-column card grid. Featured card uses orange border glow + slight scale-up.
- Redesigned `TestimonialsSection`: replaced featured/compact/ribbon card hierarchy with uniform 2x2 grid. Added avatar circles with initial letter and orange gradient. Removed embedded stats panel.
- Redesigned `FaqSection`: removed bordered shell wrapper, added 2-column accordion layout on desktop with `+`/`-` rotation indicators.
- Redesigned `FinalCtaSection`: centered CTA band with ambient orange radial glow, separated multi-column footer with Product/Resources nav groups and copyright.
- Updated `App.css`: switched font to Inter, removed dot-pattern body pseudo-element, removed unused purple CTA styles and `.eyebrow` class, removed `.app` padding.
- Added shooting stars fade-out in lower page via CSS `mask-image` on `.sa-page-sky`.
- Added shared CSS utilities: `.sa-section-inner`, `.sa-section-header--centered`, `.sa-btn--lg`.
