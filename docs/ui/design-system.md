# CredNexus Visual Design System & Accessibility

**Product**: CredNexus  
**SIH 2026 Initiative** — Team Brainwired  
**Design Philosophy**: "Trust-first Minimal Fintech"

---

## 1. Color Palette Tokens

```css
/* Deep Navy (Institution / Trust / Primary) */
--color-navy: #0F2747;

/* Royal Blue (Action / Interactive / Technology) */
--color-royal: #1D4ED8;

/* Emerald (Eligibility / Success / Verified) */
--color-emerald: #15803D;

/* Saffron / Amber (Moratorium / Opportunity / Attention) */
--color-saffron: #F59E0B;

/* Neutral Surface Foundation */
--color-background: #F8FAFC;
--color-surface: #FFFFFF;
--color-border: #E2E8F0;
```

---

## 2. Typography Architecture

- **Primary UI Body & Numbers**: `Inter`
- **Display Headlines & Hero Statements**: `Manrope`
- **Multilingual Regional Fallback**: `Noto Sans` (Devanagari, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Gurmukhi, Odia, Urdu)
- **Financial Numbers**: Formatted with `.font-tabular` (`font-variant-numeric: tabular-nums`) to prevent jitter and maintain clean tabular alignment.

---

## 3. Native Bidirectional (BiDi) RTL Layout

CredNexus provides native right-to-left layout for **Urdu (`ur`)**:
- Sets `dir="rtl"` dynamically on document root.
- Reverses navigation menus, chevron alignments, card layouts, and progress bars without clipping text.
- Uses logical CSS utilities (`text-start`, `text-end`, `ps-*`, `pe-*`, `ms-*`, `me-*`).

---

## 4. Replaceable Logo System

Per specification Section 5, CredNexus implements a replaceable logo architecture:
- Reusable component: `<BrandLogo />`
- SVG Assets:
  - `apps/web/public/logos/crednexus-logo.svg`
  - `apps/web/public/logos/crednexus-logo-mark.svg`
  - `apps/web/public/logos/crednexus-logo-light.svg`
  - `apps/web/public/logos/crednexus-logo-dark.svg`
- Cleanly isolated so external designers can drop in final SVG/PNG graphics without refactoring application code.
