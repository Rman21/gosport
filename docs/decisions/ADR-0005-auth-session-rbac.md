# ADR-0005: Auth Session And RBAC Strategy

Date: 2026-06-18

Status: Accepted

## Context

SportIL will eventually handle resident profiles, family members, bookings, payment tokens, operator workflows, school or coach approvals, admin content, and SportSync connector accounts. The first safe vertical slice is a mock booking/payment flow, but it must not create an architecture that later stores credentials in client state or trusts client-side role checks.

The product also needs Hebrew-first, Russian and English UX, parent/child booking relationships, and auditability for municipal-style service operations.

## Decision

SportIL will use server-side sessions with secure `HttpOnly` cookies and opaque session identifiers. Session records will live server-side and reference a user identity plus active organization or family context.

RBAC will be enforced on the API/server boundary, not in the browser. The shared role model is:

- `resident`: search, save, request, book, pay, manage own/family bookings;
- `guardian`: manage minor family members and consent-sensitive bookings;
- `coach`: view assigned programs, confirm attendance or capacity, answer requests;
- `school_operator`: manage school/group schedules and capacity for assigned venues;
- `facility_operator`: manage spaces, availability, blackout windows, and check-ins;
- `city_admin`: review catalog quality, source confidence, and public content;
- `system`: background sync, payment webhook, and notification service actor.

Client UI may hide unavailable actions, but every mutation must re-check identity, role, ownership, and resource scope server-side. Booking and payment actions must also bind the session user to an idempotency key and audit event.

Epic 0 may keep the web slice unauthenticated, but any mock booking/payment action must be presented as a local prototype and must not collect real payment data.

## Alternatives Considered

### Stateless JWT-only browser auth

- Pros: easy API scaling and simple mobile token storage.
- Cons: harder revocation, easy to over-trust client claims, risky for family/guardian scope changes.
- Why not: SportIL needs revocable sessions and server-side policy checks for sensitive booking/payment operations.

### Third-party hosted auth from day one

- Pros: faster login, MFA, and account recovery.
- Cons: premature provider lock-in before resident identity and municipal service requirements are final.
- Why not: the architecture should define the session and RBAC contract first; provider adapters can be added later.

### Client-only role gating for MVP

- Pros: fast.
- Cons: unsafe once any real booking, payment, or operator action exists.
- Why not: hiding buttons is not authorization.

## Consequences

### Positive

- Sessions can be revoked after device loss, support staff action, or risk events.
- RBAC remains consistent across web, API, SportSync, payment webhooks, and admin flows.
- Parent/child and operator scopes can be modeled without leaking permissions into UI code.

### Negative

- Requires server storage and session lifecycle work.
- E2E tests must include role-specific mutation attempts, not only UI visibility.

### Risks

- Risk: role names drift between frontend copy and backend policy.
  - Mitigation: keep role enums in `packages/types` and map to localized labels at the UI edge.
- Risk: mock flows accidentally look like production auth.
  - Mitigation: Epic 0 booking/payment UI must label the flow as mock and avoid real identity or card collection.
