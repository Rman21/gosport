# ADR-0007: Payment Adapter And Mock Provider

Date: 2026-06-18

Status: Accepted

## Context

The master spec calls for safe payments, but the current project is still pre-provider. Epic 0 needs a realistic booking/payment vertical slice without collecting real card data, implying PCI scope, or pretending a demo is production.

Future providers may include Israeli card acquirers, wallets, invoices, resident-card discounts, or municipal payment rails. The application needs a provider-neutral payment boundary now.

## Decision

SportIL will introduce a payment adapter boundary in `packages/payments` before real provider integration. The adapter contract will expose:

- create payment intent for a booking hold;
- confirm payment intent;
- receive and verify webhook/event payload;
- refund or void payment;
- map provider state to SportIL payment state;
- expose redacted, audit-safe payment references.

The Epic 0 mock provider may return deterministic mock intent IDs, mock token IDs, and success/failure states, but it must never accept real card fields. The web UI must use a saved fake method label such as `Mock Visa 4242`, and all copy must indicate that this is a mock payment.

Bookings move to `confirmed` only after a successful provider event or mock confirmation has been matched to the booking hold with an idempotency key. Webhooks and client confirmations must be idempotent.

## Alternatives Considered

### Inline mock payment logic in the page

- Pros: fastest prototype.
- Cons: impossible to reuse when API and DB arrive; encourages unsafe payment state in UI.
- Why not: even mock payment should model the production boundary.

### Choose a real payment provider immediately

- Pros: clearer integration target.
- Cons: provider choice depends on legal, merchant, invoice, tax, and municipal payment requirements.
- Why not: the architecture can stay provider-neutral until procurement and compliance constraints are known.

### Collect card-like demo fields

- Pros: visually familiar checkout.
- Cons: trains unsafe behavior and creates ambiguity about PCI scope.
- Why not: Epic 0 should never ask for real card data.

## Consequences

### Positive

- The first vertical slice can demonstrate the booking state machine safely.
- Provider replacement is isolated from booking UI and domain logic.
- Audit logs can store redacted payment references from day one.

### Negative

- Mock success may look less realistic than a full card form.
- Adapter tests must be written before real provider onboarding.

### Risks

- Risk: users confuse mock payment with production readiness.
  - Mitigation: label mock payment clearly and keep it out of production mode.
- Risk: payment and booking states diverge after retry.
  - Mitigation: enforce idempotency keys and webhook/event deduplication.
