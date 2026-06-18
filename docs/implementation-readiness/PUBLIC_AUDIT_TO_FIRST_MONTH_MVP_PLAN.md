# Public Audit To First-Month MVP Plan

Last updated: 2026-06-18 23:34 IDT

Source input: public-interface audit supplied on 2026-06-18 after reviewing the deployed `/ru`, `/he`, and `/en` site.

## Current State

SportIL is already beyond a landing page. The public prototype has multilingual search, filters, facility cards, source-backed data, maps, facility detail pages, demo booking hold/confirm flow, status labels, generated facility imagery, and a basic verification queue.

The product state is still `demo/catalog MVP`, not `transactional MVP`.

## What Exists

- Multilingual shell for Hebrew, Russian, and English.
- Search by sport, age, intent, date, and online availability.
- Facility detail pages with spaces, programs, coaches, open matches, map, schedule, and source links.
- Seed catalog for Netanya sport places, schools, and public sport areas.
- Prisma schema, PostgreSQL overlap migration, seed path, NestJS hold/confirm API, and mock payment adapter foundation.
- Public verification/provenance labels and verification tasks.
- Brand assets, favicon, and installable PWA icon foundation.

## Critical Gaps

- Public UI still leaks some admin/demo concepts: numeric confidence, raw status semantics, and a few non-localized time values.
- External-registration partners can look internally bookable if status labels are not separated from booking method.
- Public free facilities can show fake `remaining seats` even when capacity is not actually tracked.
- Gali-Yam has two offerings at the same time on the same physical court; the DB plan prevents this, but the public UI must not imply both are independently bookable.
- `My Bookings`, `Saved`, and `Profile` are still placeholders.
- `Report wrong info`, `Claim facility`, and `Request online booking` are not real submission forms yet.
- Find Partner is still a filtered search shortcut, not a dedicated Open Match flow.
- Admin verification is still demo data, not a persistent workflow.

## P0 Implementation Order

1. Public trust and status cleanup.
   - Replace numeric confidence in public UI with trust labels.
   - Keep confidence score only for admin/debug surfaces.
   - Separate `bookable_internal`, `external_registration`, `contact_only`, `info_only`, and `needs_verification` behavior in public labels.
   - Remove mixed-language time fragments from Russian and English UI.

2. Public facility capacity cleanup.
   - Do not show fake seats for public free facilities.
   - Use labels such as `Open to public`, `Free access`, and `Occupancy is not tracked`.
   - Keep seats/courts only for controlled inventory.

3. Space-level conflict presentation.
   - Use one physical `space_id` as the conflict boundary.
   - Show conflicting offerings as alternatives, not as two independently bookable inventory units.
   - Ensure the API/DB path remains the source of truth for real overlap prevention.

4. Real user actions.
   - Build forms for availability request, report wrong info, claim facility, and request online booking.
   - Persist submissions as `VerificationRequest`.
   - Show success/error states.

5. Mini-account surfaces.
   - Profile: contact info, preferred language, family members, child profile.
   - My Bookings: pending, held, confirmed, cancelled, request-only records.
   - Saved: save/unsave facilities, coaches, programs.

6. Payment and booking foundation.
   - Payment requires active hold.
   - Confirmation is webhook/mock-webhook driven, not frontend redirect driven.
   - Failed/expired payment releases the hold.
   - No raw card/PAN/CVV storage.

7. Admin verification queue.
   - Show incoming reports, claims, requested facilities, and records needing verification.
   - Allow status transitions for contact-only, external registration, internally bookable, info-only, and needs verification.

## P1 Implementation Order

- CSV import for facilities, spaces, offerings, slots, coaches, and programs.
- ICS read-only busy-block import.
- Google Calendar basic read-only connector when credentials are available.
- Partner onboarding light: connect calendar, upload CSV, add manually, request help.
- Find Partner MVP for tennis/padel with sport, day/time, area, level, and no open chat.
- Email confirmation for requests and bookings.
- Analytics events for search, filter, view facility, start booking, hold, confirmation, request sent.

## Do Not Build In Month One

- Native mobile app.
- Split payments and payouts.
- Full subscription/membership engine.
- Complex ratings.
- Full WhatsApp automation.
- AI recommendations.
- Municipal enterprise dashboard v2.
- Integrations with every CRM.

## First-Month Acceptance Criteria

- User can search, open a facility, request availability, report wrong information, and claim a facility.
- User can create a booking hold and complete mock payment.
- One physical space cannot be confirmed twice for overlapping time.
- My Bookings shows pending, held, confirmed, cancelled, and requested items.
- Saved and Profile are no longer empty placeholders.
- Admin can see and process verification requests.
- Public UI has no mixed-language time fragments in Russian or English.
- Public free facilities do not show fake seats.
- 150+ catalog records can be imported.
- 60+ records can be marked verified/contact-only/bookable.
- Build, lint, and tests pass.

## Immediate Next Sprint

This sprint starts with the public Week 1 fixes:

1. trust-label cleanup;
2. public capacity cleanup;
3. conflict-aware Gali-Yam UI;
4. localized time and duration formatting;
5. clear plan for request/profile/bookings/forms implementation.
