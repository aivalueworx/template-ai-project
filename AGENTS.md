# AGENTS.md — Project Context for AI Coding Agents

> Canonical context file. Read by: Cursor, Codex, OpenCode, and any agent that follows the AGENTS.md spec.
> CLAUDE.md references this file via @AGENTS.md for Claude Code compatibility.
> Last reviewed: REPLACE-WITH-DATE

---

## Project Overview

<!-- HUMAN-AUTHORED: Fill in before first use -->
**What this project does:**
[One paragraph description]

**Primary language/runtime:** [e.g. TypeScript / Node.js 20]
**Framework:** [e.g. Next.js 15 / Fastify / NestJS]
**Database:** [e.g. PostgreSQL via Drizzle ORM]
**Deployment target:** [e.g. Vercel + Railway]
<!-- END HUMAN-AUTHORED -->

---

## Repository Structure

```
.
├── AGENTS.md               ← This file (canonical AI context)
├── CLAUDE.md               ← Claude Code entry point (@AGENTS.md)
├── CONVENTIONS.md          ← Coding standards and naming rules
├── DECISIONS.md            ← Key technical decisions log (lightweight ADR index)
├── HANDOFF.md              ← Cross-session task handoff (updated by agent at session end)
├── MEMORY.md               ← Index of all memory files (updated automatically)
├── .claude/
│   ├── rules/              ← Path-scoped instruction files for Claude Code
│   ├── skills/             ← Reusable agent workflows (SKILL.md per skill)
│   ├── hooks/              ← Pre/post tool execution scripts
│   └── memory/             ← Structured memory files (domain/, tools/)
├── .cursor/
│   └── rules/              ← Cursor-specific .mdc rule files
├── .github/
│   ├── CODEOWNERS
│   ├── copilot-instructions.md
│   └── workflows/
├── docs/
│   ├── adr/                ← Architecture Decision Records (human-only)
│   ├── runbooks/           ← Operational procedures
│   ├── postmortems/        ← Incident retrospectives (human-only)
│   ├── solutions/          ← Solved problem documentation
│   ├── plans/              ← Implementation plans
│   └── brainstorms/        ← Exploration notes
└── src/                    ← Application source code
```

---

## Build & Test Commands

<!-- HUMAN-AUTHORED: Update with actual commands -->
```bash
npm install          # Install dependencies
npm run dev          # Development server
npm run build        # Production build
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run lint         # ESLint
npm run typecheck    # TypeScript check (no emit)
```
<!-- END HUMAN-AUTHORED -->

---

## Coding Conventions

See CONVENTIONS.md for full standards. Summary:
- **Language:** TypeScript strict mode, no `any`
- **Imports:** absolute paths via `@/` alias, no relative `../..`
- **Naming:** camelCase functions, PascalCase types/components, kebab-case files
- **Tests:** co-located `*.test.ts` files, Vitest
- **Commits:** conventional commits (`feat|fix|docs|refactor|test|ci|chore`)
- **Branches:** `feature/*`, `fix/*`, `docs/*`, `chore/*`

---

## Key Technical Decisions

See DECISIONS.md for full log. Significant choices:
<!-- HUMAN-AUTHORED: Update as decisions are made -->
- [Decision summary] — see docs/adr/ADR-001-*.md
<!-- END HUMAN-AUTHORED -->

---

## What AI Agents Must NOT Do

- Modify `docs/adr/` — ADRs are immutable once Accepted
- Modify `docs/postmortems/` — human-authored only
- Edit sections marked `<!-- HUMAN-AUTHORED -->`
- Force push to `main` or `master`
- Commit `.env`, secrets, or `node_modules`
- Auto-generate ADR Decision/Rationale/Consequences — create stubs only
- Remove existing API error response definitions from openapi.yaml

---

## Documentation Maintenance Rules

When source files change, agents must:
1. Update README.md (excluding HUMAN-AUTHORED sections)
2. Update CHANGELOG.md with a Keep-a-Changelog entry
3. Sync openapi.yaml if route handlers changed
4. Create runbook stubs in docs/runbooks/ for new scripts
5. Create ADR stubs in docs/adr/ for new library/service/pattern choices
6. Update HANDOFF.md at session end with task state

---

## Memory System

Memory files live at `.claude/memory/`. Index at MEMORY.md.
- `MEMORY.md` — index of all memory files
- `.claude/memory/general.md` — cross-session facts, preferences
- `.claude/memory/domain/` — topic-specific knowledge
- `.claude/memory/tools/` — tool configs and workarounds
- `HANDOFF.md` — active task state for cross-session continuity
