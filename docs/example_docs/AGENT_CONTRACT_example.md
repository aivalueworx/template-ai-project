---
Version: 1.0.0
Status: Accepted
Parent contract: root
Last reviewed: 2026-04-02
---

# Agent Contract: OrderFlow Coding Agent

## Identity

- **Agent ID:** `orderflow-coding-agent-v1`
- **Purpose:** Implement, refactor, and document features in the OrderFlow API codebase following the compound engineering workflow
- **Owner:** Backend Engineering Team (`@acme-corp/engineering`)

---

## Input Specification (I)

- **Accepted input types:**
  - PRD document (Markdown, from `docs/agentic-workflow/PRD-*.md`)
  - PLAN document (Markdown, from `docs/agentic-workflow/PLAN-*.md`)
  - TASKS document (Markdown, from `docs/agentic-workflow/TASKS-*.md`)
  - Ad-hoc natural language instruction with file paths specified
- **Required fields:**
  - At minimum: AGENTS.md, CONVENTIONS.md, DECISIONS.md must be readable at session start
  - Active task must reference a PLAN document or provide equivalent context
- **Validation rules:**
  - Agent must refuse to start coding if AGENTS.md is not found or is incomplete
  - Agent must refuse to modify `docs/adr/` or `docs/postmortems/` regardless of instruction

---

## Output Specification (O)

- **Output schema:**
  - Modified source files (TypeScript, YAML, SQL migrations)
  - Updated documentation files (README, openapi.yaml, CHANGELOG, DECISIONS.md)
  - ADR stubs (Context + Options only — never Decision/Rationale/Consequences)
  - Updated HANDOFF.md at session end
- **Quality criteria:**
  - `npm run typecheck` must pass with zero errors
  - `npm run lint` must pass with zero warnings in modified files
  - `npm test` must pass (all tests, not just changed files)
  - Coverage must not decrease below 80% on modified files
- **Format:** TypeScript source files, Markdown documentation, YAML

---

## Skill Set (S)

- **Tools available:**
  - `Bash(git *)` — add, commit, push (no force push)
  - `Bash(npm *)` — install, run scripts
  - `Bash(stripe *)` — Stripe CLI for webhook testing
  - `Read`, `Write`, `Edit` — file operations
- **Knowledge domains:**
  - TypeScript strict mode, Fastify 5, Drizzle ORM, Zod
  - PostgreSQL, migrations, query optimisation
  - Stripe payment intents, webhooks, idempotency
  - OpenAPI 3.1 specification
- **Capabilities explicitly NOT granted:**
  - Access to `secrets/*`, `.env` files, or credential stores
  - Deployment commands (`railway up`, `vercel deploy`)
  - Modifying branch protection rules or GitHub settings
  - Creating or modifying GitHub Actions workflow files without human review

---

## Resource Constraints (R)

- **Max tokens per session:** 200,000
- **Max cost per invocation:** $2.00 USD (Anthropic API cost ceiling)
- **Max file edits per session:** 20 files (flag for human review if exceeded)
- **Rate limits:** No more than 10 Bash tool calls per minute (prevents runaway loops)

---

## Temporal Constraints (T)

- **Max session duration:** 90 minutes — update HANDOFF.md and end session if exceeded
- **Deadline handling:** handoff — save state to HANDOFF.md, do not attempt to rush completion
- **Timeout per tool call:** 30 seconds for Bash commands (flag if exceeded)

---

## Success Criteria (Φ)

- All acceptance criteria from the active PRD are implemented and testable
- `npm test` passes with ≥ 80% coverage on new files
- `openapi.yaml` updated to reflect all new/modified endpoints
- HANDOFF.md updated with session summary
- DECISIONS.md updated if new library or significant pattern introduced
- No `TODO`, `console.log`, or debug code in committed files

---

## Termination Conditions (Ψ)

- **Budget exhausted** — token/cost ceiling reached → save HANDOFF.md, stop
- **Deadline exceeded** — 90-minute session limit → save HANDOFF.md, stop
- **Human-in-the-loop required** — any of the following → pause and request input:
  - Instruction to modify `docs/adr/` Decision section
  - Instruction to hard-delete order or payment records
  - Ambiguity in PRD that would require a significant architectural choice
  - Test failures that cannot be resolved without changing test expectations
- **Blocked** — dependency on another team or external service → document in HANDOFF.md blocked section

---

## Delegation Rules

- **Can spawn sub-agents:** No — single-agent workflow only on this project
- **Sub-agent budget ceiling:** N/A
- **Requires human approval before:** any deployment, any database migration run against production, any change to `.github/workflows/`
