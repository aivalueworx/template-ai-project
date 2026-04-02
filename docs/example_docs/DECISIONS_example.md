---
Last reviewed: 2026-04-02
Owner: Backend Engineering Team
---

# DECISIONS.md — Technical Decisions Log

> Lightweight index of key technical decisions.
> Full rationale lives in `docs/adr/` for significant decisions.
> AI agents: when adding a new library, service, or pattern, add an entry here
> AND create a stub in `docs/adr/`. Never fill in the ADR Decision/Rationale sections.

## Format

Each entry: `[Date] Decision — brief rationale — ADR link if applicable`

---

## Infrastructure

- [2026-01-10] Railway for API hosting and managed PostgreSQL — eliminates VPC/IAM complexity, Postgres + API on one platform, predictable pricing — docs/adr/ADR-0004-railway-hosting.md
- [2026-01-10] Vercel for storefront frontend (separate repo) — zero-config Next.js, CDN edge functions, independent deploy cadence from API
- [2026-02-14] GitHub Actions for CI/CD — already in GitHub, matrix builds for Node 22, no additional tooling cost

## Database

- [2026-01-12] PostgreSQL 16 as primary datastore — ACID transactions for order/payment records, JSON columns for extensible product metadata — docs/adr/ADR-0003-drizzle-orm.md
- [2026-01-12] Drizzle ORM over Prisma — zero codegen at runtime, migrations are plain SQL files, 40% smaller bundle than Prisma client — docs/adr/ADR-0003-drizzle-orm.md
- [2026-03-01] Soft deletes only for orders and payments — `deletedAt` timestamp column, legal/audit requirement

## Authentication

- [2026-01-15] JWT with 15-minute access token + 7-day refresh token — stateless auth scales horizontally, refresh token stored in httpOnly cookie — docs/adr/ADR-0005-jwt-auth.md
- [2026-01-15] JWT_SECRET rotated quarterly — documented in runbook docs/runbooks/jwt-rotation.md

## API Design

- [2026-01-10] Fastify 5 over Express — 3× throughput at P99, native TypeScript plugin system, built-in JSON schema validation — docs/adr/ADR-0002-fastify.md
- [2026-01-20] Zod for runtime validation — single schema definition serves both TypeScript types and runtime guards, eliminates type/validation drift
- [2026-02-05] API versioning via URL prefix `/v1/` — simpler than header-based versioning for our client set, documented in openapi.yaml

## Frontend

- [2026-01-10] Frontend is a separate repo (`acme-corp/storefront`) — independent deploy cadence, different team ownership, Vercel manages its own CI

## Payments

- [2026-01-18] Stripe for payment processing — PCI compliance handled by Stripe, webhook-first model aligns with our async order processing — docs/adr/ADR-0006-stripe-payments.md
- [2026-03-10] Idempotency keys on all Stripe payment intents — prevents double-charges on network retry, key = `order_id:attempt_number`

## Testing

- [2026-01-10] Vitest over Jest — native ESM support, 10× faster with Fastify's plugin system, compatible with Node 22
- [2026-02-01] Separate integration test database (`orderflow_test`) — seeded from `tests/fixtures/`, torn down after each test file

## Monitoring & Observability

- [2026-02-20] Pino for structured logging — built into Fastify, zero-overhead JSON logging, Railway log drain to Datadog
- [2026-03-15] Datadog APM — Railway integration, distributed tracing across API and Stripe webhooks

---

> Last entry: [2026-03-15] Datadog APM
