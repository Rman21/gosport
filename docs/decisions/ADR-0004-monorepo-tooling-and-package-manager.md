# ADR-0004: Monorepo Tooling And Package Manager

Date: 2026-06-18

Status: Accepted

## Context

The master spec requires a web/PWA app, API, database package, shared types, UI components, payment adapters, notification adapters, and SportSync integrations. These parts need shared TypeScript contracts, but they should remain separately testable and deployable. Current npm registry checks on 2026-06-18 show Next.js `16.2.9`, React `19.2.7`, NestJS `11.1.27`, Prisma `7.8.0`, and TypeScript `6.0.3`.

## Decision

SportIL will use a pnpm workspace monorepo with:

- `apps/web` for Next.js App Router PWA;
- `apps/api` for NestJS REST API;
- `packages/db` for Prisma schema, migrations, seed helpers, and raw SQL migrations;
- `packages/types` for shared contracts;
- `packages/ui` for civic-service components and tokens;
- `packages/payments`, `packages/notifications`, and `packages/integrations` for provider adapters;
- `packages/config` for shared TypeScript, lint, and formatting configuration.

Epic 0 may scaffold the workspace and the public mobile web shell first. API, database, and adapter packages can start as typed skeletons until their ADRs are complete.

## Alternatives Considered

### Separate repositories

- Pros: independent release boundaries.
- Cons: too much operational overhead for MVP; harder shared contracts.
- Why not: this project needs fast coordinated iteration across web, API, DB, and adapters.

### Single Next.js app with API routes only

- Pros: fastest scaffold.
- Cons: conflicts with the master spec's NestJS API, queue, connector, and admin boundaries.
- Why not: booking, payments, and SportSync need explicit backend architecture.

### npm or yarn workspaces

- Pros: familiar and simple.
- Cons: weaker strict dependency isolation and less aligned with modern TypeScript monorepo defaults.
- Why not: pnpm gives faster installs, workspace protocol support, and stricter dependency behavior.

## Consequences

### Positive

- Shared types and UI contracts stay close to the applications that consume them.
- Web and API can evolve independently while preserving one workspace workflow.
- Provider adapters and integrations are isolated before real payment or connector code arrives.

### Negative

- More initial scaffold than a single app.
- Workspace scripts and TypeScript references need careful setup.

### Risks

- Risk: package boundaries become ceremony.
  - Mitigation: keep packages thin until code is shared by at least two consumers or owns a clear domain adapter.
- Risk: generated code imports from package barrels and increases bundle cost.
  - Mitigation: prefer direct imports in web code and review bundle size before launch.
