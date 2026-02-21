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
