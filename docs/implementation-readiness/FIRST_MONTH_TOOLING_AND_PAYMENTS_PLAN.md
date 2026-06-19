# First Month Tooling And Payments Plan

Last updated: 2026-06-19

## Product Stance

Month one goal is a public catalog preview plus a protected transactional pilot.

Do not expose real public payments until these are complete:

- production HttpOnly session/RBAC guard;
- provider webhook verification and idempotency;
- booking cancellation/expiry policy;
- refund/void policy;
- privacy, retention, accessibility, and cancellation copy;
- source confidence gate so only operator-confirmed/live inventory is bookable.

## Register Now

### Source Control And CI

- Create a private GitHub repository for the project.
- Add branch protection for `main`.
- Add GitHub Actions for lint, typecheck, tests, build, and Cloudflare dry-run.
- Store production secrets only in provider dashboards or GitHub Actions secrets.

Reason: production deployment history, rollback, and future Cloudflare/API releases must be reproducible from GitHub instead of a local-only workspace.

Status as of 2026-06-19:

- Private repository exists: `https://github.com/Rman21/gosport`.
- Local workspace `/Users/rm/Documents/SportIL` has been initialized as a git repository on branch `main`.
- Local remote `origin` points to `https://github.com/Rman21/gosport.git`.
- GitHub CLI is installed locally and authenticated as `Rman21`.
- `.gitignore` excludes generated artifacts such as `node_modules`, `.next`, `.open-next`, `.wrangler`, build output, Playwright reports, `.env`, and local state.
- GitHub Actions CI workflow has been added at `.github/workflows/ci.yml`.
- First full project commit has been pushed to `main`.
- CI uses the official Playwright container so E2E does not depend on a slow browser install step.
- First hardened GitHub Actions run passed: lint, typecheck, API build, web build, Cloudflare Worker artifact build, Prisma migration/seed, and Playwright E2E.
- Branch protection could not be enabled on the current private repository plan: GitHub returned `403` and requires GitHub Pro or a public repository for this feature.

Next source-control action:

- Choose whether to upgrade GitHub, make the repository public later, or keep manual PR discipline until branch protection is available.
- Add branch protection for `main` as soon as the plan supports it: required `Verify` status check, no force pushes, and no branch deletions.

### Cloudflare

Already done:

- `gosport.co.il` zone added.
- Nameservers changed at Internic/Interspace and visible in WHOIS as `june.ns.cloudflare.com` / `keanu.ns.cloudflare.com`.
- Worker custom domains prepared in code: `gosport.co.il`, `www.gosport.co.il`.
- Cloudflare authoritative nameservers answer for the zone.
- Local Cloudflare Worker production build and Wrangler dry-run passed.

Current DNS blocker as of 2026-06-19 10:35 IDT:

- Authoritative `co.il` nameservers still return `NXDOMAIN` for `gosport.co.il`.
- Public resolvers therefore do not yet return NS records.
- Do not deploy the public custom-domain Worker until `co.il` publishes the delegation.

Register/configure next:

- Cloudflare API token for GitHub Actions Workers deploy with least privilege.
- Cloudflare Turnstile widget for public request/report/claim forms.
- Cloudflare Web Analytics for low-friction public analytics.
- Optional R2 bucket only if admin/user image uploads are needed in month one.

### API Host

Recommended month-one path:

- Render Web Service or Railway service for the NestJS API.
- Use the existing `Dockerfile.api`.
- Deploy to an EU region close to Israel where available.

Choice rule:

- Pick Railway if speed and single-project setup matter most.
- Pick Render if predictable web-service operations and a conventional production setup matter most.

### Managed PostgreSQL

Recommended month-one path:

- Neon Postgres or the DB attached to the selected API host.

Choice rule:

- Pick Neon if branching, pooled connections, and isolated preview/staging DBs are useful.
- Pick Render/Railway Postgres if operational simplicity in one dashboard matters most.

Required:

- production DB;
- staging DB;
- migration deploy command;
- seed command gated so unverified inventory stays contact/request-only.

### Email

Register/configure:

- Resend account.
- Verify `gosport.co.il` or a subdomain such as `mail.gosport.co.il`.
- Create sender identities:
  - `no-reply@gosport.co.il`;
  - `support@gosport.co.il` or forwarding through Cloudflare Email Routing.

Use for:

- magic-link login;
- booking/request confirmations;
- admin verification notifications;
- operator claim messages.

Do not start SMS in month one unless email conversion is clearly insufficient.

### Maps

Recommended month-one path:

- Google Maps Platform project with billing enabled, strict key restrictions, and budget alerts.
- Enable only the APIs needed by the map adapter.
- Keep list-first UX and lazy-load map mode.

Fallback:

- Mapbox or OpenStreetMap-based rendering if Google cost/privacy becomes a blocker.

### Observability

Register/configure:

- Sentry project for `web` and `api`.
- Source map upload in production builds.
- API structured logs with request IDs.

Optional later:

- PostHog or similar product analytics only after privacy copy and event taxonomy are approved.

## Payments Direction

### Month-One Payment Policy

Keep the existing mock provider for public/protected demos until production auth and webhook idempotency are finished.

Real payment integration should be developed behind the existing `packages/payments` adapter:

1. booking hold is created first;
2. payment intent/checkout is created server-side;
3. user pays on provider-hosted checkout or iframe;
4. provider webhook verifies success;
5. booking is confirmed only from the webhook/event path;
6. failed, expired, or cancelled payment releases the hold;
7. no PAN/CVV/card fields ever enter SportIL servers.

### Provider Shortlist

Recommended first test provider:

- Grow Payments / Meshulam for faster Israeli hosted checkout onboarding, Bit, Apple Pay, and common local payment patterns.

Recommended second evaluation provider:

- Tranzila for mature Israeli clearing, iframe/tokenization options, Bit support, invoices, and PCI-focused local payment infrastructure.

Possible third evaluation provider:

- PayPlus if API ergonomics, merchant pricing, or invoice needs are better for the actual business entity.

Do not implement split payments, payouts to coaches, memberships, installments UI, or wallet balance in month one.

### What The Owner Must Prepare For Live Payments

- Legal business entity details.
- Israeli bank account for settlement.
- VAT/tax details if applicable.
- Provider merchant account.
- Terms of service.
- Cancellation and refund policy.
- Privacy policy for resident/family/minor data.
- Support email and phone.
- Decision who is merchant of record: SportIL, municipality, facility, coach, or school.

Merchant-of-record is the biggest business decision. It affects refunds, invoices, disputes, VAT, liability, and whether marketplace/split-payment complexity is needed later.

## SportSync And Inventory

Month-one approach:

- CSV import for facilities/spaces/offerings/slots/coaches.
- ICS or Google Calendar read-only busy-block import where an operator can provide it.
- Manual admin verification queue for reports, claims, and online-booking requests.

Do not build broad scraping or direct booking write-back in month one.

Bookability rule:

- `official_info` can power search/detail/request-only UX.
- `operator_confirmed` and `live_inventory` can power holds/payments.
- low-confidence or stale records cannot enter instant payment.

## Month-One Build Order

1. Activate Cloudflare zone and deploy web Worker.
2. Create private GitHub repo and CI.
3. Choose API host plus managed PostgreSQL.
4. Deploy API to `api.gosport.co.il`.
5. Implement production sessions/RBAC.
6. Add request-level tests for hold conflicts, expired holds, idempotency, capacity, alternatives, and payment confirmation.
7. Configure email sender and transactional templates.
8. Configure Turnstile on public forms.
9. Configure Sentry and basic analytics.
10. Build provider adapter spike for Grow or Tranzila in sandbox/test mode.
11. Keep real public payments disabled until legal and merchant-of-record decisions are signed off.

## Not In Month One

- Native iOS/Android app.
- Apple Developer / Google Play developer accounts.
- Split payouts and marketplace settlement.
- Full membership/subscription engine.
- WhatsApp automation.
- AI recommendations.
- Broad CRM integrations.
- Public real-money payments before auth/legal/webhook readiness.

## Source Notes

- Cloudflare Workers Next.js guide, checked 2026-06-19: `https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/`
- Cloudflare Workers custom domains, checked 2026-06-19: `https://developers.cloudflare.com/workers/configuration/routing/custom-domains/`
- Cloudflare Workers pricing, checked 2026-06-19: `https://developers.cloudflare.com/workers/platform/pricing/`
- Neon pricing/docs, checked 2026-06-19: `https://neon.com/pricing`
- Render web services/Postgres docs, checked 2026-06-19: `https://render.com/docs/web-services`
- Railway Postgres docs, checked 2026-06-19: `https://docs.railway.com/databases/postgresql`
- Resend domains/API docs, checked 2026-06-19: `https://resend.com/docs/dashboard/domains/introduction`
- Google Maps pricing docs, checked 2026-06-19: `https://developers.google.com/maps/billing-and-pricing/overview`
- Grow Payments docs, checked 2026-06-19: `https://grow-il.readme.io/`
- Tranzila docs, checked 2026-06-19: `https://docs.tranzila.com/`
- PayPlus API docs, checked 2026-06-19: `https://docs.payplus.co.il/reference/introduction`
