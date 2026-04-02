---
Last updated: 2026-04-02
---

# MEMORY.md — Memory Index

> Index of all memory files in `.claude/memory/`.
> Updated automatically by Claude whenever a memory file is created or modified.

## Files

| File | Contents | Last updated |
|---|---|---|
| `.claude/memory/general.md` | Cross-session preferences, environment facts | 2026-04-02 |
| `.claude/memory/domain/orders.md` | Order state machine, status transitions, business rules | 2026-03-28 |
| `.claude/memory/domain/payments.md` | Stripe integration patterns, idempotency approach, webhook gotchas | 2026-03-15 |
| `.claude/memory/tools/drizzle.md` | Drizzle ORM patterns, migration workflow, common query patterns | 2026-02-20 |

## Quick Recall

*5 most recently accessed facts:*

1. **Migration freeze** — `payments` table schema is frozen until v1.2 release (no schema changes this sprint)
2. **Refund idempotency key format** — `refund:{orderId}:{attemptNumber}` — never use just `orderId` alone
3. **Test database** — `orderflow_test` on `localhost:5433` (different port from dev DB on 5432)
4. **Stripe webhooks** — always call `stripe.webhooks.constructEvent()` first; raw body must be passed, not parsed JSON
5. **No hard deletes** — orders and payments use `deletedAt` soft delete — never `DELETE FROM orders`

---

## How to Use Memory

- **Save something:** "remember that X" or "add to memory: X"
- **Recall something:** "check memory for X" or run `/memory`
- **Reorganise:** "reorganise memory" — agent deduplicates and re-sorts
- **View all files:** run `/memory` in Claude Code
