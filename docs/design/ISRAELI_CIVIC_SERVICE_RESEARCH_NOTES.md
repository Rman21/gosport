# Israeli Civic Service Research Notes

Last updated: 2026-06-18 14:25 IDT

Status: active design reference for SportIL UI work.

## Source Hierarchy

Use official Israeli public-sector sources first:

1. Har HaYeda design-system guide: https://harhayeda.gov.il/guides-digital-transformation/design-system-gov/
2. Israeli Government Design System: https://igds.gov.il/4988d5140/p/370cb3-building-a-digital-experience
3. gov.il accessibility pages: https://www.gov.il/he/pages/website_accessibility and https://www.gov.il/en/pages/website_accessibility
4. Har HaYeda government language guide: https://harhayeda.gov.il/guides-digital-transformation/language-characterization-guide/
5. Har HaYeda service-design principles: https://harhayeda.gov.il/guides-digital-transformation/tips-design/
6. Campus IL public digital writing course: https://campus.gov.il/course/digitalil-gov-digitalil-microcopyforgovil-he/

Use Globalbit/Deloitte/Awesome case studies only as supporting context. They are useful for understanding how IGDS is described in practice, but they are not the authority for SportIL decisions.

## Findings

Har HaYeda frames the government design system as a shared set of values, rules, and tools for clean, consistent government digital products. It explicitly calls out language, accessibility, and multilingual adaptation as strict requirements for government digital services.

IGDS is the current design-system anchor referenced by Har HaYeda. The live IGDS Zeroheight surface observed on 2026-06-18 identifies Design System 3.0, updated 2026-05-17, and exposes component/token areas for color, typography, spacing, borders, grid, shadows, icons, mobile, forms, tables, navigation, buttons, inputs, feedback, modal, drawer, toast, and error patterns.

gov.il accessibility guidance treats websites, applications, and online services as accessibility-relevant surfaces. SportIL should therefore target WCAG 2.2 AA even if it is not yet an official government service.

Har HaYeda service-design principles emphasize trust, consistent service quality across channels, and "the person at the center". This maps directly to SportIL's high-risk states: slot confidence, parent/child booking, payment, cancellation, waitlist, and support.

The government language guide and Campus IL course frame public digital writing as clear, simple, accessible, confidence-building, and oriented toward independent task completion.

## Design Decisions For SportIL

- Use an Israeli civic-service visual language, not a generic sports marketplace style.
- Do not copy gov.il branding or imply national government affiliation unless a partnership exists.
- Use Rubik as the default Hebrew-first UI typeface.
- Make Hebrew RTL the production-default civic baseline.
- Keep Russian and English as first-class supported locales.
- Use civic blue and neutral structure as the base; use sport accent color sparingly for availability and discovery.
- Treat status colors as semantic only: success, warning, danger, info, neutral.
- Build with IGDS-like primitives: buttons, inputs, search, dropdowns, date/time controls, stepper, status badges, notices, modals, drawers, toasts, tables, filters, and mobile navigation.
- Require a list alternative for maps and a text-first status alternative for every visual indicator.

## Implementation Guardrails

- Start from tokens and components, then pages.
- Use logical CSS properties for RTL/LTR.
- Avoid placeholder-only labels, color-only status, low-contrast muted text, and decorative motion.
- Keep one primary CTA per decision area.
- Prefer confirmation numbers, receipt states, support channels, and recoverable errors in booking/payment flows.
- Test mobile widths `360`, `390`, `430`, and desktop `1280`.
