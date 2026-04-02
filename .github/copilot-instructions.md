# GitHub Copilot Instructions

> Project-level context for GitHub Copilot.
> Read AGENTS.md for the full canonical context.

## Project Context

<!-- HUMAN-AUTHORED: Fill in before first use -->
**What this project does:** [one sentence]
**Language/runtime:** [TypeScript / Node.js 20]
**Framework:** [Next.js / Fastify / etc.]
<!-- END HUMAN-AUTHORED -->

## Coding Standards (summary)

- TypeScript strict mode — no `any`, no non-null assertions without comment
- Absolute imports via `@/` alias only — never relative `../../`
- Conventional commits: `feat|fix|docs|refactor|test|ci|chore`
- Every exported function needs TSDoc with `@param`, `@returns`, `@throws`, `@example`
- Tests co-located as `*.test.ts` — never modify tests to make them pass

## What Copilot Must Not Do

- Modify `docs/adr/` files — ADRs are immutable once Accepted
- Modify `docs/postmortems/` — human-authored only
- Edit `<!-- HUMAN-AUTHORED -->` sections
- Force push to `main` or `master`
- Commit `.env` files or secrets
- Auto-generate ADR Decision/Rationale — create stubs only

## Key Files to Read

- `AGENTS.md` — canonical project context
- `CONVENTIONS.md` — full coding standards
- `DECISIONS.md` — key technical decisions
- `docs/templates/openapi.yaml` — API contract
