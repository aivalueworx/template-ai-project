---
MCP Protocol Version: 2025-03-26
Last reviewed: 2026-04-02
---

# Tool Registry — OrderFlow API

> Documents all MCP-registered agent-callable tools.
> Distinct from `openapi.yaml` (human-facing REST API).

---

## Registered Tools

### get-order

| Field | Value |
|---|---|
| Description | Fetch a single order by ID with full line items and payment status |
| Side effects | read-only |
| Idempotent | Yes |
| Auth required | Yes — service JWT with `orders:read` scope |
| Rate limit | 100 calls/min per agent |

**Input Schema:**
```json
{
  "orderId": { "type": "string", "format": "uuid", "description": "Order UUID" }
}
```

**Output Schema:**
```json
{
  "order": {
    "id": { "type": "string" },
    "status": { "type": "string", "enum": ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"] },
    "totalPaidCents": { "type": "integer" },
    "lineItems": { "type": "array" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

**Error codes:**
- `ORDER_NOT_FOUND` — orderId does not exist
- `PERMISSION_DENIED` — agent lacks `orders:read` scope
- `TOOL_TIMEOUT` — DB query exceeded 5s

**Idempotency key:** N/A (read-only)

---

### initiate-refund

| Field | Value |
|---|---|
| Description | Initiate a full refund for an order. Calls Stripe refunds.create() and writes to refunds table. |
| Side effects | write — creates refund record + Stripe API call |
| Idempotent | Yes — idempotency key is `refund:{orderId}:{5-min-bucket}` |
| Auth required | Yes — service JWT with `refunds:write` scope |
| Rate limit | 10 calls/min per agent (Stripe rate limit protection) |

**Input Schema:**
```json
{
  "orderId": { "type": "string", "format": "uuid" },
  "requestedBy": { "type": "string", "description": "Agent ID or user ID initiating the refund" }
}
```

**Output Schema:**
```json
{
  "refundId": { "type": "string", "format": "uuid" },
  "status": { "type": "string", "enum": ["PENDING", "SUCCEEDED", "FAILED"] },
  "estimatedSettlementDays": { "type": "integer" }
}
```

**Error codes:**
- `ORDER_NOT_REFUNDABLE` — order status is not DELIVERED or COMPLETED
- `REFUND_WINDOW_EXPIRED` — order is older than 30 days
- `REFUND_ALREADY_EXISTS` — a refund is already in progress for this order
- `STRIPE_ERROR` — Stripe API returned an error (details in logs)
- `PERMISSION_DENIED` — agent lacks `refunds:write` scope

**Idempotency key:** `refund:{orderId}:{Math.floor(Date.now()/300000)}`

---

### check-doc-freshness

| Field | Value |
|---|---|
| Description | Run the doc staleness checker and return a list of stale or missing-date files |
| Side effects | read-only |
| Idempotent | Yes |
| Auth required | No |
| Rate limit | 5 calls/min (I/O bound) |

**Input Schema:**
```json
{
  "thresholdDays": { "type": "integer", "default": 90, "description": "Days before a doc is stale" },
  "docsDir": { "type": "string", "default": "docs/", "description": "Directory to scan" }
}
```

**Output Schema:**
```json
{
  "staleFiles": { "type": "array", "items": { "type": "string" } },
  "checkedCount": { "type": "integer" },
  "allFresh": { "type": "boolean" }
}
```

**Error codes:**
- `DOCS_DIR_NOT_FOUND` — specified docsDir does not exist
- `TOOL_TIMEOUT` — scan took longer than 10s (large repo)
