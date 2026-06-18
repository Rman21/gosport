# ADR-0010: Catalog Verification And Provenance Layer

Date: 2026-06-18

## Status

Accepted

## Context

Netanya sport data comes from multiple source classes: official municipal pages, community center registration systems, private partner sites, sports associations, directories, and manual desk research. These sources have different reliability and actionability. Some are safe to show as live registration candidates, some are free public assets, and some must not be treated as bookable until an operator/API confirms availability.

The product must avoid turning a directory entry into an apparent paid booking path. This is especially important for children programs, adapted/special-needs sport, school halls, public courts, swimming providers, and partner systems that already own registration/payment.

## Decision

SportIL will model catalog trust explicitly with a provenance and verification layer:

- `Organization` groups facilities, offerings, and programs under municipal, community, private club, sports association, swim school, or fitness-box operators.
- `Facility`, `Offering`, and `Program` carry `verificationStatus`, `bookingMethod`, `paymentMethod`, `sourceType`, `confidenceScore`, `sourceNotes`, and `lastVerifiedAt`.
- `DataVerificationTask` stores follow-up work for objects that need phone/WhatsApp/API/operator confirmation before live booking or local payment.
- Public UI shows verification status and booking method using localized civic-service labels.
- Public CTAs route users/operators to a verification workflow: report wrong info, claim facility, request online booking.

## Consequences

- The product can import broader Netanya coverage without overpromising immediate payment.
- `live_bookable` and `instant_payment` become explicit, high-confidence states instead of defaults.
- Free public facilities can be shown as open/mirror information without pretending there is group capacity.
- Partner sites can stay as external-registration flows until SportSync proves slot and payment state.
- Agents have a concrete task queue for data verification before expanding a vertical slice.

## Alternatives Considered

- Single `status` field on `Facility`: rejected because it cannot distinguish source confidence, booking path, payment path, and operational liveness.
- Hide all unverified records: rejected because public discovery still benefits from info-only and contact-only municipal assets.
- Treat partner websites as local bookable inventory immediately: rejected because it creates double-booking and payment reconciliation risk.
