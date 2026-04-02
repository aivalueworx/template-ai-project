# AGENTS.md — Project Context for AI Coding Agents

> Canonical context file. Read by: Cursor, Codex, OpenCode, and any agent that follows the AGENTS.md spec.
> CLAUDE.md references this file via @AGENTS.md for Claude Code compatibility.
> Last reviewed: 2026-04-02

---

## Project Overview

**What this project does:**
OrderFlow API is a REST API that manages the full order lifecycle for the Acme Corp
e-commerce platform — from cart checkout through payment confirmation, fulfilment dispatch,
and return processing. It is consumed by the Vercel-hosted storefront frontend and by the
internal warehouse management system (WMS).

**Primary language/runtime:** TypeScript / Node.js 22
**Framework:** Fastify 5
**Database:** PostgreSQL 16 via Drizzle ORM
**Deployment target:** Railway (API + DB) · Vercel (frontend, separate repo)

---

## Repository Structure

```
.
├── AGENTS.md               ← This file (canonical AI context)
├── CLAUDE.md               ← Claude Code entry point
├── CONVENTIONS.md          ← Coding standards and naming rules
├── DECISIONS.md            ← Key technical decisions log
├── HANDOFF.md              ← Cross-session task handoff
├── MEMORY.md               ← Memory index
├── src/
│   ├── routes/             ← Fastify route handlers (one file per domain)
│   ├── services/           ← Business logic (no direct DB calls)
│   ├── db/
│   │   ├── schema.ts       ← Drizzle ORM schema (source of truth)
│   │   └── migrations/     ← Generated migration files
│   ├── middleware/         ← Auth, rate limiting, error handling
│   ├── lib/                ← Shared utilities (logger, config, errors)
│   └── types/              ← Shared TypeScript types and Zod schemas
├── tests/
│   ├── unit/               ← Co-located *.test.ts files
│   └── integration/        ← API-level tests against test DB
├── .claude/
├── .cursor/
└── .github/
```

---

## Build & Test Commands

```bash
npm install          # Install dependencies
npm run dev          # Development server (port 3000, hot reload)
npm run build        # TypeScript compile → dist/
npm test             # Vitest unit + integration tests
npm run test:watch   # Watch mode
npm run lint         # ESLint (zero-warning policy)
npm run typecheck    # tsc --noEmit
npm run db:migrate   # Run pending Drizzle migrations
npm run db:studio    # Open Drizzle Studio (local DB browser)
```

---

## Coding Conventions

See CONVENTIONS.md for full standards. Summary:
- **Language:** TypeScript strict mode, no `any`, no `!` without comment
- **Imports:** absolute paths via `@/` alias only
- **Naming:** camelCase functions, PascalCase types/components, kebab-case files
- **Tests:** co-located `*.test.ts`, Vitest, 80% coverage threshold
- **Commits:** `feat|fix|docs|refactor|test|ci|chore`
- **Branches:** `feature/*`, `fix/*`, `docs/*`, `chore/*`

---

## Key Technical Decisions

See DECISIONS.md for full log. Significant choices:
- **Fastify over Express** — 3× throughput at P99, native TypeScript plugin system — ADR-0002
- **Drizzle ORM over Prisma** — zero-runtime codegen, migration files are plain SQL, smaller bundle — ADR-0003
- **Railway over AWS** — single platform for API + managed Postgres, eliminates VPC/IAM overhead — ADR-0004
- **Zod for runtime validation** — single schema source for both TypeScript types and runtime guards

---

## What AI Agents Must NOT Do

- Modify `docs/adr/` — ADRs are immutable once Accepted
- Modify `docs/postmortems/` — human-authored only
- Edit sections marked `<!-- HUMAN-AUTHORED -->`
- Force push to `main` or `master`
- Commit `.env`, secrets, or `node_modules`
- Auto-generate ADR Decision/Rationale/Consequences — create stubs only
- Remove existing API error response definitions from `openapi.yaml`
- Modify `src/db/schema.ts` without creating a migration file first
- Change route handler function signatures without updating `openapi.yaml`

---

## Documentation Maintenance Rules

When source files change, agents must:
1. Update `README.md` (excluding HUMAN-AUTHORED sections)
2. Update `CHANGELOG.md` with a Keep-a-Changelog entry
3. Sync `openapi.yaml` if route handlers changed
4. Create runbook stubs in `docs/runbooks/` for new operational scripts
5. Create ADR stubs in `docs/adr/` for new library/service/pattern choices
6. Update `HANDOFF.md` at session end with task state

---

## Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes | — |
| `JWT_SECRET` | Secret for signing JWTs | Yes | — |
| `JWT_EXPIRY` | Token expiry (e.g. `15m`) | No | `15m` |
| `PORT` | API port | No | `3000` |
| `LOG_LEVEL` | `debug\|info\|warn\|error` | No | `info` |
| `STRIPE_SECRET_KEY` | Stripe API key for payment processing | Yes (prod) | — |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret | Yes (prod) | — |

---

## External Service Dependencies

| Service | Purpose | Failure mode |
|---|---|---|
| PostgreSQL (Railway) | Primary datastore | Hard failure — API returns 503 |
| Stripe | Payment processing | Graceful — orders queue, retry via webhook |
| SendGrid | Transactional email | Soft failure — log, alert, no user impact |
| WMS webhook | Notify warehouse on fulfilment | Retry 3× then dead-letter queue |

---

## Memory System

Memory files live at `.claude/memory/`. Index at MEMORY.md.
- `.claude/memory/general.md` — cross-session facts and preferences
- `.claude/memory/domain/orders.md` — order state machine and business rules
- `.claude/memory/domain/payments.md` — Stripe integration gotchas
- `.claude/memory/tools/drizzle.md` — Drizzle ORM patterns and migration workflow
