---
name: ef-migration
description: Change the travel-accounting PostgreSQL schema with EF Core migrations (entity config, migration generation, review, apply locally, test). Use whenever an entity, DbSet, column, index, or relationship changes.
---

# EF Core Migration

## Prerequisites
- Local tools: `dotnet tool restore` (uses `dotnet-tools.json` for `dotnet-ef`).
- Local database: `docker compose up -d` (see `docker-compose.yml`).

## Steps
1. Update the domain entity and its EF configuration in `TravelAccounting.Infrastructure/Data` (`AppDbContext` / entity configuration).
2. Generate the migration with a descriptive PascalCase name:
   ```bash
   dotnet ef migrations add <DescriptiveName> \
     --project src/backend/TravelAccounting.Infrastructure \
     --startup-project src/backend/TravelAccounting.Api \
     --output-dir Data/Migrations
   ```
3. Review the generated `Up`/`Down`:
   - no unintended drops or renames-as-drop/create (data loss);
   - money columns are `numeric` with explicit precision, never floating point;
   - required columns added to existing tables have a default or a data backfill step;
   - indexes exist for ownership and trip-scoped lookups.
4. Apply locally:
   ```bash
   dotnet ef database update \
     --project src/backend/TravelAccounting.Infrastructure \
     --startup-project src/backend/TravelAccounting.Api
   ```
5. Run `dotnet test src/backend/TravelAccounting.sln` (API tests use the EF in-memory provider, so also sanity-check the real database manually for provider-specific behavior).
6. Record the migration in `CHANGELOG.md`.

## Never
- Edit or delete a migration that exists on `release/*`; add a new corrective migration instead.
- Commit real connection strings or passwords.
