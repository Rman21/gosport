# ADR-0001: Documentation And Codex Agent Operating Model

Date: 2026-06-18

Status: Accepted

## Context

Sport Netanya MVP is a high-risk product surface: booking, payments, parent/child profiles, partner sync, city analytics, and mobile-first UX. Starting implementation without durable architecture and progress tracking would make it easy to lose decisions or mix domain logic across boundaries.

The user explicitly requested mandatory progress documentation and organized documents for AAA+ June 2026 patterns, agents, and skills before implementation.

## Decision

Create a repository documentation system before writing product code:

- `AGENTS.md` for durable Codex rules;
- `docs/progress/PROGRESS.md` for mandatory progress logging;
- `docs/research/` for current external research;
- `docs/architecture/` for system organization;
- `docs/codex/` for agents and skills;
- `docs/implementation-readiness/` for the gate before implementation;
- `docs/decisions/` for ADRs.

Use Codex agents and ECC skills as a staged workflow:

1. research and architecture first;
2. read-only agent reviews;
3. ADRs for decisions;
4. implementation gate;
5. scaffold and first vertical slice.

## Consequences

Positive:

- Future Codex sessions know where to look and what to update.
- Architecture and progress remain visible.
- Agent usage is intentional instead of ad hoc.
- Implementation can be reviewed against explicit gates.

Negative:

- Slightly slower before first code.
- More documents to maintain.

## Alternatives Considered

1. Start implementation immediately from the master spec.
   - Rejected because payment, booking, sync, and role boundaries need explicit decisions.

2. Keep all planning inside the chat thread.
   - Rejected because chat history is harder to audit and less reliable across future sessions.

3. Install full ECC developer profile and rely on all available surfaces.
   - Rejected because dry-run showed broad off-stack surfaces and possible config churn. A targeted skill/agent set is safer.

## Follow-Up

Create ADRs for:

- monorepo/tooling;
- auth/session/RBAC;
- booking overlap prevention;
- payment adapter;
- SportSync connector interface;
- mobile UX and localization.

