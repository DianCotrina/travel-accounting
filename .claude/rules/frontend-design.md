---
paths:
  - "src/frontend/web/src/components/**"
  - "src/frontend/web/src/**/*.css"
  - "src/frontend/web/index.html"
  - "assets/**"
---

# Frontend Design & UI Rules

## Before writing UI
- Invoke the `frontend-design` skill (if available) before writing UI code.
- `DESIGN.md` (root) is the visual source of truth: tokens, type scale, components, and rules (Copper on graphite, "Ember After Dark"). `PRODUCT.md` holds product context. Read both before UI work.
- Check `assets/` (especially `assets/logos/` and `assets/design-inspirations/`) and use provided logos and palettes exactly. Do not invent brand colors when a palette exists.
- Preserve the existing React/Vite architecture and component patterns.

## Reference-driven work
- With a reference image: match layout, spacing, typography, and color. Do not add sections, features, or content that are not in the reference, and do not "improve" it.
- Without a reference: design with high craft using the guardrails below.
- Visual work requires at least two screenshot → compare → fix passes (unless the user stops earlier).

## Visual review workflow
- Always preview from a local server: `npm --prefix src/frontend/web run dev` (`http://localhost:5173`). Never screenshot `file:///`.
- Screenshots: `npm --prefix src/frontend/web run screenshot -- http://localhost:5173` (see `scripts/screenshot.mjs` for the browser-path env var; never hardcode machine paths in docs). Output goes to `src/frontend/web/temporary-screenshots/` (gitignored). Read the PNG to review it.

## Guardrails (all UI)
- Theme: Copper on warm graphite per `DESIGN.md` (one copper accent per view; no neon orange, no pure black, no cool grays). Never default Tailwind blue/indigo as primary.
- Motion: animate only `transform` and `opacity`. Never `transition-all`. Prefer subtle motion and respect `prefers-reduced-motion`.
- States: every interactive element has hover, `focus-visible`, and active states; keyboard accessible; readable contrast on dark backgrounds.
- Depth: layered, color-tinted, low-opacity shadows (base/elevated/floating) instead of flat repeated cards.
- Typography: clear hierarchy; pair a display face with a clean sans; tight tracking on large headings.
- Spacing: consistent, token-like values — no ad hoc pixel values.
- Mobile-first and responsive by default; no horizontal scroll at phone width.
- Flag encoding/mojibake text issues when you see them.

## Landing page pattern
- Full-bleed sections with an inner container (`max-width: 72rem; margin: 0 auto`); no narrow bordered page box.
- Generous spacing between major sections (`4rem+`); separate with whitespace, not `<hr>` or 1px divider lines.
- Hero heading `3rem+` on desktop with tight letter-spacing (`-0.04em` or tighter).
- Flat link navbar with glassmorphism on scroll; avoid grid dropdown panels on single-page sites.
- Do not wrap every section in the same bordered rounded shell; vary section morphology (grids, centered content, split layouts).
- Glow is reserved for the single primary action per screen (DESIGN.md "Single Glow Rule"); featured elements use a copper border or tonal step instead.
- Section intros default to centered kicker + heading + subtitle.
- Interactive cards hover with `translateY(-2px)` plus a subtle border change (no glow).
- Product screenshots float (perspective and the neutral Float shadow; no colored glow).
- Stats live in their own full-width band; testimonials include avatar circles.
- Default flow (adapt as needed): Nav → Hero → How it works → Features → Stats → Pricing → Testimonials → FAQ → CTA band → Footer.
- Add `scroll-margin-top` to anchored sections. Keep each section a reusable component with local CSS; orchestrate in a single landing container.
- Do not publish fabricated metrics or testimonials as real (PRD K-3).

## UI review mode
For UI review requests, use a checklist covering accessibility, focus states, forms, motion, typography, content handling, images, performance, navigation/state, touch/safe areas, theming, and i18n. Report findings grouped by file as `file:line` with terse notes. Include repo checks: reuse the shared category catalog/components and preserve landing modularity.
