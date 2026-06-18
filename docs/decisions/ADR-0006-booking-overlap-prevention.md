# ADR-0006: Booking Overlap Prevention

Date: 2026-06-18

Status: Accepted

## Context

SportIL must prevent double-booking for courts, halls, coach sessions, group-class seats, and school programs. The system will ingest availability from municipal pages, operators, and later SportSync connectors. Some inventory is whole-space capacity, while some is seat-based group capacity. Payment confirmation must not create a booking if the slot has expired or capacity has changed.

This invariant cannot live only in React state, API checks, or queue ordering. It must be enforced by the database transaction that creates holds and confirmed bookings.

## Decision

SportIL will model sellable inventory as resource-time occupancy records, with a separate physical-space boundary:

- `space_id`: the physical court, hall, room, field, or combined public space that can be occupied by only one exclusive use at a time;
- `resource_id`: court, hall, program group, coach, or connector-backed space;
- `time_range`: PostgreSQL `tstzrange` or equivalent start/end range;
- `capacity_claimed`: integer seats or `1` for exclusive resources;
- `status`: `held`, `confirmed`, `cancelled`, `expired`, `released`;
- `idempotency_key`: one unique mutation key per user/action/resource/slot.

Exclusive resources use PostgreSQL exclusion constraints on both `resource_id` and, when present, `space_id` plus `time_range` for active statuses (`held`, `confirmed`). The `space_id` constraint is the business invariant for multi-sport facilities: if one physical hall is held for basketball, a futsal or coach-session offering mapped to the same hall cannot be held for the same time. The `resource_id` constraint remains as a compatibility guard while the catalog migrates from `InventoryResource` to `Facility -> Space -> Sport capability -> Offering -> Slot`.

Group resources use transactional capacity checks with row-level locking against a `slot_capacity` or `resource_capacity_window` record.

Holds must have a short TTL. Payment confirmation must run in one transaction that:

1. locks the hold;
2. verifies status, expiry, user ownership, and idempotency;
3. verifies the payment provider event or mock provider success;
4. changes the hold to `confirmed`;
5. writes an audit event.

Prisma may own most models, but range/exclusion constraints and partial indexes will be added through raw SQL migrations in `packages/db`.

## Alternatives Considered

### API-only overlap check before insert

- Pros: simple to write.
- Cons: race-prone under concurrent booking attempts.
- Why not: two requests can both see availability before either insert commits.

### Queue all bookings through one worker

- Pros: serializes writes.
- Cons: brittle, slower UX, still needs DB invariants for retries and direct admin edits.
- Why not: queue ordering is useful but cannot replace constraints.

### Hold inventory only after payment

- Pros: fewer abandoned holds.
- Cons: payment can succeed while the slot disappears.
- Why not: payment and booking confirmation must be linked by a hold or equivalent reservation transaction.

## Consequences

### Positive

- Double-booking prevention is enforced where it matters: at commit time.
- Mock and real payment flows can share the same state machine.
- SportSync imports can participate in the same conflict model.

### Negative

- Requires careful migration design and database-specific tests.
- Group capacity and exclusive resources need separate constraint patterns.

### Risks

- Risk: stale public-source schedules are mistaken for sellable inventory.
  - Mitigation: only high-confidence or operator-confirmed slots can create payment holds.
- Risk: expired holds keep capacity blocked.
  - Mitigation: background expiry plus transaction-time expiry checks before confirmation.
