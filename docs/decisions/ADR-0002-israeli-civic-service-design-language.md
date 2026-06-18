# ADR-0002: Israeli Civic Service Design Language

Date: 2026-06-18

Status: Accepted

## Context

Sport Netanya MVP needs to earn trust across users, parents, coaches, facilities, and municipal stakeholders. A generic startup marketplace style would not match the product's civic role, payment trust requirements, parent/child flows, or eventual municipal expansion.

The user explicitly requested a high-quality UI/UX style that feels organic for Israeli government services.

## Decision

SportIL will use an Israeli civic-service design direction inspired by gov.il and the Israeli Government Design System:

- clean public-service layout;
- Hebrew/RTL-first readiness;
- restrained civic blue palette;
- accessible forms and status messaging;
- practical service flows instead of marketing-heavy screens;
- component and token governance from the beginning.

The product will not copy gov.il branding or imply official government affiliation unless a partnership exists.

## Alternatives Considered

### Generic sports marketplace UI

- Pros: familiar for consumer apps; visually energetic.
- Cons: weaker trust for payments and municipality-facing workflows; can feel commercial rather than civic.
- Why not: SportIL's long-term goal is a municipal/national sports platform, not only a marketplace.

### Premium SaaS dashboard style

- Pros: good for admin and partner portals.
- Cons: too dense and cold for parents and casual users.
- Why not: the user app must remain accessible to broad public audiences.

### Exact gov.il clone

- Pros: immediate public-service association.
- Cons: legal/brand risk; SportIL is not currently an official government service; sports marketplace needs its own identity.
- Why not: we need civic familiarity without brand confusion.

## Consequences

### Positive

- Higher trust for booking and payment flows.
- Better fit for Hebrew, RTL, accessibility, and municipal context.
- Clear component governance before implementation.
- Stronger consistency between public app, partner portals, and admin tools.

### Negative

- Less visually flashy than a consumer sports app.
- Requires disciplined copy, spacing, and status design.
- Needs careful distinction from official gov.il branding.

### Risks

- Risk: UI becomes too bureaucratic.
  - Mitigation: keep sports imagery and quick discovery flows where they help users inspect real options.
- Risk: Hebrew labels are awkward.
  - Mitigation: finalize Hebrew microcopy with a native speaker before launch.
- Risk: agents drift into generic generated UI.
  - Mitigation: enforce `docs/design/ISRAELI_CIVIC_SERVICE_UI_DIRECTION.md` and `docs/design/UI_TOKEN_AND_COMPONENT_CONTRACT.md`.

