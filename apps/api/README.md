# SportIL API

NestJS REST API scaffold for SportIL booking flows.

Current implemented routes:

- `POST /api/v1/booking-holds`
- `POST /api/v1/booking-holds/:holdId/confirm`
- `GET /api/v1/booking-slots/:slotId/alternatives`

The booking repository is Prisma-backed and uses PostgreSQL transactions with row locks on `slot_capacities`. Court/space rental overlap is additionally protected by the `booking_occupancies_no_exclusive_overlap` exclusion constraint.
