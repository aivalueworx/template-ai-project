---
Last reviewed: 2026-04-02
---

# Observability & Audit Log Specification — OrderFlow API

## What is Logged (per agent invocation)

- **Who:** user ID or service account ID, session ID from JWT `jti` claim
- **What:** tool calls (function name, arguments, outputs), HTTP method + path, response status
- **When:** ISO8601 timestamp with millisecond precision — e.g. `2026-04-02T14:32:01.847Z`
- **Where:** `orderflow-api` service name, Railway environment (`production` / `staging`)
- **Why:** `traceId` propagated via `x-trace-id` header linking to parent Stripe event or user session

## Trace Structure

- `traceId`: UUID generated at request entry point — propagated to all downstream calls (Stripe, SendGrid, WMS webhook)
- `parentTaskId`: for webhook-triggered flows, links back to the originating Stripe event ID (e.g. `evt_1234`)
- `spanId`: individual operation within a trace (e.g. `db.query:orders.findById`, `stripe.refunds.create`)

## Retention Policy

- **Standard API logs:** 90 days (Railway log drain → Datadog)
- **Payment event logs:** 7 years (PCI-DSS requirement — archived to S3 after 90 days, Datadog for active period)
- **PII redaction:** Customer email, name, and card last4 are redacted in logs after 30 days. Raw payment data never logged — only Stripe IDs.

## Alert Thresholds

| Metric | Threshold | Action |
|---|---|---|
| API error rate (5xx) | > 1% over 5 minutes | PagerDuty page on-call |
| Webhook error rate | > 0% sustained 2 minutes | PagerDuty page on-call (zero-tolerance for webhook failures) |
| Token spend (Claude API) | > $10/day | Slack alert to `#eng-backend`, agent suspended |
| DB query P99 | > 500ms | Slack warning (non-paging) |
| Stripe API rate limit | Any 429 | Slack alert + automatic retry with exponential backoff |

## Log Storage

- **Active logs (0–90 days):** Datadog — Railway log drain, auto-ingested
- **Archived logs (90 days – 7 years):** AWS S3 (`s3://acme-corp-logs/orderflow/`) — lifecycle rule moves from Datadog after 90 days
- **Access control:** Datadog access — Backend Engineering team only. S3 — security team + compliance role only
- **Encryption:** at-rest (S3 SSE-S3, Datadog default encryption) + in-transit (TLS 1.3)

## Structured Log Format (Pino)

Every log line is JSON with these guaranteed fields:

```json
{
  "level": "info",
  "time": "2026-04-02T14:32:01.847Z",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "service": "orderflow-api",
  "env": "production",
  "method": "POST",
  "url": "/v1/orders/uuid/refund",
  "statusCode": 202,
  "responseTimeMs": 143,
  "userId": "user_abc123",
  "msg": "Refund initiated successfully"
}
```

Error logs additionally include `errorCode`, `errorMessage` (sanitised), and `stack` (stripped in production).

## AI Activity Logging (Simon Willison Stack)

- **LLM CLI interactions:** automatically logged to `~/.llm/logs.db` via `llm` tool
  - Browse: `datasette $(llm logs path)`
  - Export: `llm logs -c` for latest conversation
- **Claude Code sessions:** stored in `~/.claude/projects/` — exported via `claude-code-transcripts`
  - Publish to Gist: `uvx claude-code-transcripts --gist` (keep private unless reviewed)
  - Archive locally: `uvx claude-code-transcripts all -o docs/transcripts/`
- **Transcript index:** `TRANSCRIPT_LOG.md` — one row per significant session linking commit SHA → Gist URL
- **Why this matters:** AI session transcripts capture the *reasoning* behind commits — the decisions made, alternatives rejected, and context that never makes it into code comments

## Dashboards

| Dashboard | URL | What it shows |
|---|---|---|
| API overview | [Datadog](https://app.datadoghq.com/dashboard/xyz) | Request rate, error rate, P50/P95/P99 latency |
| Stripe webhook health | [Datadog](https://app.datadoghq.com/dashboard/xyz2) | Webhook success rate, retry queue depth |
| DB performance | [Datadog](https://app.datadoghq.com/dashboard/xyz3) | Query P99, connection pool utilisation |
| Railway deploy history | [Railway](https://railway.app/project/xyz) | Deploy log, rollback capability |
