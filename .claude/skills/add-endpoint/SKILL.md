---
name: add-endpoint
description: Add or change a backend API endpoint end-to-end in travel-accounting, keeping controller route, application service, frontend caller, types, and tests in sync. Use for any new route, route rename, or request/response contract change.
---

# Add or Change an Endpoint

Route drift between frontend and backend has already broken the dashboard once (PRD K-1). Every endpoint change touches all of the surfaces below in the same change.

## Checklist
1. **Contract** — define the route (`api/trips/{tripId:guid}/<feature>/...`), method, request model, response DTO, and error cases (404 not found/not owned, 400 `{ error }` validation).
2. **Application** — add the method to the `I<Feature>Service` interface and implementation:
   - load the trip and enforce `OwnerUserId == currentUserContext.UserId` (treat not-owned as not found);
   - call `IAuditService.LogAsync` for accounting-sensitive mutations;
   - return a `sealed record` DTO.
3. **API** — controller action in `Controllers/<Feature>Controller.cs`:
   - request model is a class with `init` properties + data annotations in `Api/<Feature>/`;
   - map to the application request explicitly; return `ActionResult<T>`.
4. **Frontend**
   - add/update the type in `src/frontend/web/src/app/types.ts` to mirror the DTO;
   - call through `api<T>()` with the exact path; search the frontend for old paths when renaming:
     ```bash
     grep -rn "/api/" src/frontend/web/src
     ```
   - surface errors to the user.
5. **Tests**
   - `tests/TravelAccounting.Api.Tests/<Feature>ApiTests.cs`: happy path, validation, not-found, cross-user isolation (use `JwtTestTokenFactory` for two users), audit entry when mutating.
   - frontend test asserting the request path/method and the rendered result.
6. **Docs** — add the endpoint to `README.md` (module section + quick check list) and `CHANGELOG.md`.

## Verify route parity
List backend routes and compare with frontend calls before finishing:
```bash
grep -rnE '\[Route\(|\[Http(Get|Post|Put|Delete|Patch)' src/backend/TravelAccounting.Api/Controllers
grep -rnoE '/api/[A-Za-z0-9/${}._?-]+' src/frontend/web/src
```
