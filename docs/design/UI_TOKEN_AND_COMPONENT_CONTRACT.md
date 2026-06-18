# UI Token And Component Contract

Last updated: 2026-06-18 14:25 IDT

This is the implementation contract for the first SportIL UI layer. It exists before code so agents do not invent incompatible styles.

## Token Categories

```text
color
typography
spacing
radius
shadow
focus
motion
layout
z-index
status
```

## Base CSS Contract

The first implementation should expose these CSS variables:

```css
:root {
  color-scheme: light;

  --font-sans: "Rubik", "Noto Sans Hebrew", "Noto Sans", system-ui, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;

  --radius-1: 4px;
  --radius-2: 6px;
  --radius-3: 8px;

  --shadow-focus: 0 0 0 3px rgba(0, 94, 184, 0.28);
  --shadow-panel: 0 1px 2px rgba(20, 32, 51, 0.08);

  --motion-fast: 120ms;
  --motion-base: 180ms;
}
```

Typography rules:

- use Rubik as the default UI font;
- preserve fallback support for Hebrew, Russian, English, numbers, phone numbers, prices, and addresses;
- use `font-variant-numeric: tabular-nums` for prices, times, counters, and tables;
- keep letter spacing at `0`.

## Component Priority

Build in this order:

1. `Button`
2. `IconButton`
3. `FormField`
4. `Notice`
5. `StatusBadge`
6. `SegmentedControl`
7. `SummaryList`
8. `ServiceHeader`
9. `BottomNav`
10. `SearchBox`
11. `ResultCard`
12. `SlotPicker`
13. `CheckoutPanel`
14. `Stepper`
15. `DataTable`

## Button Contract

Variants:

- `primary`
- `secondary`
- `tertiary`
- `danger`

Rules:

- minimum height: 44px on mobile;
- icon-only buttons require accessible labels;
- primary button appears once per decision area;
- disabled state must explain why when domain-specific.

## StatusBadge Contract

Status badges are text-first.

| Semantic | Color | Example |
|---|---|---|
| Success | green | `Можно записаться` |
| Info | blue | `Только информация` |
| Warning | amber | `Нужно подтверждение` |
| Danger | red | `Временно недоступно` |
| Neutral | grey | `Нет онлайн-записи` |

Every badge must include:

- visible text;
- optional icon;
- `aria-label` only if visible text is not enough.

## Form Contract

Forms follow civic-service patterns:

- visible label;
- optional helper text;
- validation message below the control;
- error summary at top for multi-field forms;
- no placeholder-only labels;
- no hidden required fields without clear explanation.

## Mobile Navigation Contract

User app:

- bottom navigation with 4-5 items max;
- active item has text and icon;
- all tap targets 44px preferred.
- default items for the first slice: search, bookings, saved, profile.

Partner/admin portals:

- compact top header on mobile;
- side rail/sidebar on tablet and desktop;
- no bottom nav for dense portal tasks unless usability testing proves it.

## RTL Contract

- All layout primitives must use logical CSS properties where possible: `margin-inline`, `padding-inline`, `inset-inline`, `border-inline`.
- Icons that imply direction must mirror in RTL.
- Numbers, times, prices, and mixed Hebrew/Russian/English text must be tested.
- The default implementation should make `dir` explicit at the app shell.

## Motion Contract

Allowed motion:

- bottom sheet open/close;
- segmented control transition;
- status change fade;
- route continuity when supported;
- skeleton to content transition.

Not allowed:

- decorative background motion;
- animation that delays CTA availability;
- motion-only status feedback.
