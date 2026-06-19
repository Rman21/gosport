# SportIL Progress Log

This file is mandatory. Every meaningful Codex work block must append a new entry.

## 2026-06-18 13:40 IDT

Objective: create the pre-implementation documentation system for AAA+ June 2026 mobile web/PWA patterns, Codex agent and skill workflows, and architecture organization.

Changed:

- Added root `AGENTS.md` with mandatory progress and architecture-before-code rules.
- Added `docs/README.md`.
- Added `docs/research/AAA_PLUS_MOBILE_WEB_PATTERNS_JUNE_2026.md`.
- Added `docs/architecture/ARCHITECTURE_ORGANIZATION.md`.
- Added `docs/codex/AGENTS_SKILLS_OPERATING_MODEL.md`.
- Added `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.
- Added `docs/decisions/ADR-0001-documentation-and-agent-operating-model.md`.
- Normalized new Codex custom agent TOML files with explicit `name` and `description` metadata.

Research notes:

- Verified current Codex manual via official OpenAI helper on 2026-06-18.
- Used official or primary sources for Core Web Vitals, PWA installability, Next.js, React, WCAG 2.2, Material adaptive layout, Apple HIG, OWASP, PCI DSS, PostgreSQL, PostGIS, and Prisma.

Decisions:

- Documentation and progress logs become part of the repository workflow before code.
- Implementation must be gated by architecture, data invariants, test plan, and agent plan.
- Codex should use read-only agents first, then focused write-capable work.

Open risks:

- Application stack is specified in the master spec but not scaffolded yet.
- Payment provider and map provider remain adapter decisions.
- Need one final architecture review pass before creating the monorepo.

Next action:

- Run a Codex agent planning pass across architecture, frontend, database, security, and E2E readiness.
- Convert the plan into an implementation sequence for Epic 0 and the first vertical slice.

## 2026-06-18 14:00 IDT

Objective: research and fix the SportIL design direction as high-quality Israeli civic-service UI before implementation.

Changed:

- Added `docs/design/ISRAELI_CIVIC_SERVICE_UI_DIRECTION.md`.
- Added `docs/design/UI_TOKEN_AND_COMPONENT_CONTRACT.md`.
- Added `docs/decisions/ADR-0002-israeli-civic-service-design-language.md`.
- Updated `docs/README.md` with the new design folder.
- Updated `docs/architecture/ARCHITECTURE_ORGANIZATION.md` to point implementation at the design contract.
- Updated `docs/implementation-readiness/IMPLEMENTATION_GATE.md` to mark the design direction and token/component contract as complete.

Research notes:

- Used Har HaYeda and gov.il/National Digital Agency pages as primary Israeli public-sector references.
- Used the Israeli Government Design System reference from Har HaYeda as the main local design-system anchor.
- Used Globalbit IGDS case-study content only as non-official supporting context.
- Design direction: civic-service trust, RTL-first readiness, accessibility, restrained civic blue palette, practical service flows, no startup-marketplace gloss.

Decisions:

- SportIL will use an Israeli civic-service design language inspired by gov.il/IGDS patterns without copying official branding or implying government affiliation.
- UI implementation must start from tokens and component contracts before page work.

Open risks:

- Need native Hebrew review of microcopy before launch.
- Need separate ADR for RTL/localization implementation details.
- Need architecture ADRs for monorepo/tooling, auth, booking constraints, payment adapter, SportSync, and map provider.

Next action:

- Use agent outputs to finalize the pre-implementation plan.
- Then create ADRs for the remaining architecture decisions and scaffold the first vertical slice.

## 2026-06-18 14:25 IDT

Objective: lock the Israeli civic-service UI direction and move the project into a controlled Epic 0 scaffold state.

Changed:

- Added `docs/design/ISRAELI_CIVIC_SERVICE_RESEARCH_NOTES.md`.
- Updated `docs/design/ISRAELI_CIVIC_SERVICE_UI_DIRECTION.md` with official source links, service-design principles, accessibility, language guidance, and Rubik as the primary UI font.
- Updated `docs/design/UI_TOKEN_AND_COMPONENT_CONTRACT.md` with Rubik-first typography, numeric rules, and first-slice mobile bottom navigation items.
- Added `docs/decisions/ADR-0003-localization-and-rtl-strategy.md`.
- Added `docs/decisions/ADR-0004-monorepo-tooling-and-package-manager.md`.
- Updated `docs/implementation-readiness/IMPLEMENTATION_GATE.md` to `READY FOR EPIC 0 SCAFFOLD ONLY`.
- Updated `docs/architecture/ARCHITECTURE_ORGANIZATION.md` with the current npm registry snapshot for Next.js, React, NestJS, Prisma, and TypeScript.

Research notes:

- Verified Har HaYeda design-system, language, and service-design pages on 2026-06-18.
- Verified gov.il accessibility pages and Campus IL public digital writing course as civic UX references.
- Used agent research output to record IGDS Design System 3.0 state observed on 2026-06-18.
- Checked npm registry versions on 2026-06-18: Next.js `16.2.9`, React `19.2.7`, NestJS `11.1.27`, Prisma `7.8.0`, TypeScript `6.0.3`.

Decisions:

- SportIL uses Rubik as the default Hebrew-first UI font.
- Hebrew/RTL is the production-default civic baseline; Russian and English remain supported LTR locales.
- The project uses a pnpm monorepo with Next.js web, NestJS API, shared UI/types/db packages, and provider adapter packages.

Open risks:

- Auth/session/RBAC ADR is still missing.
- Booking overlap DB constraint ADR is still missing.
- Payment adapter and mock provider behavior ADR is still missing.
- SportSync connector and map provider ADRs are still missing.
- Backend enum to user-facing status label mapping is still missing.

Next action:

- Scaffold Epic 0 workspace and mobile web shell from the accepted design and tooling contracts.

## 2026-06-18 14:55 IDT

Objective: implement the Epic 0 scaffold and first Israeli civic-service mobile web shell.

Changed:

- Added pnpm workspace scaffold with root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, and lockfile.
- Added `apps/web` as a Next.js 16 App Router application with Hebrew, Russian, and English locale routes.
- Added `packages/ui` with civic-service primitives: `Button`, `LinkButton`, `ServiceHeader`, `SearchBox`, `Notice`, `StatusBadge`, `SegmentedControl`, `SummaryList`, `ResultCard`, and `BottomNav`.
- Added `packages/types` with shared locale, booking mode, status, dictionary, and facility preview types.
- Added placeholder packages for API, DB, payments, notifications, integrations, and shared config.
- Implemented `/`, `/he`, `/ru`, `/en`, secondary mobile-nav pages, and localized facility detail routes.
- Localized facility sport and neighborhood metadata for Hebrew, Russian, and English.
- Made the map/list segmented control honest by disabling map mode until the map provider ADR is accepted.
- Updated `docs/implementation-readiness/IMPLEMENTATION_GATE.md` to record Epic 0 scaffold implementation and browser QA readiness.

Agent/reviewer notes:

- Reviewer agent flagged dead navigation, unlocalized metadata, missing root default route, inactive map control, and duplicate `h1`.
- Fixed those issues in the scaffold: CTA links now navigate to detail routes, bottom nav links are real routes, `/` redirects to `/he`, metadata is localized, map is disabled, and each page has a single `h1`.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm --filter @sportil/web lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on mobile `390x844` for `/ru?q=Теннис`, `/ru/facilities/gali-yam-tennis`, and `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court`.
- Browser QA confirmed the mock hold -> mock payment -> confirmation flow reaches `Запись сохранена` with a visible `SPIL-...` reference.
- Browser QA passed on desktop `1280x900` for `/ru`, `/ru?q=Баскетбол`, and `/he/facilities/yeshurun-basketball`.
- Browser QA confirmed no horizontal overflow, one `h1`, disabled map mode, loaded result images, hidden desktop bottom nav, Hebrew `dir="rtl"`, and zero console errors.
- Browser QA passed on mobile `390x844` and desktop `1280x900` for `/he`, `/ru`, `/en`, facility detail routes, and profile route.
- Browser QA confirmed no horizontal overflow, one `h1`, correct `lang`/`dir`, Rubik font application, mobile-only bottom navigation, disabled map segment, and zero console errors.
- HTTP check confirmed `/` redirects to `/he`.

Open risks:

- Auth/session/RBAC ADR is still missing.
- Booking overlap DB constraint ADR is still missing.
- Payment adapter and mock provider behavior ADR is still missing.
- SportSync connector and map provider ADRs are still missing.
- No automated Playwright test suite exists yet; browser QA was manual automation through the in-app browser.

Next action:

- Create the missing auth, booking, payment, SportSync, map, schema, and verification ADRs.
- Then implement the first real booking/payment-safe vertical slice behind mock providers.

## 2026-06-18 16:05 IDT

Objective: accept the missing architecture decisions, research source-backed Netanya sport facilities, and implement a safer visual booking/payment mock vertical slice.

Changed:

- Added `docs/decisions/ADR-0005-auth-session-rbac.md`.
- Added `docs/decisions/ADR-0006-booking-overlap-prevention.md`.
- Added `docs/decisions/ADR-0007-payment-adapter-and-mock-provider.md`.
- Added `docs/decisions/ADR-0008-sportsync-connector-interface.md`.
- Added `docs/decisions/ADR-0009-map-provider-abstraction.md`.
- Added `docs/research/NETANYA_SPORT_CATALOG_RESEARCH_2026-06-18.md`.
- Expanded `packages/types` with facility images, source confidence, slots, accessibility, capacity, and source metadata.
- Expanded `apps/web/src/demo-data.ts` from 3 placeholder cards to 8 source-backed Netanya facilities/programs with official links, images, age ranges, instructors/schools, hours, capacity, and mock remaining seats.
- Implemented query filtering on `/[locale]`, including the current `/ru?q=Теннис` use case.
- Added visual result cards with official facility imagery, nearest slot, age range, and free-seat indicators.
- Reworked facility detail pages with hero images, source links, accessibility/parking/lighting, age fit, and schedule cards.
- Added `/[locale]/book/[facilityId]` and `apps/web/src/booking-flow.tsx` for a safe mock hold -> mock payment -> confirmation flow.
- Added `*.tsbuildinfo` to `.gitignore`.
- Updated `docs/README.md` and `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.

Research notes:

- Used official Netanya municipal sport facility, sport center, class, special-needs sport, and sports-club pages.
- Catalog data now separates `official_info`, `manual_review`, `operator_confirmed`, and `live_inventory` confidence so public source facts are not confused with real-time availability.
- The first payment-capable slot is explicitly a demo/manual-review slot; it is suitable for testing the mock vertical slice, not production sale.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm --filter @sportil/web lint` passed.
- `corepack pnpm build` passed.

Open risks:

- No backend API or database persistence exists yet.
- Booking overlap is accepted architecturally but not implemented as a PostgreSQL exclusion constraint.
- Payment provider is a UI mock only; `packages/payments` still needs adapter code and tests.
- SportSync source-confidence architecture is accepted, but no connector imports real-time availability.
- Map mode remains intentionally disabled until the provider adapter is implemented.
- Official Netanya images are referenced remotely for prototype visualization; production should confirm rights and optimize/licensed storage.

Next action:

- Implement Prisma schema/migrations for resources, slots, occupancy, holds, bookings, payments, source snapshots, and audit events.
- Add NestJS booking hold/confirm endpoints and a mock payment adapter package.
- Add Playwright E2E tests for search, detail, mock hold/payment confirmation, and source-only non-bookable slots.

## 2026-06-18 17:05 IDT

Objective: implement the Prisma schema, raw SQL overlap constraint, NestJS hold/confirm API, mock payment adapter package, and better native search filters for age/date/booking intent.

Changed:

- Added `@sportil/db` as a real package with Prisma 7 config, `schema.prisma`, and an initial migration.
- Added PostgreSQL `btree_gist` setup and `booking_occupancies_no_exclusive_overlap` GiST exclusion constraint for court/space rentals.
- Added DB checks for positive slot duration, positive capacity, hold/booking occupancy linkage, and non-negative payment amount.
- Modeled facilities, resources, slots, slot capacity rows, holds, bookings, occupancies, payment intents/events, source snapshots, audit events, and user accounts.
- Added `@sportil/payments` with a provider interface and `MockPaymentProvider`; it returns deterministic mock intent/event IDs and redacted method data only.
- Added `@sportil/api` with NestJS modules, DTO validation, booking hold/confirm endpoints, mock payment provider injection, and an in-memory repository that enforces the same rental-vs-class semantics for demo use.
- Added API build script and `tsconfig.build.json`.
- Extended slot data with `inventoryKind`, date, min/max age, and participant notes.
- Reworked search into native server-side filters: query text, activity intent, age range, and date.
- Distinguished court rental from group classes in UI copy and availability labels: courts use court units, classes use seats.
- Fixed mobile overflow in long Russian result cards.
- Updated `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.

Architecture notes:

- Court rental reserves one exclusive inventory unit regardless of participant count.
- Group classes consume `requestedUnits` from class capacity.
- The current API repository is intentionally in-memory so endpoints can be verified without a database; the production boundary is encoded in Prisma schema and SQL migration.
- Prisma repository wiring must use DB transactions and row locking for `slot_capacities` before production use.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/db db:validate` passed.
- `corepack pnpm build` passed for the web app.
- API smoke test passed: `POST /api/v1/booking-holds` returned a held court rental with `requestedUnits: 1` and `participantsCount: 3`.
- API smoke test passed: `POST /api/v1/booking-holds/:holdId/confirm` returned `payment_intent.succeeded` and a clean `SPIL-...` reference.
- Browser QA passed on mobile `390x844` for adult tennis court rental filters and kids group-class date filters.
- Browser QA passed on desktop `1280x900` for the full Russian catalog and Hebrew RTL filtered results.
- Browser QA confirmed no horizontal overflow after the card min-width fix and zero console errors.

Open risks:

- Migrations have been validated syntactically but not applied to a live PostgreSQL database in this workspace.
- The NestJS API still uses an in-memory repository; Prisma transaction repository is the next backend step.
- There are no automated unit/integration/E2E tests yet.
- Auth/session/RBAC is still architectural only and not enforced on the new API routes.
- SportSync is still a source-confidence model, not a live inventory connector.

Next action:

- Run PostgreSQL locally, apply Prisma migration, and seed the Netanya catalog.
- Implement a Prisma-backed `BookingRepository` with interactive transactions and row locks.
- Add Jest/Vitest or Nest testing harness for overlap, capacity, idempotency, and mock payment confirmation.
- Connect the web booking flow to the API in demo mode after auth guard boundaries are agreed.

## 2026-06-18 17:50 IDT

Objective: move the booking/payment slice from in-memory demo behavior to local PostgreSQL with Prisma transactions, row locks, seed data, and nearest-time/day alternatives.

Changed:

- Installed local PostgreSQL 17 through Homebrew and added `scripts/postgres-local.sh` for project-local `.local/postgres-data` startup.
- Added root DB scripts for local start/status/stop, Prisma generate, migration deploy, and seed.
- Added `@prisma/adapter-pg`, `pg`, `tsx`, and generated Prisma Client wiring in `@sportil/db`.
- Added deterministic seed data for 7 facilities, 10 inventory resources, and 16 slots, including nearest alternatives for Gali Yam tennis and Yeshurun basketball.
- Applied the initial overlap migration and a follow-up `participants_count` migration to the live local PostgreSQL database.
- Replaced the NestJS in-memory booking provider with `PrismaBookingRepository`.
- Implemented transactions with `SELECT ... FOR UPDATE` on `booking_holds` and `slot_capacities`.
- Preserved the distinction between court-rental inventory units and planning participant count via `booking_holds.participants_count`.
- Added `GET /api/v1/booking-slots/:slotId/alternatives`.
- Added conflict responses with `alternatives` for unavailable court rentals and group capacity overflow.
- Added JS build outputs/exports for `@sportil/db` and `@sportil/payments` so the built API runs without importing TypeScript source.
- Expanded the web demo catalog with nearest same-court, next-day, same-coach, and same-group slots.
- Added search no-result alternatives and booking-page alternatives in the Russian/Hebrew/English UI.
- Updated `apps/api/README.md` and `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.

Verification:

- `corepack pnpm db:local:start` initialized and started the local project PostgreSQL cluster.
- `corepack pnpm db:migrate` applied both migrations to `postgresql://sportil:sportil@localhost:5432/sportil`.
- `corepack pnpm db:seed` seeded 7 facilities, 10 resources, and 16 slots.
- `psql` confirmed 7 facilities, 16 booking slots, and `booking_occupancies_no_exclusive_overlap` as an exclusion constraint.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm --filter @sportil/db db:validate` passed.
- `corepack pnpm build` passed.
- API smoke passed: alternatives endpoint returns `gali-yam-demo-adult-court-1930` and `gali-yam-demo-adult-court-next-day`.
- API smoke passed: court rental hold returns `requestedUnits: 1` and `participantsCount: 3`.
- API smoke passed: second hold for the same court returns `409 inventory_conflict` with nearest alternatives.
- API smoke passed: confirm hold returns `payment_intent.succeeded` and a clean `SPIL-...` reference.
- API smoke passed: group overflow on Yeshurun girls basketball returns `409 inventory_conflict` with Thursday alternative and 6 available units.
- Browser QA passed on mobile viewport for `/ru?date=2026-06-20&q=Теннис`: no exact results, nearest alternatives visible, no horizontal overflow, zero console errors.
- Browser QA passed on mobile viewport for `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court`: alternatives visible for 19:30 and tomorrow, one `h1`, no horizontal overflow, zero console errors.

Open risks:

- Request-level automated tests are still missing for conflicts, expired holds, idempotency, overlap, alternatives, and payment confirmation.
- Real auth/session/RBAC is still architectural and not enforced on API mutations.
- SportSync is still seeded/source-confidence data rather than live connector ingestion.
- Map provider remains intentionally disabled.
- The local Postgres cluster is running from `.local/postgres-data`; production deployment configuration is not defined yet.

Next action:

- Add API integration tests against a disposable PostgreSQL database.
- Add Playwright E2E coverage for nearest alternatives, hold, conflict, and confirm flows.
- Implement auth/session guard before exposing mutations beyond demo mode.

## 2026-06-18 16:08 IDT

Objective: implement the next architecture/product slice: explicit physical spaces, sport capabilities, offerings, trainer/program/open-match foundations, no duplicate physical facility cards, and cross-offering space overlap protection.

Changed:

- Added `Sport`, `FacilitySpace`, `SpaceSportCapability`, `Offering`, `CoachProfile`, `Program`, `OpenMatch`, `UserFollow`, and `WaitlistEntry` to the Prisma schema.
- Added nullable bridge fields from the existing booking layer to the new model: `inventory_resources.space_id`, `inventory_resources.sport_id`, `inventory_resources.offering_id`, `booking_slots.offering_id`, and `booking_occupancies.space_id`.
- Added raw PostgreSQL exclusion constraint `booking_occupancies_no_space_exclusive_overlap` so exclusive holds on different offerings/resources still conflict when they share the same physical space and time range.
- Updated the Prisma booking repository to map `spaceId` from resource to occupancy and to treat both resource-overlap and space-overlap constraints as inventory conflicts.
- Expanded local seed data to 7 facilities, 8 physical spaces, 11 offerings, 11 resources, and 17 slots.
- Added Gali Yam private coach session on the same physical court/time as court rental specifically to verify cross-offering overlap.
- Removed the duplicate Yeshurun demo facility card by merging amateur hall rental into the existing Yeshurun sports center.
- Expanded shared frontend types with spaces, offerings, coaches, programs, open matches, sport codes, and optional slot `spaceId`/`offeringId`/`sportCode`.
- Reworked the Russian homepage into intent-first UI: quick actions, online-bookable filter, sport chips, per-facility availability lines, and no old KPI strip.
- Added facility detail tabs for overview, schedule, trainers, sections, open games, and info.
- Added civic-service UI styling for quick actions, sport chips, mini-cards, facility tabs, and mobile-safe wrapping.
- Connected `apps/web/src/booking-flow.tsx` to the NestJS hold/confirm API instead of local React-only success state.
- Added local CORS allowlist for `localhost`/`127.0.0.1` web dev ports in the NestJS API.
- Updated ADR-0006 to clarify that physical `space_id` is the business overlap boundary, while `resource_id` remains a compatibility guard.
- Updated `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.

Verification:

- `corepack pnpm --filter @sportil/db db:validate` passed.
- `corepack pnpm db:migrate` applied `20260618193000_space_offering_bridge` to local PostgreSQL.
- `corepack pnpm db:generate` regenerated Prisma Client.
- `corepack pnpm db:seed` passed and reseeded a clean local database after smoke testing.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed for the web app.
- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/db build` passed.
- API smoke passed: first hold on `gali-yam-demo-adult-court` returned `201`.
- API smoke passed: second hold on `gali-yam-private-coach-overlap` returned `409` because both slots share `gali-yam-court-01-space`.
- Browser QA passed on `/ru`: 7 result cards, exactly 1 Yeshurun card, quick actions visible, online filter visible, old average-price/verified-slots KPI text absent.
- Browser QA passed on `/ru/facilities/gali-yam-tennis`: tabs, trainer, section, open game, and safety copy visible.
- Browser QA passed on `/ru/facilities/yeshurun-basketball`: tabs, trainer, sections, and amateur hall request visible in the single Yeshurun facility page.
- Browser QA passed on mobile `390x844`: one-column quick actions/results, no horizontal overflow detected, screenshot non-empty.
- Browser QA passed on `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court` with API running on `4000`: hold created through API, mock payment confirmed through API, and `Запись сохранена` displayed with `SPIL-...` reference.

Open risks:

- Request-level automated tests are still missing for physical-space overlap, idempotency, expired holds, capacity overflow, alternatives, and payment confirmation.
- Auth/session/RBAC is still architectural and not enforced on API mutations.
- SportSync remains seeded/source-confidence data rather than live connector ingestion.
- Map provider remains intentionally disabled behind the accepted abstraction.

Next action:

- Add API integration tests against a disposable PostgreSQL database for space overlap and booking/payment state.
- Add Playwright E2E for intent search, no duplicate facility cards, hold/confirm, and non-bookable official-info slots.

## 2026-06-18 20:50 IDT

Objective: implement the Netanya sports catalog verification/provenance layer, expand researched facility coverage, and add Data Verification workflows before deeper live booking expansion.

Changed:

- Added Prisma enums for `VerificationStatus`, `BookingMethod`, `PaymentMethod`, `SourceType`, organization kinds, and verification task status/priority.
- Added `Organization` and `DataVerificationTask` models.
- Added verification/provenance fields to facilities, programs, and offerings.
- Added raw SQL migration `20260618203000_data_verification_layer` with enum creation, indexes, foreign keys, target checks, and confidence-score checks.
- Expanded seed data to 8 organizations, 16 facilities, 22 spaces, 23 offerings, 23 resources, 29 slots, and 7 verification tasks.
- Imported high-priority research candidates into the local catalog: Top Padel Ir Yamim/Poleg, Collegym, Country Club Poleg, Winter Lake, Sportek Yahalom, Olimp Swimming, CrossFit Green Beach, and Maccabi Netanya Football School.
- Expanded shared sport/types coverage with padel, swimming, skateboarding, roller skating, CrossFit, gymnastics, dance, table tennis, badminton, karate, Krav Maga, and fitness.
- Added feature filters for swimming, free public facilities, skate/roller, kids, adapted sport, today, and online booking.
- Added public facility CTAs for reporting wrong info, claiming a facility, and requesting online booking.
- Added `/[locale]/verification` as a localized Data Verification queue.
- Added `docs/decisions/ADR-0010-catalog-verification-and-provenance-layer.md`.

Research notes:

- Used the user-provided Netanya desk research from 2026-06-18 as the product import baseline.
- Used external official/partner URLs only where source confidence is strong enough for a clickable source.
- Records without proven live inventory remain `request`, `mirror`, `external_registration`, `free_public`, or `needs_verification`; they are not upgraded to local payment.

Verification:

- `corepack pnpm --filter @sportil/db db:validate` passed.
- `corepack pnpm db:migrate` applied the new data verification migration locally.
- `corepack pnpm db:generate` passed.
- `corepack pnpm db:seed` passed.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/db build` passed.
- Browser QA passed on desktop for `/ru?feature=swimming`: Collegym, Country Club Poleg, and Olimp display with one `h1`, no horizontal overflow.
- Browser QA passed on desktop for `/ru?feature=skate_roller`: Winter Lake and Sportek Yahalom display with public/free context and no horizontal overflow.
- Browser QA passed on desktop for `/ru/facilities/top-padel-ir-yamim`: live-bookable verification label, padel slots/open match, and all three public verification CTAs display.
- Browser QA passed on desktop for `/ru/verification?facility=top-padel-ir-yamim&action=online-booking`: selected facility, requested action, and Top Padel sync task display.
- Browser QA passed on mobile `390x844` for `/ru?feature=skate_roller` and `/ru/verification`: one `h1`, mobile bottom nav, no horizontal overflow, 7 verification tasks visible.
- Browser console error log is empty.

Open risks:

- New partner schedules are still mirror/manual-review data; SportSync connectors are not implemented.
- Public facility occupancy remains estimated, not real capacity.
- Private/association records need phone/WhatsApp/operator confirmation before production live booking.
- Data Verification actions are local navigation/workflow screens, not persisted user submissions yet.

Next action:

- Run lint/build/browser QA for the expanded web UI.
- Then implement SportSync import tasks or automated E2E coverage for the verification and booking flows.

## 2026-06-18 21:20 IDT

Objective: update SportIL facility/sport visuals with current local assets suitable for the Israeli civic-service UI direction.

Changed:

- Added deterministic local raster asset generation script at `apps/web/scripts/generate-sportil-assets.py`.
- Generated 10 representative SportIL PNG assets under `apps/web/public/images/sportil/generated/`: tennis, padel, swimming, skate/roller, basketball/futsal, martial arts, adapted sport, functional fitness, football, and community multisport.
- Added `apps/web/public/images/sportil/generated/README.md` documenting that these images are generated representative visuals, not photographs of specific facilities.
- Rewired `apps/web/src/demo-data.ts` image catalog to use local generated assets instead of remote placeholder photos.
- Added localized `generatedImageNotice` copy in Hebrew, Russian, and English.
- Updated facility detail media captions to show the generated-image notice for local SportIL assets.

Verification:

- Visual contact sheet was inspected locally for composition and sport coverage.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru?q=&intent=all&age=all&date=&feature=skate_roller`: both skate/roller images loaded from `/images/sportil/generated/skate-roller-park.png`, natural size 1600x900, one `h1`, no horizontal overflow.
- Browser QA passed on `/ru/facilities/top-padel-ir-yamim`: Next-optimized local padel image loaded successfully, generated-image notice displayed, one `h1`, no horizontal overflow, browser console errors empty.

Open risks:

- These assets are representative generated visuals and must not be treated as verified real facility photos.
- Production-grade real photography still needs a rights-cleared media ingestion workflow, source attribution, and per-facility verification.

Next action:

- Add a media provenance field/model when real facility photos are introduced.
- Continue SportSync import tasks or automated E2E coverage for verification and booking flows.

## 2026-06-18 18:10 IDT

Objective: replace the first generated representative images with more realistic, photorealistic-style SportIL sport/facility visuals.

Changed:

- Replaced the 10 local generated sport/facility images with photorealistic AI-generated scenes: tennis, padel, swimming, skate/roller, basketball/futsal, martial arts, adapted sport, functional fitness, football, and community multisport.
- Converted generated media from large PNG files to 1600x900 progressive JPEG files for better mobile performance.
- Updated `apps/web/src/demo-data.ts` generated image paths from `.png` to `.jpg`.
- Replaced `apps/web/scripts/generate-sportil-assets.py` with a reproducible prompt/seed workflow for the current realistic asset set.
- Updated `apps/web/public/images/sportil/generated/README.md` with provider provenance and production caveats.

Verification:

- Inspected a contact sheet for all 10 realistic images before removing the temporary contact sheet.
- `python3 -m py_compile apps/web/scripts/generate-sportil-assets.py` passed.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru`: all 16 generated card images loaded as `.jpg`, natural size 1600x900, one `h1`, no horizontal overflow.
- Browser QA passed on `/ru?q=&intent=all&age=all&date=&feature=skate_roller`: both skate/roller cards loaded `/images/sportil/generated/skate-roller-park.jpg`, no horizontal overflow.
- Browser QA passed on `/ru/facilities/top-padel-ir-yamim`: Next Image optimized `/images/sportil/generated/padel-courts.jpg`, generated-image notice displayed, no horizontal overflow.
- Browser console error log is empty.

Open risks:

- These are still representative AI-generated images, not verified photographs of the real facilities.
- Production use still needs legal/media review, model/license review, alt text approval, and facility-level media provenance.

Next action:

- Add a formal media provenance model before mixing real photos, partner photos, and generated images.

## 2026-06-18 18:17 IDT

Objective: add a dedicated sport dropdown alongside the existing intent, age, date, feature, and online filters.

Changed:

- Added `sport` to the search filter model and normalization.
- Added sport-aware slot filtering using real `SportCode` values from spaces, slots, coaches, programs, and open matches.
- Added `getAvailableSportOptions(locale)` so the dropdown only lists sports present in the current catalog.
- Added localized `sportFilterLabel` copy in Hebrew, Russian, and English.
- Added a native accessible `<select name="sport">` to the home search form while keeping the existing feature filter.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru?age=kids&intent=group_class`: sport dropdown visible with label `Вид спорта`, 15 options, one `h1`, no horizontal overflow.
- Browser QA passed on `/ru?age=kids&intent=group_class&sport=swimming`: select value is `swimming`, results narrow from 10 to 2 cards, no horizontal overflow.
- Browser QA passed on `/ru?age=kids&intent=group_class&sport=basketball`: select value is `basketball`, results narrow to 1 card.
- Mobile browser QA passed at `390x844`: filter panel becomes one column, sport value remains selected, no horizontal overflow.
- Browser console error log is empty.

Next action:

- Add compact selected-filter chips above results if users need clearer active-filter visibility after choosing sport/date/age together.

## 2026-06-18 18:29 IDT

Objective: tighten the sport dropdown to actual available offerings and simplify the group/intent filter copy.

Changed:

- Added explicit `sportCode` values to every demo slot so sport filtering is based on structured offering data rather than facility-level text.
- Changed the sport dropdown source to matching available slots; broad space/program descriptions no longer add dead sports to the select.
- Normalized unavailable sport URL parameters back to `all`, so stale links like removed sports do not produce a dead selected value.
- Replaced the public intent UI pair `court_rental` / `open_play` with one `space_rental` filter labeled `Аренда помещения` in Russian.
- Preserved old `court_rental` and `open_play` URL compatibility by normalizing both into `space_rental`.
- Added wrapping for result-card meta text after new sport tags exposed a mobile overflow case.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru?q=&sport=capoeira&intent=all&age=all&date=&feature=all`: `capoeira` remains because there is a real capoeira slot, while `dance` and `zumba` are absent from the sport dropdown.
- Browser QA passed on `/ru?sport=dance&intent=all&age=all&feature=all`: stale `dance` normalizes to `all`.
- Browser QA passed on `/ru?intent=space_rental&age=all&feature=all`: sport options narrow to rental/open-play sports only.
- Mobile browser QA passed at `390x844` on `/ru?age=kids&intent=group_class`: one-column filters, no horizontal overflow, and intent labels show `Аренда помещения` without `Аренда корта` or `Свободная игра`.

Next action:

- Add selected-filter chips and possibly a small empty-state hint when a URL parameter is normalized away.

## 2026-06-18 18:43 IDT

Objective: remove the public feature filter, add map-first location support, and add a per-facility availability calendar by sport.

Research:

- Checked Google Maps Platform Embed API docs: iframe embeds are the official path for interactive maps, with `place/view/directions/streetview/search` modes and a production API-key path.
- Checked WAI APG date picker guidance: calendar-like selection should remain keyboard reachable and text-first; SportIL uses a slot calendar rather than a modal date picker because users choose available times, not arbitrary dates.

Changed:

- Removed the visible `feature` / `Особенность` select from the home search form while preserving old URL compatibility internally.
- Kept skateboarding and roller skating as separate `sport` values in the sport dropdown; quick swimming link now uses `sport=swimming` instead of `feature=swimming`.
- Added approximate coordinates to all 16 demo facilities.
- Added provider-safe Google Maps URL/embed helpers.
- Enabled URL-backed `view=list|map` segmented control on the home page.
- Added map mode with numbered markers matched to compact facility cards and Google Maps external links.
- Added a `Карта` tab to facility detail pages with a Google Maps iframe and external Google Maps action.
- Added a per-facility availability calendar grouped by sport and date before the detailed slot cards.
- Added mobile-safe map/calendar styles and clipped root horizontal overflow.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru?view=map&sport=skateboarding`: no feature select/text, skate and roller are available sport options, map tab selected, marker/card counts match, one `h1`, no horizontal overflow, and no console errors.
- Browser QA passed on `/ru/facilities/gali-yam-tennis#schedule`: `Карта` tab exists, Google Maps iframe renders from coordinates, availability calendar has 1 sport group and 6 time actions, one `h1`, no desktop overflow, and no console errors.
- Mobile browser QA passed at `390x844` for `/ru?view=map&sport=roller_skating`: one-column map/list layout, marker/card counts match, and no horizontal overflow.
- Mobile browser QA passed at `390x844` for `/ru/facilities/gali-yam-tennis#schedule`: iframe height is 300px, calendar remains one column, page-level horizontal scroll is clipped.

Next action:

- Replace approximate coordinates with verified provider/source coordinates and formalize a production Google Maps Embed API key path with referrer restrictions.

## 2026-06-18 18:47 IDT

Objective: add a minimal Israeli civic-service sport identity mark to the shared header.

Changed:

- Updated `ServiceHeader` with a decorative blue Star-of-David sport mark that includes a small ball motif.
- Kept the service title, eyebrow, subtitle, and language switch as the accessible identity and navigation surface.
- Added restrained civic-service header styling: a light blue top rule, subtle white-to-blue mark background, and responsive 48px/44px mark sizing.
- Added mobile header alignment so Hebrew RTL and Russian LTR layouts remain readable in narrow viewports.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/he` at `1280x900`: mark visible at 48x48, `lang="he"`, `dir="rtl"`, one `h1`, no horizontal overflow, and no console errors.
- Browser QA passed on `/he` at `390x844`: mark visible at 44x44, one `h1`, no horizontal overflow, and no console errors.
- Browser QA passed on `/ru` at `390x844`: LTR header remains stable, one `h1`, no horizontal overflow, and no console errors.

Next action:

- Continue replacing approximate map/provider data with verified coordinates and production Google Maps key restrictions.

## 2026-06-18 19:00 IDT

Objective: remove payment-forward UI wording and reposition the resident journey around calm booking/reservation language.

Changed:

- Reworked Hebrew, Russian, and English public copy from payment-first language to booking/reservation language.
- Changed Russian primary CTAs and navigation to `Забронировать`, `Брони`, `Сводка брони`, `Бронь сохранена`, `Способ бронирования`, and `Безопасное подтверждение брони`.
- Removed visible demo-card/payment wording from the booking flow; the held state now shows a booking confirmation path instead of `Visa 4242` or a provider intent id.
- Replaced credit-card icons on result and slot cards with neutral booking/confirmation icons.
- Updated catalog notes and verification task copy that mentioned local payment so they now refer to local online booking or confirmation.
- Updated profile/bookings placeholder copy to avoid payment-method framing.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Source search over `apps/web/src` and `apps/web/app` found no remaining Russian payment/card wording, no `CreditCard`, and no `Visa`.
- Browser QA passed on `/ru/facilities/gali-yam-tennis`: booking language visible, one `h1`, no real horizontal overflow, and no console errors.
- Browser QA passed on `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court`: no payment/card wording, booking summary and reservation confirmation copy visible, one `h1`, no horizontal overflow, and no console errors.
- Browser QA passed on `/ru`, `/ru/bookings`, and `/ru/verification?facility=gali-yam-tennis&action=online-booking`: no payment/card wording, booking language visible, one `h1`, no horizontal overflow, and no console errors.

Open risks:

- The held-state API interaction could not be completed in browser QA because the local API was not running; the pre-hold UI and source text were verified.
- Technical `payment` identifiers remain in API/types/data-mode code because they are architecture terms for the mock provider and were not visible to residents.

Next action:

- Start the local API before the next booking-flow QA pass and verify the post-hold and confirmed states end to end with the new booking language.

## 2026-06-18 19:13 IDT

Objective: polish Russian public copy into clear municipal-service language for residents.

Changed:

- Reworked the Russian home, filters, facility, map, booking, verification, and placeholder copy toward plain civic wording.
- Replaced internal confidence/source wording with resident-facing labels such as `Степень проверки`, `Официальная страница`, `Что важно проверить`, and `Нужно уточнить`.
- Removed visible technical framing from secondary pages: no `Epic`, `ADR`, internal milestones, or implementation language in bookings/profile/saved placeholders.
- Smoothed catalog notes for facilities, public sport parks, sections, coaches, and verification tasks so they describe practical resident decisions: age, availability, confirmation, official pages, and where booking is possible.
- Tightened a few remaining Russian status labels from internal wording to calmer public labels: `Уточняется вручную`, `Активно, через контакт`, `Закрыто`, and `Проверенных вариантов`.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru`, `/ru/facilities/gali-yam-tennis`, `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court`, `/ru/verification?facility=gali-yam-tennis&action=online-booking`, `/ru/bookings`, and `/ru/profile`: no visible internal terms (`ADR`, `Epic`, `demo`, `SportSync`, `payment`, `Visa`, `API`, `slot`), one `h1`, no horizontal overflow, and no console errors.
- Mobile browser QA passed at `390x844` for `/ru`, `/ru/facilities/gali-yam-tennis`, and `/ru/book/gali-yam-tennis?slot=gali-yam-demo-adult-court`: one `h1` and no horizontal overflow.

Next action:

- Do the same municipal-language pass for Hebrew once Russian product wording is approved.

## 2026-06-18 19:21 IDT

Objective: apply the provided SportIL Israeli sport mark as the product logo and background brand layer.

Changed:

- Added the provided brand images under `apps/web/public/images/brand/`.
- Created a cropped square logo asset from the light mark for compact header use.
- Replaced the hand-drawn header SVG with the provided PNG logo while keeping the visible `SportIL` text as the accessible name.
- Added the dark brand image as a restrained watermark layer in the home search band with a white overlay so search, filters, and copy keep municipal-service readability.
- Tuned desktop and mobile logo/background sizes so the mark is visible without creating horizontal scroll or lowering contrast.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru` at `1280x900`: logo PNG loaded at 512x512 source size, 48px header mark, background watermark loaded at 0.16 opacity, one `h1`, no horizontal overflow, and no console errors.
- Browser QA passed on `/ru` at `390x844`: logo PNG loaded, 44px header mark, background watermark loaded at 0.12 opacity, one `h1`, no horizontal overflow, and no console errors.

Next action:

- If this brand direction is approved, extend the same logo/fallback treatment to favicons and installable PWA icons.

## 2026-06-18 19:24 IDT

Objective: turn the approved SportIL mark into browser favicon and installable PWA icons.

Changed:

- Generated browser and app icons from the approved SportIL mark:
  `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-192x192.png`, and `maskable-512x512.png`.
- Added `/favicon.ico` for classic favicon support.
- Added `/manifest.webmanifest` with standalone display, Israeli-blue theme color, regular icons, maskable icons, and language shortcuts for Hebrew, Russian, and English.
- Connected manifest, favicon, PNG icons, Apple touch icon, and Apple web app metadata through the localized Next metadata layout.

Verification:

- Manifest JSON validation passed.
- Icon dimensions verified with `sips`; `/favicon.ico` verified as a 32x32 Windows icon.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru`: `<head>` contains manifest, shortcut icon, PNG favicons, and Apple touch icon; manifest returns `200` as `application/manifest+json`; every favicon/PWA icon returns `200`; one `h1`, no horizontal overflow, and no console errors.

Next action:

- Run a real device install check on iOS/Android once the app is exposed through HTTPS or a tunnel.

## 2026-06-18 23:34 IDT

Objective: implement the public audit document into the first-month MVP plan and fix the highest-risk public UI/data leaks before deeper transactional work.

Changed:

- Added `docs/implementation-readiness/PUBLIC_AUDIT_TO_FIRST_MONTH_MVP_PLAN.md` with current state, first-month P0/P1 scope, explicit do-not-build items, acceptance criteria, and the next sprint order.
- Added resident-facing dictionary strings for public access, untracked occupancy, and same-space conflict warnings.
- Reworded verification statuses so public pages distinguish `Бронь в SportIL` from `Регистрация у центра`.
- Replaced numeric confidence in public facility/search/verification surfaces with resident-facing source-confidence labels.
- Localized raw source time values for Russian and English instead of showing Hebrew values in public UI.
- Changed public/free facilities to show `Открыто для публики` and `Загруженность не отслеживается` instead of fake free-seat capacity.
- Marked Top Padel as center-side registration rather than SportIL-bookable.
- Flagged the Gali-Yam same-space overlap in the UI and made the conflicting private-coach time a request/confirmation case rather than an independently bookable option.
- Updated booking summary and nearest alternatives to use localized time and capacity wording.
- Fixed normalized search filters so `online=1` keeps the `onlineOnly` constraint through facility search, matching slots, sport options, and nearest alternatives.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build` passed.
- Browser QA passed on `/ru`, `/ru?online=1`, `/ru/facilities/gali-yam-tennis#schedule`, `/ru/facilities/sportek-ir-yamim-court#schedule`, `/ru/facilities/top-padel-ir-yamim`, and `/ru/verification?facility=gali-yam-tennis&action=online-booking`.
- Mobile browser QA passed at `390x844` for `/ru` and `/ru/facilities/gali-yam-tennis#schedule`.
- QA confirmed `/ru?online=1` now returns 1 SportIL-bookable result and does not show Top Padel or public/free facilities as online-bookable options.
- QA confirmed no visible old numeric `/100` confidence, `Проверка: 82`, raw Hebrew time values, `SportSync`, `demo/mock`, vertical-slice wording, or payment wording on the tested Russian public pages.
- QA confirmed no horizontal overflow and no console errors on the tested desktop and mobile routes.

Open risks:

- The app is still a strong catalog/demo MVP, not a complete transactional MVP.
- Real resident request forms, mini-account surfaces, persistent verification actions, partner/admin review, and provider-backed confirmation are still missing.
- Technical source identifiers such as `demo`/`mock` and raw Hebrew time constants remain in internal data/code, but they no longer leak to the tested public UI.
- The local workspace has no `.git` directory, so status/diff tracking must rely on the progress log and file review unless the project is reattached to version control.

Next action:

- Implement the next P0 vertical slice: persistent resident request/hold records, mini-account booking/request list, admin verification action forms, and API-backed confirmation state that uses the existing Prisma/NestJS transaction repository and overlap safeguards.

## 2026-06-18 23:59 IDT

Objective: continue the P0 transactional slice with persistent resident verification requests, API-backed mini-account read models, and real form submission from the public UI.

Changed:

- Added `VerificationRequestKind`, `VerificationRequestStatus`, and `VerificationRequest` to the Prisma schema.
- Added migration `20260618234500_verification_requests` with request enums, table, indexes, foreign keys, and a non-empty request check.
- Added NestJS `VerificationModule` with:
  - `POST /api/v1/verification-requests`;
  - `GET /api/v1/me/verification-requests`;
  - `GET /api/v1/admin/verification-requests`;
  - `PATCH /api/v1/admin/verification-requests/:requestId`.
- Public request submission creates both a resident-facing `verification_requests` row and an internal `data_verification_tasks` row for operator triage.
- Added `GET /api/v1/me/bookings` backed by the existing booking repository and Prisma transaction path.
- Extended `BookingRepository` with a resident activity read model for held/expired/released holds and confirmed bookings.
- Added `VerificationRequestForm` to the public verification page for report, claim, availability, and online-booking requests.
- Replaced the `/[locale]/bookings` placeholder with an API-backed mini-account dashboard showing confirmed bookings/holds and sent requests.
- Added responsive civic-service styling for resident request forms and account activity panels.

Verification:

- `prisma validate` passed.
- `prisma generate` passed.
- `corepack pnpm db:migrate` applied `20260618234500_verification_requests`.
- API smoke passed for creating a verification request, listing resident requests, listing admin requests, and updating admin status.
- Browser QA passed for `/ru/verification?facility=gali-yam-tennis&action=report`: form submits a test request and returns a visible `VR-...` public id.
- Browser QA passed for `/ru/bookings`: sent requests and confirmed bookings render from API data.
- Browser QA passed for booking hold -> confirm -> `/ru/bookings`: confirmed booking reference `SPIL-...` appears in the mini-account.
- Mobile browser QA passed at `390x844` for the verification form and account dashboard with one `h1`, no horizontal overflow, and no console errors.
- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm --filter @sportil/db build`, `@sportil/api build`, and `@sportil/web build` passed.

Open risks:

- Auth/RBAC is still demo-header based; production session guards are not implemented yet.
- Admin verification queue has API status transitions, but no dedicated web admin screen yet.
- Profile and saved pages are still lightweight placeholders; the next P0 mini-account step should persist profile and follows.
- Verification requests store contact fields for the demo; production needs retention rules, consent text, and admin access boundaries.

Next action:

- Build the admin verification screen and profile/saved persistence, then add request/booking E2E coverage around the new APIs.

## 2026-06-19 00:20 IDT

Objective: continue the P0 mini-account slice with persistent profile/saved facilities and a dedicated admin verification screen.

Changed:

- Extended `UserAccount` with `preferredLocale`, `contactPhone`, `familyMembers`, and `favoriteSports`.
- Added migration `20260619001000_user_profile_and_saved_uniques` with profile fields plus partial unique indexes for facility, coach, and program follows.
- Added NestJS `AccountModule` with:
  - `GET /api/v1/me/profile`;
  - `PATCH /api/v1/me/profile`;
  - `GET /api/v1/me/saved`;
  - `POST /api/v1/me/saved/facilities/:facilityId`;
  - `DELETE /api/v1/me/saved/facilities/:facilityId`.
- Added audit events for profile updates and saved/unsaved facility actions.
- Added a facility-detail save button backed by the API.
- Replaced `/[locale]/saved` and `/[locale]/profile` placeholders with API-backed client dashboards.
- Added `/[locale]/admin/verification` as the first dedicated operator screen for reviewing and changing resident request status.
- Added a verification-page link to the admin queue for local/demo operator workflow.
- Added responsive civic-service styles for saved actions, profile sport choices, and admin status controls.

Verification:

- `corepack pnpm lint` passed.
- `corepack pnpm typecheck` passed.
- `DATABASE_URL=postgresql://sportil:sportil@localhost:5432/sportil corepack pnpm db:migrate` applied `20260619001000_user_profile_and_saved_uniques`.
- `DATABASE_URL=postgresql://sportil:sportil@localhost:5432/sportil corepack pnpm db:seed` reseeded the local catalog.
- `corepack pnpm --filter @sportil/db build` passed.
- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/web build` passed.
- API smoke passed for reading/updating profile, saving Gali-Yam, listing saved facilities, listing admin verification requests, and updating request `VR-YCEEKIMS` to `triaged`.
- Browser QA passed for `/ru/facilities/gali-yam-tennis`: save/unsave/save toggle works and the availability calendar remains present.
- Browser QA passed for `/ru/saved`: saved Gali-Yam card renders, open link is present, one `h1`, no horizontal overflow.
- Browser QA passed for `/ru/profile`: resident profile form saves and shows `Профиль сохранен`.
- Browser QA passed for `/ru/admin/verification`: two request cards render and an admin status transition to `В работе` works.
- Mobile browser QA passed at `390x844` for `/ru/saved`, `/ru/profile`, and `/ru/admin/verification`: one `h1`, no horizontal overflow, and zero console errors.

Open risks:

- Auth/RBAC still uses demo request headers; production guards and session claims are not implemented yet.
- Admin queue has status transitions, but no audit detail view, assignment, comments, retention policy, or role-scoped UI yet.
- Saved facilities now persist, but saved coaches/programs are only modeled and indexed; UI/API endpoints for those follow types remain future work.
- Profile family data is stored as JSON for the prototype; production needs a stricter consent and retention model before collecting real resident data.

Next action:

- Add E2E coverage around profile/saved/admin flows and continue toward production auth/RBAC guards plus admin audit/history surfaces.

## 2026-06-19 00:36 IDT

Objective: add a server-side RBAC enforcement bridge and repeatable E2E coverage for profile, saved facilities, and admin verification.

Changed:

- Added shared `UserRole` values to `@sportil/types`.
- Added API auth primitives under `apps/api/src/common/auth/`:
  - `AuthContextGuard` builds `request.user` from a development session header and keeps legacy demo headers as temporary fallback;
  - `RolesGuard` enforces role metadata at the API boundary;
  - `@Roles()` and `@CurrentUser()` keep controllers explicit and thin.
- Applied RBAC to account, booking, and verification controllers:
  - resident/guardian/city_admin can manage their own profile, saved facilities, bookings, and requests;
  - `GET/PATCH /api/v1/admin/verification-requests` now requires `city_admin`;
  - public slot alternatives remain unauthenticated discovery.
- Added `apps/web/src/auth-client.ts` so client components use one development session contract instead of hard-coded legacy headers.
- Migrated profile, saved, booking, booking-flow, verification request, and admin dashboard fetches to `x-sportil-dev-role` / `x-sportil-dev-user`.
- Added friendly `409 email_already_used` handling for profile email uniqueness conflicts.
- Added Playwright E2E infrastructure:
  - `@playwright/test` root dev dependency;
  - `playwright.config.ts` with isolated API/web test ports `4100/3101`;
  - `pnpm e2e` script that starts local Postgres, applies migrations, seeds, starts API/web, and runs tests.
- Added `tests/e2e/profile-saved-admin.spec.ts` covering:
  - resident profile save;
  - facility save and `/saved` persistence;
  - resident blocked from admin queue with `403`;
  - city admin can open verification queue and update request status.
- Expanded API CORS origins for the E2E web port `3101`.

Verification:

- `corepack pnpm exec playwright install chromium` installed the local Chromium runner.
- `corepack pnpm e2e` passed: 2 tests, profile/saved/admin/RBAC.
- `corepack pnpm lint` passed.
- `corepack pnpm typecheck` passed.
- `corepack pnpm --filter @sportil/db build` passed.
- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/web build` passed.
- API smoke passed: resident profile `200`, resident admin list `403`, city_admin admin list `200`.
- Browser QA passed on live `http://localhost:3001`:
  - `/ru/admin/verification` loads 7 cards, one `h1`, no horizontal overflow, and status update works;
  - `/ru/profile` saves and shows `Профиль сохранен`;
  - `/ru/saved` shows Gali-Yam after saving;
  - mobile `390x844` for `/ru/admin/verification`, `/ru/profile`, `/ru/saved` has one `h1`, no horizontal overflow, and zero console errors.

Architecture note:

- This is a development RBAC bridge that follows ADR-0005's server-boundary rule, but it is not production auth. Production still needs opaque server-side sessions with `HttpOnly` cookies and a real session store.

Open risks:

- `x-sportil-dev-role` and `x-sportil-dev-user` are local-development only and must not be enabled as production trust inputs.
- Admin audit history exists as `audit_events`, but the admin UI still lacks a detail drawer, assignment, comments, and visible history.
- Playwright covers the main happy paths and one RBAC denial; invalid-form, duplicate-email, booking hold/confirm, and mobile E2E coverage remain to be added.
- `playwright-report/` and `test-results/` are generated locally and ignored by `.gitignore`.

Next action:

- Implement admin verification detail/history UI and add E2E around duplicate-email handling plus booking hold/confirm under the RBAC bridge.

## 2026-06-19 01:05 IDT

Objective: assess plan completion honestly and prepare the first Cloudflare/production deployment package without exposing development auth.

Changed:

- Added Cloudflare Workers/OpenNext support for the web app:
  - `@opennextjs/cloudflare` and `wrangler`;
  - `apps/web/wrangler.jsonc`;
  - `apps/web/open-next.config.ts`;
  - `apps/web/public/_headers`;
  - `cf:build`, `cf:preview`, `cf:deploy`, and `cf:upload` scripts.
- Removed `next/font/google` Rubik dependency from the app shell so production/Cloudflare builds do not depend on `fonts.gstatic.com` availability.
- Added deployment scripts at the root:
  - `build:api`;
  - `build:all`;
  - `deploy:web:cf`;
  - `docker:api:build`.
- Added API deployment safety:
  - `GET /healthz`;
  - `GET /readyz`;
  - `SPORTIL_ALLOWED_ORIGINS` driven CORS;
  - production CORS no longer allows development auth headers;
  - `x-sportil-dev-role`, `x-sportil-dev-user`, and legacy demo headers are rejected when `NODE_ENV=production`.
- Added `.env.example`.
- Added `.dockerignore` and `Dockerfile.api`.
- Excluded generated Cloudflare artifacts from web ESLint and git ignore.
- Added `docs/deployment/CLOUDFLARE_AND_PRODUCTION_DEPLOYMENT.md`.
- Updated `docs/README.md` and `docs/implementation-readiness/IMPLEMENTATION_GATE.md`.

Research notes:

- Checked current Cloudflare Workers Next.js guidance on 2026-06-19: full Next.js should deploy to Workers through the OpenNext adapter.
- Checked OpenNext Cloudflare docs on 2026-06-19: Next.js 16 is supported and the adapter transforms Next build output into a Workers bundle.
- Checked Cloudflare Pages custom-domain and Tunnel docs on 2026-06-19 for domain and protected preview options.
- No Cloudflare connector is currently available in this Codex session's installable plugin list; deployment can still use Wrangler with credentials.

Verification:

- `corepack pnpm --filter @sportil/api build` passed.
- `corepack pnpm --filter @sportil/web typecheck` passed.
- `corepack pnpm --filter @sportil/web lint` passed.
- `corepack pnpm lint` passed after excluding generated `.open-next` artifacts.
- `corepack pnpm typecheck` passed.
- `corepack pnpm e2e` passed: 2 tests, profile/saved/admin/RBAC.
- `NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.sportil.example.com/api/v1 corepack pnpm --filter @sportil/web build` passed.
- `NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.sportil.example.com/api/v1 corepack pnpm --filter @sportil/web cf:build` passed and generated `.open-next/worker.js`.
- `wrangler deploy --dry-run --outdir .wrangler-dry-run` passed with gzip upload around 966 KiB.
- Production API smoke on port `4200` passed:
  - `/healthz` returned `200`;
  - `/readyz` returned `200`;
  - admin request with `x-sportil-dev-role` returned `401`;
  - production CORS allowed only the configured origin and `content-type`.
- Restarted local API on `:4000` and web on `:3001`; `/healthz` and `/ru/saved` both returned `200`.

Open risks:

- Public beta is not ready until real HttpOnly server-side auth/session and production RBAC claims exist.
- Booking/profile/admin mutation flows must not be exposed publicly with development identity.
- Real payment provider and webhook idempotency are not implemented.
- SportSync live inventory and production map-provider credentials are not implemented.
- Docker could not be verified locally because Docker is not installed on this machine.
- Local Wrangler runtime preview may be unreliable on this macOS version because Cloudflare `workerd` requires macOS 13.5+; dry-run works.

Next action:

- Pick domain, Cloudflare account, API host, and managed PostgreSQL provider; then deploy a protected stakeholder preview or implement real auth before public beta.

## 2026-06-19 01:14 IDT

Objective: prepare the newly registered `gosport.co.il` domain for Cloudflare deployment.

Changed:

- Updated `.env.example` production examples to use `https://gosport.co.il`, `https://www.gosport.co.il`, and `https://api.gosport.co.il/api/v1`.
- Added `gosport.co.il` and `www.gosport.co.il` as Cloudflare Worker custom domains in `apps/web/wrangler.jsonc`.
- Added domain-aware metadata support:
  - `NEXT_PUBLIC_SPORTIL_SITE_URL`;
  - `metadataBase`;
  - language alternates;
  - `/robots.txt`;
  - `/sitemap.xml`.
- Updated `docs/deployment/CLOUDFLARE_AND_PRODUCTION_DEPLOYMENT.md` with selected domain, API hostname, web hostnames, and registrar DNS handoff steps.

Notes:

- The registrar screenshot shows current nameservers `ns1.sitesdepot.com` and `ns2.sitesdepot.com`; these should be replaced only after Cloudflare provides the assigned nameservers for `gosport.co.il`.
- `api.gosport.co.il` still needs an API host and managed PostgreSQL before it can serve the NestJS API publicly.

Verification:

- `NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm --filter @sportil/web cf:build` passed.
- `NEXT_PUBLIC_SPORTIL_SITE_URL=https://gosport.co.il NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm --filter @sportil/web build` passed and generated `/robots.txt` plus `/sitemap.xml`.
- `NEXT_PUBLIC_SPORTIL_SITE_URL=https://gosport.co.il NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm --filter @sportil/web cf:build` passed.
- `corepack pnpm --filter @sportil/web lint` passed.
- `corepack pnpm --filter @sportil/web typecheck` passed.
- `wrangler deploy --dry-run --outdir .wrangler-dry-run` passed with the `gosport.co.il` custom-domain config; gzip upload around 1.1 MiB.

Next action:

- Use the user's browser to create/add the Cloudflare zone or ask the user to log in to Cloudflare, then copy the assigned nameservers into Internic's `DNS Change` form.

### 2026-06-19 01:12 IDT - Cloudflare zone created for `gosport.co.il`

Objective: add the registered domain to Cloudflare and capture the exact registrar handoff values.

Changed:

- Added `gosport.co.il` to the user's Cloudflare account through the in-app browser.
- Kept Cloudflare's free zone path; no paid plan or purchase flow was used.
- Confirmed Cloudflare DNS scan found `0` existing DNS records.
- Recorded assigned Cloudflare nameservers in `docs/deployment/CLOUDFLARE_AND_PRODUCTION_DEPLOYMENT.md`:
  - `june.ns.cloudflare.com`
  - `keanu.ns.cloudflare.com`

Next action:

- With owner confirmation, replace Internic/Intersphere nameservers `ns1.sitesdepot.com` and `ns2.sitesdepot.com` with `june.ns.cloudflare.com` and `keanu.ns.cloudflare.com`.
- After Cloudflare activates the zone, deploy the web Worker and create/point `api.gosport.co.il` to the chosen API host.

### 2026-06-19 01:18 IDT - Registrar nameservers switched to Cloudflare

Objective: complete the real registrar cutover after owner confirmation.

Changed:

- Updated `gosport.co.il` nameservers in the Internic/Interspace portal:
  - from `ns1.sitesdepot.com`
  - from `ns2.sitesdepot.com`
  - to `june.ns.cloudflare.com`
  - to `keanu.ns.cloudflare.com`
- Registrar portal confirmed: `Domain Names Updated successfully`.
- Clicked `I updated my nameservers` in Cloudflare.

Current status:

- Cloudflare shows `Waiting for your registrar to propagate your new nameservers`.
- Immediate DNS checks still return no delegated NS / `NXDOMAIN` from `co.il`, so activation is pending registrar/registry propagation.

Next action:

- Re-check Cloudflare activation and public NS propagation later.
- Once active, deploy the Cloudflare Worker custom domains and configure `api.gosport.co.il` for the selected API host.

### 2026-06-19 01:25 IDT - First-month tooling and payments plan

Objective: decide what to register/configure during the first month while Cloudflare nameserver propagation is pending.

Changed:

- Added `docs/implementation-readiness/FIRST_MONTH_TOOLING_AND_PAYMENTS_PLAN.md`.
- Added the new plan to `docs/README.md` required reading.

Decision:

- Month one should be a public catalog preview plus a protected transactional pilot.
- Keep real public payments disabled until production auth/RBAC, payment webhook verification/idempotency, cancellation/refund policy, privacy/retention copy, and merchant-of-record decision are ready.
- Shortlist payment providers for sandbox/spike work: Grow Payments/Meshulam first, Tranzila second, PayPlus as a comparison option.

Next action:

- After Cloudflare activates, deploy the web Worker.
- Then choose/create source control, API host, managed PostgreSQL, email sender, Turnstile, maps, Sentry, and payment sandbox accounts in the order defined by the new plan.

### 2026-06-19 01:45 IDT - GitHub repository check

Objective: verify the newly created GitHub repository and local source-control state.

Findings:

- GitHub browser session is logged in as `Rman21`.
- Private repository exists: `https://github.com/Rman21/gosport`.
- Repository has branch `main`, one initial commit, and only `README.md`.
- Local workspace `/Users/rm/Documents/SportIL` is now initialized as a git repository on branch `main`.
- Local remote `origin` points to `https://github.com/Rman21/gosport.git`.
- Local `gh` CLI is not installed.
- Codex GitHub connector tools currently return an internal error in this session, so browser/local git are the available paths.
- `.gitignore` now excludes `.wrangler/` in addition to existing generated artifacts and local env files.
- Quick secret scan found only local/example connection strings and an empty `CLOUDFLARE_API_TOKEN=` placeholder in `.env.example`, not live secrets.

Next action:

- Create the first project commit, push to `main`, then add GitHub Actions.

### 2026-06-19 01:55 IDT - GitHub CLI installed

Objective: install GitHub CLI so local git/GitHub operations can run from the workspace.

Changed:

- Installed GitHub CLI through Homebrew.
- Installed version: `gh 2.95.0`.
- Verified `gh auth status` is logged in to `github.com` as `Rman21`.
- Token scopes include `repo` and `workflow`, so first push and GitHub Actions setup are now unblocked.

Notes:

- Homebrew warned that macOS 13.0 is an older/Tier 3 configuration and that newer Command Line Tools are available.
- Local repo remote is still `https://github.com/Rman21/gosport.git`.

Next action:

- Create the first project commit and push it to `Rman21/gosport`.

### 2026-06-19 02:04 IDT - First commit preparation and CI

Objective: prepare the local project for the first push to `Rman21/gosport`.

Changed:

- Added `.github/workflows/ci.yml` for GitHub Actions.
- Updated root `README.md` from the initial placeholder to a project overview with local commands and deployment direction.
- Extended `.gitignore` to exclude `.wrangler/`, Python `__pycache__/`, and `*.pyc`.
- Updated `docs/implementation-readiness/FIRST_MONTH_TOOLING_AND_PAYMENTS_PLAN.md` with the CI status.

Verification:

- `corepack pnpm lint` passed.
- `corepack pnpm typecheck` passed.
- `NEXT_PUBLIC_SPORTIL_SITE_URL=https://gosport.co.il NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm build:all` passed.
- `NEXT_PUBLIC_SPORTIL_SITE_URL=https://gosport.co.il NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm --filter @sportil/web cf:build` passed.
- `corepack pnpm e2e` passed: 2 tests.

Next action:

- Stage, commit, and push to `Rman21/gosport`.

### 2026-06-19 02:15 IDT - GitHub CI Playwright hardening

Objective: finish the first remote CI run after the initial GitHub push.

Changed:

- Pushed the first full project commit to `Rman21/gosport` on `main`.
- Updated GitHub Actions to run inside the official Playwright Chromium image.
- Switched CI database access from `localhost` to the GitHub service hostname `postgres`, which is required inside a job container.
- Added workflow concurrency so newer pushes can cancel stale runs on the same branch.
- Updated `docs/implementation-readiness/FIRST_MONTH_TOOLING_AND_PAYMENTS_PLAN.md` with the current source-control state.

Reason:

- The first GitHub Actions run passed lint, typecheck, API build, web build, Cloudflare artifact build, and database preparation, then spent too long on `playwright install --with-deps chromium`.
- Using the official Playwright image removes that fragile install step and makes E2E CI closer to the local verified browser runner.

Next action:

- Cancel the stale CI run, push the workflow hardening commit, and confirm the new run is green.

Result:

- Canceled the stale run `27794711364`.
- Pushed commit `ea07d2b` (`Harden GitHub CI Playwright runner`) to `main`.
- GitHub Actions run `27795147222` passed in `3m19s`.
- GitHub Actions run `27795299221` passed on the latest `main` commit in `3m14s`.
- Remote CI now covers lint, typecheck, API build, web build, Cloudflare Worker artifact build, Prisma migration/seed against PostgreSQL 17, Playwright browser verification, and E2E.
- Attempted to enable branch protection on `main`, but GitHub returned `403`: the current private repository plan requires GitHub Pro or a public repository for branch protection.

Next action:

- Decide whether to upgrade GitHub, make the repository public later, or keep manual PR discipline until branch protection is available.
- When Cloudflare nameserver activation is complete, create production deploy secrets and deploy the web Worker for `gosport.co.il` / `www.gosport.co.il`.

### 2026-06-19 10:35 IDT - Cloudflare deploy readiness and DNS blocker

Objective: check whether `gosport.co.il` is ready for public Cloudflare Worker deploy.

Findings:

- WHOIS shows `gosport.co.il` assigned on `2026-06-19`, valid through `2027-06-19`, registrar `InterSpace Ltd`.
- WHOIS lists the expected Cloudflare nameservers: `june.ns.cloudflare.com` and `keanu.ns.cloudflare.com`.
- Cloudflare authoritative nameservers answer correctly for the zone.
- Authoritative `co.il` nameservers still return `NXDOMAIN` for `gosport.co.il`; public resolvers therefore return no NS records yet.
- Wrangler is authenticated to account `668a85f81bd776eb91becb7b4d929f86` as `rmanilov21@gmail.com` and has Workers write permissions.

Verification:

- `NEXT_PUBLIC_SPORTIL_SITE_URL=https://gosport.co.il NEXT_PUBLIC_SPORTIL_API_BASE_URL=https://api.gosport.co.il/api/v1 corepack pnpm --filter @sportil/web cf:build` passed.
- `corepack pnpm --filter @sportil/web exec wrangler deploy .open-next/worker.js --config wrangler.jsonc --dry-run --outdir .wrangler/dry-run` passed.
- Dry-run read 52 asset files, confirmed `ASSETS` and `WORKER_SELF_REFERENCE` bindings, and reported a 5.56 MiB Worker upload package.

Decision:

- Do not deploy the public custom-domain Worker until `co.il` publishes the delegation; otherwise the domain will still be unreachable and troubleshooting becomes noisier.

Next action:

- Continue DNS checks.
- If `co.il` remains `NXDOMAIN`, confirm with Internic/Interspace that the assignment and NS update have been published to the live registry zone.
- Once public NS resolves to `june`/`keanu`, deploy the web Worker for `gosport.co.il` and `www.gosport.co.il`, then configure `api.gosport.co.il`.

### 2026-06-19 12:42 IDT - Internic DNS update resubmitted

Objective: remove any possible registrar-side stale DNS state for `gosport.co.il`.

Action:

- In the Internic DNS records screen for `gosport.co.il`, confirmed the nameserver fields are `june.ns.cloudflare.com` and `keanu.ns.cloudflare.com`.
- Submitted `Update DNS records` after owner confirmation.
- Internic returned `Domain Names Updated successfully`.

Verification:

- WHOIS still lists the expected Cloudflare nameservers.
- Cloudflare authoritative nameservers answer with `june.ns.cloudflare.com` and `keanu.ns.cloudflare.com`.
- Public resolvers `1.1.1.1`, `8.8.8.8`, and `9.9.9.9` still return no NS records.
- Authoritative `co.il` nameservers `nsa.ns.il`, `ns1.ns.il`, and `ns3.ns.il` still return `NXDOMAIN`; current `co.il` SOA serial observed: `2026061941`.

Current blocker:

- The registrar UI and WHOIS are correct, but the live `co.il` zone has not published the delegation yet. Public Cloudflare Worker deployment remains blocked until the registry zone stops returning `NXDOMAIN`.

Next action:

- Keep checking authoritative `co.il` NS records.
- If the status remains unchanged, contact Internic/Interspace support with the exact evidence: portal success, WHOIS correct, `co.il` authoritative `NXDOMAIN`.

### 2026-06-19 14:08 IDT - Netanya sports catalog imported into the site

Objective: use `netanya_sports_catalog_2026.xlsx` as the source for a fuller Netanya sport catalog while keeping unverified records safe and request-only.

Changed:

- Added a shared sport taxonomy for the web UI.
- Expanded `SportCode` with the additional real sports and activities from the workbook, including pilates, yoga, volleyball, handball, climbing, athletics, BJJ/MMA, sambo, ice skating, hockey, HYROX, TRX, spinning, hydrotherapy, and related categories.
- Generated a supplemental web catalog from the workbook: 127 imported rows from 141 Excel rows.
- Skipped 14 rows that already have richer curated cards, then added missing catalog-only sport slots to those curated cards where needed, such as spinning at Collegym and HYROX/weightlifting at CrossFit Green Beach.
- Imported catalog entries are shown as safe `mirror`/confirmation records: no instant booking, no fake seat counts, no payment promise, and schedule shown as `Расписание уточнить` until operator verification.
- Added `.wrangler/**` to the web ESLint ignore list so generated Cloudflare dry-run artifacts are not linted.

Verification:

- `corepack pnpm typecheck` passed.
- `corepack pnpm lint` passed.
- `corepack pnpm build:all` passed; Next generated 881 static pages.
- `corepack pnpm e2e` passed: 2 tests.
- Local HTML checks confirmed new dropdown sports and result pages for `climbing`, `handball`, and `pilates`.
- Playwright screenshots captured mobile `pilates` and desktop `climbing` pages without layout breakage.

Next action:

- Review whether the generated catalog should also be promoted into the Prisma seed/API repository, or remain web-static until the operator verification workflow claims each facility.
