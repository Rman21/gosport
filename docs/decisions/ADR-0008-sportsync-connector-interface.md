# ADR-0008: SportSync Connector Interface

Date: 2026-06-18

Status: Accepted

## Context

SportIL needs to aggregate municipal sport facilities, school centers, classes, coaches, clubs, public schedules, and later live booking systems. Public pages can confirm that a facility exists, which sports it supports, and sometimes opening hours or class times. They do not guarantee real-time free seats.

The app needs a connector layer that can ingest, normalize, score, and reconcile availability without treating every source as equally authoritative.

## Decision

SportIL will implement SportSync as a provider adapter layer in `packages/integrations`, with normalized domain objects:

- `ExternalFacility`;
- `ExternalSpace`;
- `ExternalProgram`;
- `ExternalCoach`;
- `ExternalSlot`;
- `ExternalAvailabilitySnapshot`;
- `ExternalBookingRef`;
- `ExternalPaymentRef`.

Each imported record must include:

- `source_id` and `source_url`;
- `source_observed_at`;
- `source_confidence`: `official_info`, `operator_confirmed`, `live_inventory`, or `manual_review`;
- `sync_status`: `fresh`, `stale`, `conflicting`, or `blocked`;
- raw payload storage with redaction for secrets and payment data.

Only `operator_confirmed` or `live_inventory` records may create instant payment holds. `official_info` records may power search, detail pages, requests, and call-to-confirm flows, but must not imply live availability.

## Alternatives Considered

### Scrape public pages directly into UI data

- Pros: quick catalog expansion.
- Cons: no provenance, no freshness, hard to reconcile changes.
- Why not: public data needs confidence and review metadata before becoming bookable inventory.

### Treat SportSync as one monolithic connector

- Pros: simple first implementation.
- Cons: provider-specific quirks leak into domain logic.
- Why not: municipal pages, coach systems, payment systems, and future APIs have different trust and conflict models.

### Manual admin-only catalog

- Pros: maximum editorial control.
- Cons: slow, stale, and disconnected from live availability.
- Why not: SportIL needs a path toward live booking, not only static listings.

## Consequences

### Positive

- The UI can honestly separate public information, requestable items, and instantly bookable inventory.
- Connector errors become visible through confidence and sync status rather than hidden failures.
- Future Netanya, school, club, or provider integrations share one mapping contract.

### Negative

- More metadata is required per source.
- Search ranking must account for freshness and confidence.

### Risks

- Risk: low-confidence slots get promoted as bookable.
  - Mitigation: booking APIs must reject non-bookable confidence states.
- Risk: connector payloads contain personal or payment data.
  - Mitigation: raw payload storage must redact secrets and sensitive fields before persistence.
