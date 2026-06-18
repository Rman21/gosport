# Israeli Civic Service UI Direction

Last updated: 2026-06-18 14:25 IDT

Status: accepted design direction for Sport Netanya MVP.

## Positioning

SportIL should feel like a trusted Israeli civic digital service, not like a generic sports marketplace. The right emotional mix is:

- public-service clarity;
- sports marketplace usefulness;
- municipal trust;
- mobile-first speed;
- accessible, multilingual operation.

This is inspired by gov.il and the Israeli Government Design System patterns, but SportIL must not imply that it is an official national government service unless that partnership exists. The product can be municipal/civic in tone without copying protected branding.

## Research Basis

Primary/near-primary sources:

- Har HaYeda says the Israeli government Design System creates shared values, rules, and tools to keep a unified clean design line, with strict attention to language, accessibility, and multilingual adaptation: https://harhayeda.gov.il/guides-digital-transformation/design-system-gov/
- The Israeli Government Design System site is referenced from Har HaYeda as the government DS: https://igds.gov.il/4988d5140/p/370cb3-building-a-digital-experience
- gov.il accessibility guidance explicitly covers websites, applications, and online public services: https://www.gov.il/he/pages/website_accessibility and https://www.gov.il/en/pages/website_accessibility
- Har HaYeda service-design principles emphasize public trust, service quality, multi-channel consistency, and "the person at the center": https://harhayeda.gov.il/guides-digital-transformation/tips-design/
- Har HaYeda's government language guide and the Campus IL public digital writing course frame civic UX copy as clear, simple, accessible, and action-completion oriented: https://harhayeda.gov.il/guides-digital-transformation/language-characterization-guide/ and https://campus.gov.il/course/digitalil-gov-digitalil-microcopyforgovil-he/
- WCAG 2.2, Core Web Vitals, PWA, Next.js, and React official docs define the technical quality baseline.

Supporting, non-official case-study sources:

- Globalbit case studies describe the IGDS as RTL-native, accessible, component-based, and token-governed. Treat this as directional context, not a legal or official source.

## Design North Star

The UI should answer in 5-10 seconds:

```text
Where can I do sport?
Is this slot reliable?
Can I book or do I need confirmation?
Can I pay safely?
What happens next?
```

If a screen does not improve one of these answers, it should be removed or delayed.

## Visual Tone

| Attribute | Direction |
|---|---|
| Overall | Clean, official, restrained, confident. |
| Density | More information-dense than a startup landing page, less dense than an enterprise admin tool. |
| Color | Civic blue foundation, white surfaces, soft grey structure, restrained status colors. |
| Shape | 4-8px radii; no playful pill overload; no decorative blobs/orbs. |
| Typography | Highly legible Hebrew/Russian/English support; no display gimmicks. |
| Motion | Functional transitions only: sheet open/close, route continuity, payment/booking state changes. |
| Imagery | Real facility/coach/sport photos only where they help inspect a real place or person. |

## Color Tokens

These are SportIL civic tokens, not exact gov.il brand tokens.

```css
:root {
  --color-bg: #f6f8fb;
  --color-surface: #ffffff;
  --color-surface-subtle: #eef3f8;
  --color-text: #142033;
  --color-text-muted: #526172;
  --color-border: #d7e0ea;
  --color-border-strong: #aab8c7;

  --color-primary: #005eb8;
  --color-primary-hover: #004a93;
  --color-primary-subtle: #e7f1fb;
  --color-secondary: #123b68;
  --color-accent: #007c89;

  --color-success: #137333;
  --color-success-subtle: #e7f4eb;
  --color-warning: #a15c00;
  --color-warning-subtle: #fff3df;
  --color-danger: #b3261e;
  --color-danger-subtle: #fce8e6;
  --color-info: #005eb8;
  --color-info-subtle: #e7f1fb;
}
```

Rules:

- Primary blue is for final actions and navigation focus.
- Accent teal is for sport/availability highlights only.
- Do not create a one-note blue UI. Use neutral structure and status colors.
- Payment trust states use text + icon + color, never color alone.

## Typography

Preferred stack:

```css
font-family:
  "Rubik",
  "Noto Sans Hebrew",
  "Noto Sans",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Rules:

- Rubik is the primary Hebrew-first UI font for the first implementation because the current IGDS surface uses Rubik across body, heading, navigation, and sidebar typography.
- Hebrew must be first-class, not an afterthought.
- Russian and English must fit the same components without overflow.
- Use sentence case for Russian/English UI copy.
- Avoid giant hero headings inside tool surfaces.
- Headings should be practical: service names, section titles, and next actions.

## Layout System

| Token | Value |
|---|---|
| Base spacing | 4px |
| Standard spacing | 8, 12, 16, 24, 32px |
| Mobile page padding | 16px |
| Desktop page max width | 1180px |
| Tool/control radius | 6px |
| Card radius | 8px max |
| Focus ring | 3px outer ring, high contrast |
| Minimum web target | 24x24 CSS px |
| Preferred mobile target | 44x44 CSS px |

Avoid:

- cards inside cards;
- marketing hero sections before the actual service;
- blurred abstract backgrounds;
- low-contrast light grey text;
- floating decorative sections.

## Core Screen Patterns

### Public Mobile Home

Structure:

1. Civic service header.
2. Location and language strip.
3. Search box with one primary action.
4. Quick chips: child, adult, facility, today, nearby.
5. Service cards: available today, children sections, facilities nearby.
6. Bottom navigation.

### Search Results

Structure:

1. Sticky compact search summary.
2. Map/list segmented control.
3. Filter chips.
4. Result cards with status and next action.
5. Bottom sheet when map mode is active.

### Booking / Checkout

Structure:

1. Booking summary.
2. Cancellation policy.
3. Payment method.
4. Total.
5. Final CTA.
6. Live status region for processing and errors.

Never show final confirmation until backend and payment state allow it.

### Partner Portal

The coach/facility portals should feel like Israeli government operational tools:

- practical dashboard metrics;
- direct action lists;
- plain tables;
- clear empty states;
- checklist-based onboarding;
- sync health and conflicts as service readiness, not technical debug UI.

## Component Direction

| Component | Civic Pattern |
|---|---|
| `ServiceHeader` | gov-style utility header with language/profile/location. |
| `SearchBox` | Large, practical, labeled search form. |
| `FilterChip` | Moderate radius, visible selected state, keyboard accessible. |
| `ResultCard` | Dense summary with one CTA. |
| `AvailabilityBadge` | Text-first status label with icon and color. |
| `SlotButton` | Time as primary content, status secondary. |
| `CheckoutPanel` | Summary-list style, no decorative payment card. |
| `Notice` | Info/warning/error callout, text-first. |
| `Stepper` | For partner onboarding and checkout stages. |
| `DataTable` | Admin/portal dense table with filters and clear status chips. |
| `BottomNav` | Mobile user app only; portals can use sidebar/rail on larger screens. |

## Copy Tone

Tone:

- direct;
- reassuring;
- plain;
- status-oriented;
- no hype.

The writing model is service-first: users should understand the next action, complete it independently, and feel confident that booking/payment status is reliable.

Preferred Russian labels:

| State | Label |
|---|---|
| Bookable | `Можно записаться` |
| Payment enabled | `Записаться и оплатить` |
| Request only | `Отправить заявку` |
| Info only | `Только информация` |
| Low confidence | `Уточнить наличие` |
| Conflict | `Временно недоступно` |
| Hold | `Место удерживается` |
| Payment processing | `Платеж обрабатывается` |
| Confirmed | `Запись подтверждена` |

Preferred Hebrew labels should be finalized with a native speaker before launch.

## Accessibility Rules

- WCAG 2.2 AA minimum.
- Every form input has a visible label or equivalent programmatic label.
- Every status update in booking/payment has `aria-live="polite"` or equivalent.
- Focus must be contained in modals and bottom sheets.
- Slot picker must be keyboard reachable.
- Map must have list alternative.
- Do not rely on map markers as the only way to select a facility.

## Implementation Implications

When the app is scaffolded:

- create CSS variables in `packages/ui` or `apps/web`;
- include RTL-ready layout utilities;
- create `StatusBadge`, `Notice`, `Button`, `FormField`, `SummaryList`, and `SegmentedControl` first;
- keep map and calendar SDKs out of first-load bundle;
- add visual QA snapshots for mobile widths 360, 390, 430 and desktop 1280.
