# ADR-0003: Localization And RTL Strategy

Date: 2026-06-18

Status: Accepted

## Context

SportIL starts in Netanya and must feel organic in Israeli civic-service contexts. Hebrew and RTL behavior cannot be added at the end because layout, icons, date/time, addresses, payments, and form validation all change when direction changes. The master spec and current working language also require Russian and English support.

## Decision

SportIL will use explicit locale and direction at the app shell. Hebrew is the production-default civic baseline, while Russian and English are supported LTR locales. UI copy must go through typed dictionaries from the first scaffold, and layout must use logical CSS properties so components work in both RTL and LTR.

For Epic 0, Next.js routes should use a locale segment and a small internal dictionary layer. A larger translation-management system can be added only after content volume justifies it.

## Alternatives Considered

### Hebrew-only MVP

- Pros: faster public launch for the primary civic market.
- Cons: excludes a meaningful Netanya audience and conflicts with the master spec.
- Why not: Russian and English must be first-class enough to test component fit and service clarity.

### LTR-first MVP with later RTL

- Pros: easier for developers working from Russian/English specs.
- Cons: RTL retrofits cause layout bugs, icon issues, test gaps, and copy overflow.
- Why not: Hebrew/RTL is part of the product identity, not a localization afterthought.

### Full i18n platform immediately

- Pros: scalable content workflows.
- Cons: adds implementation overhead before the first vertical slice is proven.
- Why not: typed dictionaries are enough for Epic 0 and keep the scaffold lean.

## Consequences

### Positive

- RTL and LTR bugs are visible from the start.
- Components remain reusable across public app, partner portal, and admin.
- Copy can be reviewed independently from component code.

### Negative

- Every component needs locale and direction awareness.
- Tests must cover mixed text, times, prices, phone numbers, and addresses.

### Risks

- Risk: Hebrew microcopy may sound unnatural.
  - Mitigation: native Hebrew review before launch.
- Risk: generated UI drifts into physical CSS properties.
  - Mitigation: require logical CSS in component review and browser QA.
