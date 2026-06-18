# Implementation Readiness Gate

Last updated: 2026-06-19 01:05 IDT

Full feature implementation should not begin until this gate is reviewed. The user has explicitly asked to start implementation, so the current allowed path is Epic 0 scaffold plus the smallest mobile vertical slice, while deeper production concerns continue through ADRs and agent review.

## Gate A - Documentation Baseline

- [x] Master spec exists.
- [x] Progress log exists.
- [x] AAA+ June 2026 research document exists.
- [x] Architecture organization document exists.
- [x] Codex agents/skills operating model exists.
- [x] Root `AGENTS.md` instructs Codex to update progress.

## Gate B - Architecture Decisions

- [x] ADR for monorepo tooling and package manager.
- [x] ADR for auth/session strategy.
- [x] ADR for booking overlap prevention.
- [x] ADR for payment adapter and mock provider behavior.
- [x] ADR for SportSync connector interface.
- [x] ADR for map provider abstraction.
- [x] ADR for Israeli civic-service design direction.
- [x] ADR for localization/RTL implementation strategy.

## Gate C - Data Model Readiness

- [x] Entity list mapped from master spec to Prisma models.
- [ ] PostGIS strategy defined.
- [x] Double-booking DB constraint defined.
- [x] Idempotency keys defined for booking/payment/sync.
- [x] Audit log schema defined.
- [x] Redaction strategy for payment and connector payloads defined.

## Gate D - UX System Readiness

- [x] Israeli civic-service design direction defined.
- [x] Base UI token and component contract defined.
- [x] Mobile navigation model defined in implementation detail.
- [x] First vertical slice user journey defined.
- [x] Component inventory prioritized.
- [x] Status labels mapped from backend enums to user-facing language.
- [x] Catalog verification/provenance labels mapped to user-facing language.
- [x] RTL and localization conventions defined in implementation detail.
- [x] Accessibility baseline defined for key components.

## Gate E - Verification Readiness

- [ ] Unit test strategy defined.
- [ ] Integration test strategy defined.
- [ ] E2E journeys defined.
- [ ] Double-booking test strategy defined.
- [ ] Payment webhook idempotency tests defined.
- [ ] Sync conflict tests defined.
- [x] Mobile browser QA viewports defined.

## Gate F - Agent Workflow Readiness

- [x] DAILY Codex agents available.
- [x] DAILY ECC skills installed.
- [x] Agent planning pass completed for Epic 0 and first vertical slice.
- [ ] Security reviewer pass completed on architecture.
- [ ] Database reviewer pass completed on schema plan.
- [x] Frontend reviewer pass completed on mobile UX plan.
- [ ] E2E runner pass completed on journey coverage.

## Current Readiness Status

Status: `DEPLOYMENT STAGING PREPARED - PUBLIC BETA BLOCKED`

Reason: the documentation framework, civic design direction, RTL/localization strategy, component priority, mobile navigation, Next.js web shell, source-backed Netanya seed catalog, safe mock booking/payment route, Prisma schema, raw PostgreSQL overlap migrations, local PostgreSQL startup script, seed data, mock payment adapter package, NestJS hold/confirm API, mini-account profile/saved/admin verification flows, server-side development RBAC bridge, and Playwright E2E happy paths are implemented. The API uses a Prisma-backed transaction repository with `SELECT ... FOR UPDATE` row locks for capacity rows, and the web booking flow calls the real hold/confirm endpoints for the demo payment path. The deployment package now includes Cloudflare Workers/OpenNext config for the web app, API health/readiness endpoints, environment-controlled CORS, production rejection of development auth headers, an API Dockerfile, and an env template. Full public beta is still blocked on real session/RBAC enforcement, real SportSync inventory, production map/provider credentials, real payment provider policy, privacy/retention copy, and broader automated coverage.

## Next Gate Action

Move from deployment staging to public beta:

1. choose the domain, Cloudflare account, API host, and managed PostgreSQL provider;
2. implement real HttpOnly server-side auth/session guard before exposing mutations beyond demo/protected mode;
3. add request-level tests for hold conflicts, physical-space overlap, expired holds, idempotency, capacity overflow, alternatives, and payment confirmation;
4. add Playwright E2E journeys for intent search, no duplicate facility cards, nearest alternatives, slot hold, confirmation, and non-bookable source-only slots;
5. implement SportSync connector ingestion for live inventory confidence and partner app/export sync;
6. finish map provider credentials/restrictions behind the accepted abstraction;
7. persist Data Verification actions as moderation/operator workflows with audit history.
