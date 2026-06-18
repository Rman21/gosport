# SportIL Documentation Map

Last updated: 2026-06-19 01:05 IDT

This folder is the pre-implementation operating system for Sport Netanya MVP -> SportIL. It keeps research, architecture, Codex agent workflows, decisions, and readiness gates separate from application code.

## Required Reading Order

1. `../sport_netanya_codex_master_tz_v3.md` - master product and technical requirements.
2. `progress/PROGRESS.md` - live history of what Codex changed and why.
3. `research/AAA_PLUS_MOBILE_WEB_PATTERNS_JUNE_2026.md` - June 2026 mobile web/PWA quality bar.
4. `research/NETANYA_SPORT_CATALOG_RESEARCH_2026-06-18.md` - source-backed Netanya facilities/classes seed catalog.
5. `design/ISRAELI_CIVIC_SERVICE_RESEARCH_NOTES.md` - current source-backed Israeli civic UI research.
6. `design/ISRAELI_CIVIC_SERVICE_UI_DIRECTION.md` - accepted Israeli civic-service design direction.
7. `design/UI_TOKEN_AND_COMPONENT_CONTRACT.md` - UI token and component implementation contract.
8. `architecture/ARCHITECTURE_ORGANIZATION.md` - target system boundaries and implementation organization.
9. `codex/AGENTS_SKILLS_OPERATING_MODEL.md` - how Codex agents and ECC skills should be used.
10. `implementation-readiness/IMPLEMENTATION_GATE.md` - checklist before writing product code.
11. `deployment/CLOUDFLARE_AND_PRODUCTION_DEPLOYMENT.md` - Cloudflare, API, database, secrets, and public beta readiness plan.
12. `implementation-readiness/FIRST_MONTH_TOOLING_AND_PAYMENTS_PLAN.md` - month-one accounts, infrastructure, payments, and launch sequencing.

## Folder Purpose

| Folder | Purpose |
|---|---|
| `progress/` | Mandatory running progress log. |
| `research/` | Current external research and source-backed patterns. |
| `design/` | Civic-service UI direction, tokens, component contracts, RTL/accessibility rules. |
| `architecture/` | Product architecture, module boundaries, invariants, and organization. |
| `codex/` | Agent roles, ECC skills, orchestration rules, and workflow recipes. |
| `decisions/` | ADRs and durable decisions. |
| `implementation-readiness/` | Gate criteria before scaffold and implementation. |
| `deployment/` | Deployment topology, Cloudflare setup, secrets, and release safety checklists. |

## Working Rule

Before starting implementation, Codex should turn the master spec into architecture decisions, then scaffold only the smallest vertical slice that proves:

- catalog search;
- bookable versus info-only display;
- slot hold and double-booking prevention;
- mock tokenized payment flow;
- audit logging;
- mobile-first PWA shell.
