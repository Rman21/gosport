# SportIL Architecture Organization

Last updated: 2026-06-18 14:25 IDT

This document organizes the system before implementation. It turns the master spec into boundaries, invariants, and repo structure.

## Target Stack From Master Spec

- Web/PWA: Next.js + TypeScript.
- API: NestJS + TypeScript.
- DB: PostgreSQL + PostGIS.
- ORM: Prisma.
- Queue: Redis + BullMQ.
- Storage: S3-compatible.
- Maps: Google Maps or Mapbox through adapter.
- Payments: provider adapter, mock provider first.
- Notifications: adapter, mock provider first.
- Deployment: Docker.

Current npm registry snapshot checked on 2026-06-18:

- Next.js: `16.2.9`
- React: `19.2.7`
- NestJS core: `11.1.27`
- Prisma: `7.8.0`
- TypeScript: `6.0.3`

## Proposed Monorepo Layout

```text
/apps
  /web
  /api
/packages
  /db
  /types
  /ui
  /payments
  /notifications
  /integrations
  /config
/docs
  /architecture
  /codex
  /decisions
  /implementation-readiness
  /progress
  /research
```

## Domain Boundaries

| Domain | Owns | Must Not Own |
|---|---|---|
| Identity/RBAC | users, roles, sessions, memberships, guards | booking state, payment state |
| Catalog | sports, facilities, spaces, coaches, programs, public search | payments, sync write-back |
| Availability | availability rules, slots, busy blocks, confidence | card tokens, payouts |
| Booking | holds, reservations, confirmations, cancellations, waitlist | provider-specific payment logic |
| Payments | provider adapter, setup sessions, payment methods, transactions, refunds | booking slot selection, connector mapping |
| SportSync Hub | connectors, imports, mappings, sync health, conflicts | direct user checkout logic |
| Notifications | reminders, confirmations, status messages | domain truth |
| Admin | moderation, approval, audit review, analytics | bypassing domain invariants |
| UI | reusable components, route shells, forms, state display | business rules that belong in API |

## Non-Negotiable Invariants

1. No raw card data is stored or logged.
2. Unverified or low-confidence slots cannot enter instant booking/payment mode.
3. Double booking is prevented at service and database levels.
4. Payment provider logic is isolated behind adapters.
5. Connector-specific logic is isolated in SportSync Hub.
6. Critical actions are audit logged.
7. Parent payments cover child profiles; child profiles do not manage cards.
8. City analytics are aggregated and do not expose private user/payment data.

## Database Architecture Notes

Use Prisma for normal application modeling, but expect raw SQL migrations for:

- PostGIS extension and spatial indexes;
- exclusion constraint or equivalent conflict-prevention constraint for overlapping bookings/holds;
- partial indexes for active slots/bookings;
- idempotency unique constraints for webhooks and external events;
- audit log append-only patterns.

Critical DB checks before implementation:

- exact overlap prevention strategy for `space_id` and time ranges;
- whether holds and confirmed bookings share one conflict table or separate constraints;
- status enum design for booking/payment/sync state machines;
- indexes for `city`, `neighborhood`, `sport_id`, `start_at`, `status`, `verification_status`, and geography;
- redaction strategy for provider and connector payloads.

## API Architecture Notes

Use REST first for clarity.

Critical API groups:

- `/auth`
- `/catalog`
- `/slots`
- `/bookings`
- `/payments`
- `/coach`
- `/facility`
- `/integrations`
- `/admin`

Every mutation must define:

- auth and role;
- idempotency behavior;
- audit log event;
- domain event or notification;
- failure state;
- test coverage.

## UI Architecture Notes

Design direction is fixed in `docs/design/ISRAELI_CIVIC_SERVICE_UI_DIRECTION.md`.

Reusable UI package should expose components without business logic:

- `SportCard`
- `FacilityCard`
- `CoachCard`
- `ProgramCard`
- `AvailabilityBadge`
- `SlotPicker`
- `BookingSummary`
- `PaymentMethodCard`
- `CheckoutPanel`
- `FamilyMemberSelector`
- `ConnectWizard`
- `ImportPreview`
- `MappingTable`
- `SyncHealthBadge`
- `ConflictAlert`
- `DashboardMetricCard`
- `CalendarGrid`
- `AuditLogTable`

Text must be localization-ready for Russian, Hebrew, and English. UI must support RTL.

The first UI implementation must start from the civic-service token contract in `docs/design/UI_TOKEN_AND_COMPONENT_CONTRACT.md`, not from ad hoc Tailwind colors or generic template defaults.

The app shell must make locale and direction explicit. Hebrew is the production-default civic baseline, while Russian and English are supported locales that must fit the same components without overflow.

## First Vertical Slice

Before broad feature work, implement a narrow proof slice:

1. Seed Netanya sports/facilities/spaces/coaches/programs/slots.
2. Public mobile catalog and search.
3. Facility/program detail with availability label.
4. Slot hold/reserve endpoint.
5. Mock add-card and mock payment flow.
6. Confirm booking only after mock payment success.
7. Prevent second booking of same slot.
8. Audit log written for reserve, payment, confirm.
9. Mobile E2E happy path plus double-booking test.

## Architecture Review Gates

Before coding each epic:

- Architect agent reviews boundaries.
- Database reviewer reviews schema and constraints.
- Security reviewer reviews auth/payment/privacy.
- Frontend reviewer reviews mobile UX and accessibility.
- E2E runner reviews journey coverage.
