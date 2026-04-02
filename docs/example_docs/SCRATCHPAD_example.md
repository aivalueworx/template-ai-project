# SCRATCHPAD — Order Refund API (Session 2026-04-02)

> Active working memory. Intentionally messy.
> DO NOT commit to main — gitignore or squash before merge.
> Use HANDOFF.md for clean session summaries.

## Current Focus

Building the `charge.refund.updated` webhook handler in `src/routes/webhooks.ts`.

The route already exists (handles `payment_intent.succeeded`). Need to add a new case in the
event type switch statement.

## Notes

**Stripe event payload shape (from Stripe docs + Stripe CLI test trigger):**
```json
{
  "type": "charge.refund.updated",
  "data": {
    "object": {
      "id": "re_abc123",
      "status": "succeeded",
      "charge": "ch_xyz789",
      "amount": 4999,
      "metadata": { "orderId": "uuid-here" }
    }
  }
}
```

**Question:** should we store the `charge` ID or look up via `metadata.orderId`?
→ Looking up via `stripeRefundId` (which is the `re_abc123` id) is safer — we set this
  when we call `refunds.create()` and it's indexed. Don't rely on metadata.

**Status mapping Stripe → our DB:**
- `pending` → `PENDING`
- `succeeded` → `SUCCEEDED`
- `failed` → `FAILED`
- `canceled` → `CANCELLED`

**SendGrid email trigger:**
Only send email on `SUCCEEDED` transition — not on intermediate states.
Email template ID: `d-4f8a2b3c1e9d` (stored in config.ts as `SENDGRID_REFUND_TEMPLATE_ID`)

## Questions

- [x] Do we need to verify the Stripe webhook signature inside the switch case or is it done at the route level?
  → **ANSWERED:** Verified at route level in the existing `preHandler` hook (`verifyStripeSignature`). Don't re-verify inside the switch.
- [ ] What happens if the webhook fires but the refund row doesn't exist in our DB yet?
  → **Plan:** Upsert on `stripeRefundId` — insert if not exists, update status if exists. This handles the race condition where webhook arrives before our DB write completes.

## Scratch Commands Run

```bash
stripe trigger charge.refund.updated --add data.object.metadata.orderId=test-order-id
# → Got 500 because updateRefundStatus was called with undefined — fixed: check if refund exists first

curl -X POST http://localhost:3000/v1/webhooks/stripe \
  -H "stripe-signature: test" \
  -d @/tmp/stripe-event.json
# → 400 signature verification failed in test — need to use stripe-mock or bypass in test env
```
