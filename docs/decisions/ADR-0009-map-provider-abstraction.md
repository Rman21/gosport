# ADR-0009: Map Provider Abstraction

Date: 2026-06-18

Status: Accepted

## Context

SportIL needs location-aware discovery for sport facilities across Netanya. The current Epic 0 shell disables map mode until a provider decision is made. A map is useful, but it must not become the only way to discover facilities, and it should not force a heavy client bundle onto users who only need a list.

Possible providers include Google Maps, Mapbox, OpenStreetMap-based libraries, or municipal GIS links. Provider choice depends on cost, Hebrew/RTL address quality, accessibility, licensing, and production privacy requirements.

## Decision

SportIL will define a map provider interface before integrating a specific provider:

- render a map for a bounded list of facilities;
- render markers with accessible list equivalents;
- open external navigation links;
- geocode or normalize addresses only through server-side/provider-safe APIs;
- expose provider attribution and error states;
- support lazy loading so list search remains fast.

The product default remains list-first. Map mode may be enabled only after a provider adapter is accepted, attribution is correct, keyboard/screen-reader paths exist, and mobile performance is verified.

Epic 0 can store coordinates when an official page exposes them, but it will not render an interactive map yet.

## Alternatives Considered

### Google Maps immediately

- Pros: strong local POI and navigation ecosystem.
- Cons: cost, privacy, bundle weight, and provider lock-in before requirements are set.
- Why not: the current product can progress with list-first location UX while preserving adapter flexibility.

### OpenStreetMap-only immediately

- Pros: open data and flexible rendering.
- Cons: Hebrew address quality and operational hosting choices need validation.
- Why not: provider choice should be based on UX and operational tests, not ideology.

### No map support

- Pros: simpler and accessible by default.
- Cons: weak for nearby-facility comparison and mobility planning.
- Why not: location matters for sport booking, especially for families and accessible routes.

## Consequences

### Positive

- Search remains usable before and after map integration.
- Provider swap remains possible.
- Accessibility is designed as a peer path, not a patch.

### Negative

- Map UI arrives later than the list/search UX.
- Provider-specific features need adapter decisions before use.

### Risks

- Risk: users rely on a map marker with stale or imprecise coordinates.
  - Mitigation: show textual address, source date, and external navigation separately.
- Risk: map bundle harms mobile performance.
  - Mitigation: lazy-load map code only when users enter map mode and verify Core Web Vitals.
