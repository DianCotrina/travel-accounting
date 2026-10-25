---
paths:
  - "src/frontend/web/**"
---

# Frontend Rules (React 19 + TypeScript + Vite)

## Structure
- Shared types, defaults, and catalogs live in `src/app/` (e.g. `types.ts`, `categoryCatalog.ts`, `AuthContext.tsx`).
- Components live in `src/components/`; landing building blocks in `src/components/ui/`. Each component owns its local CSS file.
- Container components (e.g. `DashboardPage`) orchestrate data and state; presentational components receive props.
- Default to React components inside `src/frontend/web` — no standalone HTML prototypes unless asked.

## Bilingual UI (ES/EN)
- Every user-visible string — text, labels, placeholders, `aria-label`, toasts, errors — comes from the i18n catalogs in `src/app/i18n/` (`en.ts` defines the shape, `es.ts` must match; `i18n.test.tsx` checks parity). Never hard-code UI copy in components.
- Spanish is neutral Latin American with informal "tú". Keep English and Spanish CTA labels short enough for the 375px nav.
- Read copy with `const { t } = useI18n()`; parameterized or plural copy is a function in the catalog (e.g. `t.expenses.deleted(note)`).
- Format money and dates only through `src/app/format.ts` (it follows the active locale); never `toLocaleString()` ad hoc.
- User data (trip names, notes) is never translated. Server error messages are shown as sent; generic fallbacks are localized via `errorMessage(error, t.errors)`.
- Layouts must tolerate ~30% longer Spanish strings: no fixed widths on text containers.

## Types
- `strict` TypeScript. No `any`, no `as any`, no `as unknown as T`. Use type guards, discriminated unions, or proper generics.
- API response types are declared once in `src/app/types.ts` and mirror backend DTOs field-for-field.

## API calls
- Use the shared `api<T>()` helper (it attaches the `Authorization: Bearer` header and throws on non-2xx). Do not hand-roll `fetch` for JSON endpoints.
- Every frontend path must match an existing backend route exactly (e.g. `/api/reference/countries`, `/api/trips/{id}/ledger/summary`, `/api/trips/{id}/reports/summary`, `/api/trips/{id}/reports/export/csv`). Check the controller's `[Route]`/`[Http*]` attributes before adding or changing a call.
- Surface API errors to the user with a clear message; never swallow them or render success-shaped defaults.

## Auth
- Read the session/token only through `useAuth()` from `AuthContext`. Do not read `sessionStorage` or env tokens directly in components.
- `VITE_AUTH_BEARER_TOKEN` is a dev-only stopgap until real identity exists (PRD R-2/Q-5).

## Tests
- Vitest + Testing Library. Test behavior from the user's perspective (roles, labels, text), not implementation details.
- Mock network at the `fetch` boundary and assert the exact request path and method — this guards frontend/backend route drift.
- New or changed user flows need a test; bug fixes need a regression test.

## Checks
```bash
npm --prefix src/frontend/web run typecheck
npm --prefix src/frontend/web run lint
npm --prefix src/frontend/web run test
```
