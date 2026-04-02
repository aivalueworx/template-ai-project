---
Status: Approved
Date: 2026-03-26
References: PRD_example.md (Order Refund API)
Author: James Okafor (Engineering Lead)
---

# PLAN: Order Refund API

## Architecture Decisions

Following the established layer pattern (routes → services → db):
- Route handler in `src/routes/orders.ts` (existing file, new handler)
- Business logic in `src/services/refund-service.ts` (new file)
- Stripe calls isolated in `src/lib/stripe.ts` (existing wrapper)
- New `refunds` table — does NOT modify existing `orders` table (lower blast radius)

Idempotency approach: idempotency key = `refund:{orderId}:{Math.floor(Date.now()/300000)}`
(rounds to 5-minute buckets). Matches the PRD requirement of "same request within 5 minutes."

## Component Design

```
POST /v1/orders/:id/refund
    └── orders.ts route handler
            ├── Validate auth (JWT middleware — existing)
            ├── Parse + validate request (Zod schema)
            ├── RefundService.initiateRefund(orderId, userId)
            │       ├── Fetch order from DB — verify status + age
            │       ├── Check for existing active refund (idempotency)
            │       ├── Insert refund row (status: PENDING)
            │       └── stripe.refunds.create({ charge, idempotencyKey })
            └── Return { refundId, status: 'PENDING', estimatedDays: 5-10 }

STRIPE WEBHOOK: charge.refund.updated
    └── webhooks.ts route handler (existing file, new case)
            └── RefundService.updateRefundStatus(stripeRefundId, status)
                    └── UPDATE refunds SET status = $1 WHERE stripeRefundId = $2
```

## Data Model Changes

New table: `refunds`

```sql
CREATE TABLE refunds (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id),
  stripe_refund_id VARCHAR(255) UNIQUE,
  status        VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  amount_cents  INTEGER NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL UNIQUE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX refunds_order_id_idx ON refunds(order_id);
```

No changes to `orders` table (migration freeze constraint honoured).

## API Changes

New endpoints — full spec in `openapi.yaml`:
- `POST /v1/orders/{orderId}/refund` → 202 / 409 / 422 / 404
- `GET /v1/orders/{orderId}/refund` → 200 / 404

Existing `charge.refund.updated` webhook case added to `POST /v1/webhooks/stripe`.

## Risk & Unknowns

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stripe refund API latency spike | Low | Async initiation — we return 202 immediately, webhook updates status |
| DB migration breaks staging deploy | Medium | Test migration against a dump of prod schema first |
| Idempotency window too short (5 min) | Low | PRD says "within 5 minutes" — can be tuned later without schema change |
| Webhook arrives before DB insert completes | Low | Webhook handler upserts on `stripeRefundId` — safe |

## Execution Phases

1. **Phase 1 — Schema + Service** — create `refunds` table migration, `RefundService` with unit tests. Acceptance: `npm test` green, migration runs cleanly on local DB.
2. **Phase 2 — Route handlers** — `POST` and `GET` endpoints, `openapi.yaml` updated, Zod schemas. Acceptance: curl tests against local Fastify pass all status codes from PRD.
3. **Phase 3 — Webhook handler** — `charge.refund.updated` case in `webhooks.ts`. Acceptance: Stripe CLI test event updates refund status in DB.
4. **Phase 4 — Integration tests** — full happy path + error paths in `tests/integration/`. Acceptance: CI green on PR.
