---
Last reviewed: 2026-03-22
Severity: P1
Status: Complete
---

# Postmortem: Stripe Webhook Processing Outage

> **This document is human-authored. Do not auto-generate or modify with AI tools.**

## Incident Summary

| Field | Detail |
|---|---|
| **Date** | 2026-03-18 |
| **Duration** | 2 hours 14 minutes (14:32 UTC – 16:46 UTC) |
| **Services affected** | OrderFlow API — Stripe webhook handler (`POST /v1/webhooks/stripe`) |
| **Impact** | 847 orders stuck in `PROCESSING` state; payment confirmations not sent; no orders were lost or double-charged |
| **SLA breach** | Yes — order confirmation SLA is 30 seconds; median confirmation delay was 134 minutes |
| **Incident commander** | James Okafor |

## Timeline

| Time (UTC) | Event |
|---|---|
| 14:32 | Stripe begins sending `payment_intent.succeeded` events for orders placed after 14:28 |
| 14:35 | OrderFlow API begins returning `400` to Stripe for all webhook events |
| 14:38 | Stripe retries webhook — same 400 response |
| 14:51 | First customer support ticket: "Order placed but no confirmation email received" |
| 15:03 | PagerDuty alert fires: `webhook-handler-error-rate > 5%` |
| 15:09 | On-call engineer (Priya Sharma) begins investigation |
| 15:22 | Root cause identified: `STRIPE_WEBHOOK_SECRET` environment variable was empty after a Railway service restart that lost the variable |
| 15:30 | New `STRIPE_WEBHOOK_SECRET` value set in Railway; service redeployed |
| 15:47 | Webhook handler returns 200 to Stripe; Stripe begins delivering queued events |
| 16:46 | Last queued event processed; all 847 affected orders updated to `COMPLETED`; confirmation emails sent |

## Contributing Factors (Five Whys)

1. **Why did the webhook handler return 400?** → `stripe.webhooks.constructEvent()` threw because the webhook secret was empty
2. **Why was the secret empty?** → Railway restarted the service after a platform maintenance event and a known Railway bug dropped env vars that were set via API rather than through the dashboard
3. **Why was the secret set via API?** → The initial deployment script used `railway variables set` CLI, which uses the API — not reflected in the dashboard UI
4. **Why didn't we catch this before incident?** → No startup validation that verifies required env vars are non-empty; Railway's variable loss was not caught by our deploy health check
5. **Root cause:** Missing startup env var validation + Railway API-set variables not persisting through maintenance restarts

## Resolution

**Immediate mitigation:** Re-set `STRIPE_WEBHOOK_SECRET` via Railway dashboard (not CLI) and redeploy. Stripe's automatic retry mechanism delivered the 847 queued events within 60 minutes.

**Permanent fix (completed 2026-03-20):**
1. Added startup validation in `src/lib/config.ts` that throws at boot if any required env var is missing or empty — the service will fail fast rather than start in a broken state
2. Moved all critical secrets to Railway dashboard (not CLI) — dashboard variables survive maintenance restarts
3. Added `STRIPE_WEBHOOK_SECRET` to the CI smoke test: a startup probe now verifies the webhook endpoint returns 200 to a valid test event within 30 seconds of deploy

## Action Items

| Action | Owner | Due Date | Status |
|---|---|---|---|
| Add startup env var validation (`src/lib/config.ts`) | James Okafor | 2026-03-20 | Done |
| Move all secrets to Railway dashboard | Priya Sharma | 2026-03-21 | Done |
| Add `STRIPE_WEBHOOK_SECRET` presence to deploy health check | James Okafor | 2026-03-20 | Done |
| Update RUNBOOK: add Railway variable loss to known failure modes | James Okafor | 2026-03-22 | Done |
| File Railway bug report for API-set variable loss | Priya Sharma | 2026-03-22 | Done — ticket #4821 |
| Add PagerDuty alert: `webhook-success-rate < 95%` with 2-minute window | James Okafor | 2026-04-05 | Open |

## Lessons Learned

- **Railway API-set variables are not durable across maintenance restarts** — always set critical secrets via the dashboard UI for production services.
- **Services should fail fast on startup** rather than start in a degraded state. An empty webhook secret is a known-broken configuration; the service should refuse to start rather than return 400 to every Stripe event.
- **Stripe's retry mechanism saved us** — the 847 events were eventually delivered with no data loss. The retry buffer (~72 hours) gives a meaningful recovery window, but we got lucky that the incident was under 3 hours.
- **Alert threshold too conservative** — the `5% error rate` alert took 28 minutes to fire. For webhook handlers, any sustained error rate above 1% should page immediately.

## Appendix

- Railway maintenance event: [platform status page](https://status.railway.app/incidents/xyz)
- Stripe retry docs: [docs.stripe.com/webhooks#retries](https://docs.stripe.com/webhooks#retries)
- Fix PR: [#42 — Add startup env var validation](https://github.com/acme-corp/orderflow-api/pull/42)
- Datadog dashboard showing recovery: [link to screenshot]
