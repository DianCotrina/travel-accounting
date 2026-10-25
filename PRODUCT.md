# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three traveler types, weighted **equally** — no type wins a design trade-off by default; decide case by case.

- **Digital nomad / independent traveler:** lives or travels abroad for long stretches and spends daily in local currencies. Job: log spending as it happens and always know its real cost in their home currency, like a personal travel ledger.
- **Business traveler:** travels for work (consultants, employees, founders). Job: capture expenses during the trip so the reimbursement or bookkeeping hand-off to finance is clean and immediate, not reconstructed from receipts afterwards.
- **Friends or couples traveling together:** share one trip. Jobs: (1) everyone records into the same trip and sees the group's totals; (2) record who paid what, split shared costs, and settle who owes whom — in local and home currency.

Secondary audience (future): **companies and their finance teams** reviewing and approving employees' travel expenses, served by the Team plan.

## Product Purpose

Sacatucuenta ("saca tu cuenta" — work out your numbers) lets travelers record expenses in the local currency of the country they are in and see, at any moment, what that spending means in their home currency. Records are categorized, auditable, and exportable, so the trip ends with numbers that are already done.

Success: a trip ends with complete, categorized records that need no cleanup — ready to reimburse, to settle between companions, or to keep as a personal ledger.

## Positioning

Travel **accounting**, not budgeting and not accounting software:
- Every expense keeps its original local amount **and** the exchange rate used, so home-currency figures are traceable, never guessed.
- Built around the moment after the trip (reimbursement, bookkeeping, settling up) rather than generic spending charts.
- One product covers solo, business, and shared trips.
- It feeds accounting workflows (CSV exports, ledger summaries); it does not replace accounting software.

## Operating Context

- **During the trip, on a phone:** quick entry right after paying (taxi/Uber, meals, museums, snacks, lodging), in local currency.
- **During and after the trip, at a desk:** review ledger totals by day and category, check conversions, filter reports, export CSV for finance or bookkeeping, and (planned) settle balances between companions.
- Example scenario: an American traveling in Argentina records expenses in ARS and tracks their USD impact.

## Capabilities and Constraints

**Shipped (v0.1.0)**
- Trips: create, edit, archive; each has destination, date range, home currency, local currency.
- Expenses: create, edit, delete within a trip; category, amount, currency, date, notes.
- Automatic exchange rates per trip/day/currency pair (exchangerate.host), stored with the expense; if the provider fails, the expense is still saved and shown as "not converted" — never a fabricated rate.
- Ledger summary per trip: totals in local and home currency, by category and by day, converted vs. missing-conversion counts.
- Reports filtered by date range and category; CSV export.
- Per-user data isolation (JWT); immutable audit trail of accounting-sensitive edits (API only, no UI yet).
- Reference countries: AR, US, BR, CL, MX, CO. Configured supported currencies: USD, ARS only (gap).

**Planned (confirmed direction)**
- **Bilingual ES/EN** product UI and content.
- **Shared trips:** multiple travelers in one trip with group totals, plus who-paid-what, expense splitting, and balances/settle-up.
- **Team plan for companies:** finance review and approval of employee travel expenses.

**Known constraints and open product decisions** (see `docs/PRD.md` §6.9 and §9)
- Real identity/sign-up does not exist yet (login is a dev stopgap).
- Expense category catalog is not settled: landing and backend use different sets.
- Per-currency rounding rules (e.g. zero-decimal currencies) are undecided.
- Exact feature limits per plan are undecided.

## Brand Commitments

- Name: **Sacatucuenta** (Spanish wordplay; kept as the brand name in both languages).
- Logo: `assets/logos/sacatucuenta-logo.png`.
- Voice: plain and practical — finance-ready without jargon; speaks to travelers, not accountants.

## Evidence on Hand

- **Pricing (real):**
  - Starter — $0, for occasional trips.
  - Traveler Pro — $15/month, with a free trial.
  - Team — $39/month, for companies (contact sales).
- **No real users, testimonials, customer logos, usage statistics, or benchmarks exist.** The landing page's stats (e.g. "12,480+ trips", "1.8M entries", "84 countries") and testimonials are placeholders and must not be presented as real or reused. Do not fabricate proof; omit it or use clearly labeled samples until real evidence exists.
- Product documentation: `docs/PRD.md` (scope, requirements, open questions), `README.md` (endpoints and behavior).

## Product Principles

1. **Capture in the moment.** Logging an expense mid-trip must be faster than putting it off; local currency and today's date are the defaults.
2. **Currency truth is auditable.** Show the original amount, the rate used, and the home-currency value; make missing conversions visible instead of hiding or guessing them.
3. **Records serve what happens after the trip.** Every feature should shorten the path to a finished outcome: a reimbursement, a settled balance, or a closed personal ledger.
4. **Three trip types, one product.** Solo, business, and shared trips are equally first-class; don't optimize one by degrading another.
5. **Never fabricate.** No invented proof, rates, or numbers — in the product or in its marketing.

## Accessibility & Inclusion

- Bilingual Spanish/English is a product requirement, not an add-on: copy, formats, and layouts must work in both languages.
- Currency amounts and dates follow the user's locale and each currency's conventions.
