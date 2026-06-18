# GoSport / SportIL

Mobile-first civic sport discovery and booking prototype for Netanya, Israel.

## What Is Here

- `apps/web` - Next.js 16 PWA/web app with Hebrew, Russian, and English UI.
- `apps/api` - NestJS API for profile, saved items, verification requests, and booking hold/confirm flows.
- `packages/db` - Prisma schema, PostgreSQL migrations, and source-backed seed catalog.
- `packages/payments` - provider-neutral payment adapter with mock provider.
- `packages/types` and `packages/ui` - shared types and UI primitives.
- `docs` - architecture, ADRs, research, deployment, and progress log.

## Local Commands

```bash
corepack pnpm install
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build:all
corepack pnpm e2e
```

## Deployment Direction

- Web: Cloudflare Workers through OpenNext.
- Domain: `gosport.co.il` and `www.gosport.co.il`.
- API: NestJS on a Node host at `api.gosport.co.il`.
- Database: managed PostgreSQL.

See `docs/deployment/CLOUDFLARE_AND_PRODUCTION_DEPLOYMENT.md` and
`docs/implementation-readiness/FIRST_MONTH_TOOLING_AND_PAYMENTS_PLAN.md`.

## Current Status

Deployment staging is prepared, but public beta is blocked on production
auth/RBAC, real payment provider policy, live inventory confidence, legal copy,
and broader tests.
