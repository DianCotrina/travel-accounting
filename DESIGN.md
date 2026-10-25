---
name: Sacatucuenta
description: Travel accounting after dark — local spending, home-currency truth, numbers already done.
colors:
  copper: "#db8650"
  copper-light: "#e7a875"
  copper-deep: "#ae643c"
  graphite: "#100e0c"
  graphite-surface: "#1a1614"
  graphite-raised: "#25211e"
  graphite-border: "#352f2b"
  ivory: "#f2f0ec"
  stone: "#b0a9a3"
  ash: "#8a837e"
  danger: "#ed756e"
  warning: "#ebbd57"
  success: "#6dc88f"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.01em"
  body-small:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.15em"
  numeric:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "8px"
  md: "10px"
  lg: "14px"
  xl: "24px"
  pill: "999px"
spacing:
  xs: "0.35rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  2xl: "2rem"
  section: "clamp(4rem, 8vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.copper}"
    textColor: "{colors.graphite}"
    typography: "{typography.body-small}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.6rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.copper-light}"
    textColor: "{colors.graphite}"
  button-primary-active:
    backgroundColor: "{colors.copper-deep}"
    textColor: "{colors.ivory}"
  button-secondary:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.ivory}"
    typography: "{typography.body-small}"
    rounded: "{rounded.md}"
    padding: "0.8rem 1.6rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.graphite-border}"
    textColor: "{colors.ivory}"
  input:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ivory}"
    typography: "{typography.body-small}"
    rounded: "{rounded.md}"
    padding: "0.6rem 0.85rem"
    height: "2.75rem"
  card:
    backgroundColor: "{colors.graphite-surface}"
    textColor: "{colors.ivory}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  chip:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.stone}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.75rem"
  nav:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ivory}"
    height: "4rem"
---

<!-- STATUS: Target system. Colors were changed from the incumbent neon orange (#ff6a1c, with glows) to the Copper palette on 2026-10-25; the code still uses the old orange until the palette is applied (see "Do's and Don'ts" → migration). Typography, spacing, radii, and component structure are extracted from the current code. -->

# Design System: Sacatucuenta

## Overview

**Creative North Star: "Ember After Dark"**

Sacatucuenta lives at night: a warm graphite canvas where one color — copper — does all the signaling. The mood is bold and premium: big, tightly tracked headlines, generous section rhythm, and a confident single call to action per screen. The warmth comes from the material, not from neon. Copper reads like metal catching low light, never like a glowing sign.

Components are refined and contained. Surfaces separate by tone and hairline borders rather than by shadows or color; buttons, inputs, and cards are quiet until touched, and state changes are small and exact (a 2px lift, a border shift, a focus ring). Money is the content: amounts are set in tabular figures with clear local-versus-home hierarchy, so the interface feels like a precise ledger, not a dashboard of decorations.

The marketing landing carries the most expression (the night-sky backdrop, display type, reveal motion); the app dashboard keeps the same palette and type but trades expression for scanability and fast entry on a phone.

**Key Characteristics:**
- Warm graphite surfaces, never pure black; copper as the single accent.
- One subtle glow per screen, on the primary action only.
- Display headlines at 700 weight with tight negative tracking.
- Depth by tonal steps and hairline borders, not drop shadows.
- Tabular, right-aligned money with local and home currency always paired.
- Bilingual by construction: layouts tolerate ~30% longer Spanish strings.

## Colors

A warm, low-saturation dark palette: copper on graphite, with ivory text and stone-gray support.

### Primary
- **Copper** (#db8650): the one accent. Primary buttons, the active nav item, focus rings, links, selected states, the key figure in a summary. Rarity is the point.
- **Copper Light** (#e7a875): hover state of copper fills and the top stop of the primary button's subtle gradient; copper text on raised surfaces where more contrast is needed.
- **Copper Deep** (#ae643c): pressed/active state and the 1px edge of copper buttons. Never a text color on graphite (too dark).

### Neutral
- **Graphite** (#100e0c): the page canvas and input wells. Warm near-black — pure #000 is not used.
- **Graphite Surface** (#1a1614): cards, panels, list containers, the dashboard top bar.
- **Graphite Raised** (#25211e): secondary buttons, chips, menus, dialogs — anything that floats or is one step above a card.
- **Graphite Border** (#352f2b): hairline borders (1px) between and around surfaces, table row dividers, input strokes at rest.
- **Ivory** (#f2f0ec): primary text and headings (16.9:1 on graphite).
- **Stone** (#b0a9a3): secondary text — descriptions, labels, home-currency subamounts (7.7:1 on surface).
- **Ash** (#8a837e): metadata, placeholders, captions. Only on graphite or graphite-surface (≥4.8:1); not on graphite-raised.

### Status
- **Danger** (#ed756e): destructive actions and errors (6.3:1 on surface).
- **Warning** (#ebbd57): attention states such as "not converted yet" or an unreachable backend.
- **Success** (#6dc88f): confirmations and settled balances.

Status colors appear as text, icons, or a 1px border with a tinted background at ≤12% opacity — never as large solid fills.

### Named Rules
**The One Copper Rule.** Copper covers at most ~10% of any screen, and only one copper-filled button exists per view. Everything else is graphite, ivory, and stone.

**The Warm Black Rule.** No pure black (#000) and no cool grays. Every neutral carries the same warm hue (~55°).

**The No Neon Rule.** No saturated orange (#ff6a1c family), no colored text glows, no glowing borders. Warmth comes from copper and graphite, not light effects.

## Typography

**Display Font:** Inter (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Inter (same family)

**Character:** A single grotesk family carried from 0.78rem labels to 5.5rem display. Boldness comes from weight (700) and tight negative tracking at large sizes, not from a second typeface. Inter must actually be loaded (self-hosted or via a font service); today it is declared but not loaded, so it falls back to the system font.

### Hierarchy
- **Display** (700, clamp(3rem, 7vw, 5.5rem), 0.95, -0.05em): landing hero headline only, one per page.
- **Headline** (700, clamp(2rem, 4vw, 3rem), 1.05, -0.04em): landing section titles.
- **Title** (700, 1.15rem, 1.3): card and panel headings in the app; dialog titles.
- **Body** (400, 1rem, 1.6): paragraphs and descriptions; max line length ~48–65ch.
- **Body Small** (400, 0.875rem, 1.5): dense app UI, form fields, table rows, buttons.
- **Label** (700, 0.78rem, 0.15em, uppercase): kickers above section headlines and small group labels. Never for sentences or for Spanish words longer than ~14 characters.
- **Numeric** (600, 1.5rem, tabular figures): trip totals and key amounts; smaller amounts use body sizes with tabular figures too.

### Named Rules
**The Tabular Money Rule.** Every amount uses tabular figures (`font-variant-numeric: tabular-nums`) and is right-aligned in lists and tables, so columns of money line up.

**The Paired Currency Rule.** A home-currency amount is always shown with its local-currency original (local first and larger in entry contexts, home first and larger in summaries), and a missing conversion is shown explicitly as "not converted", never as 0.

## Layout

- **Container:** content max-width 72rem, centered, with side padding clamp(1.25rem, 3vw, 2.5rem); 16px minimum gutter at phone width.
- **Landing rhythm:** full-bleed sections with an inner container; vertical gap between sections clamp(4rem, 8vw, 7rem); centered section intros (kicker + headline + subtitle, max 52rem). Whitespace separates sections — no divider lines.
- **App density:** dashboard content uses 1.5rem gaps between cards and 0.6–0.75rem between form fields; lists use 1px row dividers instead of nested cards.
- **Spacing scale:** 0.35 / 0.5 / 0.75 / 1 / 1.5 / 2rem for component internals; the section token for landing chapters.
- **Breakpoints:** 36rem (small phones), 48rem (phone → tablet, the main layout switch), 64rem (tablet → desktop).
- **Mobile first:** expense entry must work one-handed on a phone: full-width fields, primary action reachable at the bottom, no horizontal scroll.

## Elevation & Depth

Depth is tonal: graphite (page) → graphite-surface (cards) → graphite-raised (floating). A 1px graphite-border hairline defines edges. Shadows are neutral, dark, and reserved for things that genuinely float (menus, dialogs, the sticky nav on scroll). The primary button is the only element allowed a warm glow, and it is subtle.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 12px 32px #00000066, 0 2px 6px #0000004d`): dialogs, dropdown menus, popovers.
- **CTA Glow** (`box-shadow: 0 8px 24px #db86501f`): primary button at rest; on hover `0 10px 28px #db86502e`. One per screen.
- **Focus Ring** (`box-shadow: 0 0 0 3px #db865047`): every focusable element on `:focus-visible`, in addition to a copper border on fields.

### Named Rules
**The Flat-By-Default Rule.** Cards and panels have no shadow at rest; they separate from the page by tone and a hairline. Shadows appear only for floating layers.

**The Single Glow Rule.** Only the primary action on a screen may glow. No glowing cards, borders, icons, or text.

## Shapes

Gently rounded and consistent: 10px (`rounded.md`) for buttons and inputs, 14px (`rounded.lg`) for cards and panels, 24px (`rounded.xl`) for large showcase containers and dialogs, and full pills only for chips, badges, and avatars. Borders are 1px hairlines; no thick outlines, no single-sided rounded accents.

## Components

### Buttons
Confident but quiet: solid fills, small exact state changes.
- **Shape:** gently rounded (10px), min height 3rem (2.75rem in dense app rows), 1px edge.
- **Primary:** copper fill with graphite text (6.9:1), 1px copper-deep edge, optional subtle vertical gradient copper-light → copper, CTA Glow shadow. One per view.
- **Hover / Focus:** copper-light fill, 2px upward translate, slightly stronger glow; `:focus-visible` adds the Focus Ring (focus must be visibly distinct from hover).
- **Active:** copper-deep fill, ivory text, no translate.
- **Secondary:** graphite-raised fill, ivory text, graphite-border edge; hover shifts the fill to graphite-border.
- **Destructive:** secondary style with danger text and a danger border on hover; never a solid red fill.

### Chips
- **Style:** graphite-raised pill, stone text in the label style; categories may carry a small colored dot rather than a colored fill.
- **State:** selected chips use a copper border and ivory text.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** graphite-surface.
- **Shadow Strategy:** none at rest (Flat-By-Default).
- **Border:** 1px graphite-border; hover on interactive cards shifts the border toward stone and lifts 2px.
- **Internal Padding:** 1.25rem (1rem on phones).

### Inputs / Fields
- **Style:** graphite well, 1px graphite-border stroke, 10px radius, ivory text, ash placeholder, min height 2.75rem for touch.
- **Focus:** copper border plus the Focus Ring.
- **Error / Disabled:** danger border with a danger message below the field; disabled fields lower contrast but keep a visible label.
- **Labels:** always visible above the field (stone, body-small, 600); never placeholder-only.

### Navigation
- **Landing:** sticky top bar, flat links in stone that turn ivory on hover; on scroll a translucent graphite background with backdrop blur and a hairline bottom border. Mobile: a full-width sheet menu.
- **App:** graphite-surface top bar with the logo, the user identity in stone, and a secondary-style log-out button; the active section is marked with copper, not with a filled pill.

### Money Row (signature)
The core repeated unit of the product: category, note, and date on the left; the local amount (tabular, ivory) and the home-currency amount with its rate (stone) on the right; a warning-colored "not converted" marker when there is no rate. Rows are separated by hairlines, not boxed.

## Do's and Don'ts

### Do:
- **Do** use the Copper tokens from this file for every color; reference CSS custom properties, never hard-coded hex in components.
- **Do** keep one copper-filled primary action per view, with the CTA Glow as the only glow on screen.
- **Do** set every amount in tabular figures and pair local and home currency (The Paired Currency Rule).
- **Do** give every interactive element distinct hover, `:focus-visible` (Focus Ring), and active states.
- **Do** animate only `transform` and `opacity` (140–180ms ease for state, 500–600ms `cubic-bezier(0.2, 0.8, 0.2, 1)` for landing reveals) and honor `prefers-reduced-motion`.
- **Do** design every screen for both Spanish and English copy lengths.
- **Do** (migration) consolidate the three color sources in code — `--sc-*` in `App.css`, `--sa-*` in `LandingPage.css`, and shadcn's light oklch tokens in `tailwind.css` — into one dark token set matching this file, and load Inter.

### Don't:
- **Don't** use the old neon orange (#ff6a1c, #ff8f47) or saturated glow shadows (`0 0 30–40px #ff6a1c…`).
- **Don't** use pure black, cool grays, or the purple (#6e45ff) and mint (#3dfd98) accents that appear in the login and category previews.
- **Don't** put shadows on cards at rest, or glow on anything but the primary action.
- **Don't** use `transition: all`.
- **Don't** show a missing conversion as 0 or hide it; mark it "not converted".
- **Don't** render the light shadcn theme inside the dark app (current dialog/button/input primitives read light tokens).
- **Don't** present placeholder statistics or testimonials as real (see PRODUCT.md, Evidence on Hand).
