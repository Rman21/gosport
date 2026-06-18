# SportIL Codex Operating Rules

## Source Of Truth

- The product master spec is `sport_netanya_codex_master_tz_v3.md`.
- Architecture, research, agent workflow, and readiness documents live under `docs/`.
- Before implementation work, read `docs/README.md`, `docs/progress/PROGRESS.md`, and the relevant architecture or Codex workflow document.

## Progress Log Is Mandatory

After every meaningful Codex work block, update `docs/progress/PROGRESS.md` with:

- date and local time;
- objective;
- documents or files changed;
- decisions made;
- open risks;
- next action.

If work is exploratory only, still record the research outcome.

## Architecture Before Code

Do not start product implementation until the implementation gate in `docs/implementation-readiness/IMPLEMENTATION_GATE.md` is either satisfied or explicitly overridden by the user.

For any broad feature, first produce or update:

- architecture boundaries;
- data invariants;
- agent and skill plan;
- verification plan.

## Codex Agents And Skills

- Use read-only agents first for architecture, exploration, documentation research, frontend review, database review, security review, and E2E planning.
- Use write-capable agents only for focused implementation or build fixes.
- Keep subagent prompts bounded and require summarized output, not raw logs.
- Prefer installed ECC skills for repeatable workflows. Read each selected skill's `SKILL.md` before applying it.

## Non-Negotiables From The Product Spec

- Never store raw card data.
- Never allow booking or payment for unverified slots.
- Prevent double booking in both business logic and database constraints.
- Keep connector-specific logic out of booking and payment domain logic.
- Preserve audit logs for critical actions.
- Keep the mobile UX simple, RTL-ready, and accessible.

