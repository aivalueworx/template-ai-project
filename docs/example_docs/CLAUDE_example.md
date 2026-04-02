# CLAUDE.md

@AGENTS.md

<!-- Claude Code reads @references inline — AGENTS.md is the canonical context source. -->

## Claude Code Skills

Available skills in `.claude/skills/`:
- `doc-sync` — sync documentation after code changes, commit, and push
- `adr-stub` — create an ADR stub when a significant decision is made
- `code-review` — structured code review with doc gap detection
- `commit-push` — conventional commit + push to current branch
- `devils-advocate` — adversarial challenge review using CHALLENGE_PROMPTS.md

Invoke with: `/skill-name` or describe the task and Claude will auto-select.

## Claude Code Rules

Path-scoped rules in `.claude/rules/`:
- `api.md` — activates for `src/routes/**`, `src/controllers/**`
- `tests.md` — activates for `**/*.test.ts`, `**/*.spec.ts`

## Project-Specific Claude Overrides

- **Migration rule:** Never modify `src/db/schema.ts` without immediately running
  `npm run db:generate` to create the migration file in the same commit.
- **Stripe webhooks:** Always verify `stripe.webhooks.constructEvent()` before processing.
  Never trust the raw request body for payment events.
- **Drizzle queries:** Use `.prepare()` for queries run in hot paths (order list, product search).
  Unprepared queries in loops will cause connection pool exhaustion under load.

## Memory

Run `/memory` to view all loaded context files.
Memory index: MEMORY.md
Auto-memory: on

## Session End Protocol

At the end of every session, update HANDOFF.md with:
1. What was completed (with file paths and commit SHAs)
2. What is in progress (file paths + current state)
3. What is blocked and why
4. Next recommended action
