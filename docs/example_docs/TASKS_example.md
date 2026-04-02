---
References: PLAN_example.md (Order Refund API)
Last updated: 2026-04-02
---

# TASKS: Order Refund API

## Milestone 1: Schema + Service

- [x] Task 1.1: Write Drizzle schema for `refunds` table in `src/db/schema.ts`
- [x] Task 1.2: Run `npm run db:generate` → verify migration `0007_add_refunds_table.sql` generated
- [x] Task 1.3: Run migration against local DB — confirm table created with all indexes
- [x] Task 1.4: Create `src/services/refund-service.ts` with `initiateRefund()` and `updateRefundStatus()`
- [x] Task 1.5: Write unit tests `src/services/refund-service.test.ts` — 12 tests, all passing
- [x] Task 1.6: Add TSDoc to all exported functions in refund-service.ts

## Milestone 2: Route Handlers

- [x] Task 2.1: Add `POST /v1/orders/:id/refund` route to `src/routes/orders.ts`
- [x] Task 2.2: Add `GET /v1/orders/:id/refund` route to `src/routes/orders.ts`
- [x] Task 2.3: Create Zod schemas for request/response in `src/types/refund.ts`
- [x] Task 2.4: Update `openapi.yaml` — both new endpoints with full response schemas
- [x] Task 2.5: Manual curl test all status codes (200, 202, 404, 409, 422) against local server

## Milestone 3: Webhook Handler

- [ ] Task 3.1: Add `charge.refund.updated` case to `src/routes/webhooks.ts`
- [ ] Task 3.2: Call `RefundService.updateRefundStatus()` with Stripe event data
- [ ] Task 3.3: Trigger SendGrid email on refund status change to `SUCCEEDED`
- [ ] Task 3.4: Test with Stripe CLI: `stripe trigger charge.refund.updated`

## Milestone 4: Integration Tests

- [ ] Task 4.1: Create fixture `tests/fixtures/completed-order.ts` with a refundable order seed
- [ ] Task 4.2: Write happy path integration test — initiate refund, simulate webhook, verify status
- [ ] Task 4.3: Write error path tests — wrong status, expired window, duplicate request
- [ ] Task 4.4: Confirm CI passes on PR branch

## Discovered During Execution

- [x] Task D1: Add `stripeRefundId` unique index — discovered during webhook handler design that we need to upsert on this field safely
- [ ] Task D2: Add `refunds` to Drizzle Studio schema view — discovered it's not auto-included without a re-export

## Blocked

- [ ] Task B1: Partial refund endpoint — blocked by: product owner hasn't clarified line-item vs full-order scope (see HANDOFF.md)
