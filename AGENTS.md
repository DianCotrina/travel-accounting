# AGENTS.md

## Project Purpose
Build a web application for travel accounting.
The app allows travelers to register daily expenses (for example: Uber rides, lunch, tourist plans, museum entries, snacks) in the local currency of the country they are visiting.
Example scenario: an American user traveling in Argentina records expenses in ARS while tracking value relative to USD.

## Tech Stack
- Backend: .NET 10
- Frontend: React.js
- Architecture style: modular design

## Branching Strategy
- Base release branch: `release/2026.1.0`
- New work starts in module branches created from the release branch.
- Branch naming pattern: `<module-name>` (or `module/<module-name>` if needed for consistency).
- First implementation step for any new module: create and switch to its branch from `release/2026.1.0`.

## Engineering Rules
- Optimize for correctness, clarity, and reliability over speed.
- Avoid risky shortcuts, speculative changes, and messy hacks.
- Solve the root cause or core ask, not only a symptom.
- Follow existing codebase conventions (patterns, helpers, naming, formatting, localization).
- If divergence is necessary, state the reason explicitly.
- Cover all relevant surfaces end-to-end so behavior remains consistent.
- Preserve intended behavior and UX by default.
- For intentional behavior changes, gate or flag the change and add tests.
- Do not add broad try/catch blocks or success-shaped fallbacks.
- Do not swallow errors; surface or propagate them explicitly.
- Do not silently fail invalid input (no quiet early returns); follow repository logging/notification patterns.
- Read enough context first, then batch coherent edits instead of many micro-edits.
- Maintain type safety and pass build/type-check.
- Avoid unnecessary casts such as `as any` and `as unknown as ...`.
- Prefer proper types and guards; reuse existing normalization/helpers.
- Search for prior art before adding helpers; reuse or extract shared code instead of duplicating logic.
- Bias to action: implement with reasonable assumptions unless truly blocked.
- End each task with concrete edits, or a specific blocker plus a targeted question.

## Documentation
- Keep `README.md` and code-level docs aligned with behavior.
- Record notable user-facing or architectural changes in `CHANGELOG.md`.

## Delivery Workflow
- After making code changes, run the relevant tests and/or smoke checks.
- If checks pass, commit and push automatically.
- If checks fail, report failures clearly and do not push until resolved.
- When running shell commands in PowerShell, do not chain commands with `&&`; use PowerShell separators (`;`) or separate commands to avoid parser errors.

## Frontend Design & UI Execution Rules

### Always Do First (Frontend)
- If a `frontend-design` skill is available in the current session, invoke it before writing frontend UI code.
- If no such skill is available, follow the rules in this section directly.
- Preserve the existing React/Vite architecture unless the user explicitly asks for a standalone prototype.

### Reference-Driven UI Work
- If a reference image is provided, match layout, spacing, typography, and color as closely as possible.
- Do not add features, sections, or content that are not present in the reference.
- Use placeholder content only where real content/assets are not provided.
- If visual matching is requested, perform at least two comparison/fix passes before considering the task complete (unless the user stops earlier).

### Visual Review Workflow (Portable)
- Always preview from a local server (`http://localhost:<port>`), not `file:///`.
- If screenshot tooling exists in the repo, use it; otherwise use the available local preview workflow.
- Avoid hardcoded machine paths in instructions. Use placeholders when documenting local tool paths:
  - `<put your path here>`
- If the user or repo provides a screenshot script, document and use the repo-local path only.

### Output Defaults (This Repo)
- Default to React components within `src/frontend/web`, not single-file HTML.
- Reuse existing app structure and patterns before introducing new UI architecture.
- Keep the UI mobile-friendly and responsive by default.

### Brand Assets
- Check `assets/` (especially `assets/logos/` and `assets/design-inspirations/`) before using placeholders.
- Use provided logos, palettes, and style guides exactly when available.
- Do not invent brand colors if a brand palette exists.

### Anti-Generic Design Guardrails
- Avoid default-looking color choices; use intentional, project-appropriate palettes.
- Use layered depth (base/elevated/floating) rather than flat repeated cards.
- Use purposeful typography hierarchy; avoid identical visual treatment for headings and body text.
- Do not use `transition-all`; animate only the properties that need to change.
- Every interactive element must have hover, focus-visible, and active states.
- Keep spacing consistent and token-like, not ad hoc.

### Frontend Architecture Rules
- Keep shared frontend types and defaults in app-level modules (for example `src/frontend/web/src/app`).
- Split large UI surfaces into focused components (presentation) and keep orchestration in container components.
- Reuse fetch helpers / shared request patterns instead of duplicating API wiring.
- Preserve current behavior while refactoring; refactors should be behavior-safe by default.

### Frontend Validation Checklist
- Run relevant checks after frontend changes:
  - `npm --prefix src/frontend/web run typecheck`
  - `npm --prefix src/frontend/web run test`
  - `npm --prefix src/frontend/web run lint`
- If the change is visual, do a quick smoke test in the browser (or screenshot review if available).
- If checks fail, fix before commit/push.

### Frontend UI Review Mode
- For frontend UI review requests, use a structured checklist covering accessibility, focus states, forms, motion, typography, content handling, images, performance, navigation/state, touch/safe areas, theming, locale/i18n, hydration safety, and anti-patterns.
- Report findings grouped by file using `file:line` format with terse, high-signal notes (no long explanations unless the fix is non-obvious).
- Apply framework-appropriate checks (React/Vite in this repo) and avoid Next.js-specific assumptions unless the code actually uses them.
- Include repo-specific checks: reuse shared category catalog/components, preserve landing-page modularity, and flag encoding/mojibake text issues.
