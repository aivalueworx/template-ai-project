---
MCP Protocol Version: 2025-03-26
Last reviewed: REPLACE-WITH-DATE
---

# Tool Registry

> Documents all MCP-registered agent-callable tools.
> Distinct from openapi.yaml (human-facing REST API).

## Registered Tools

### [tool-name]

| Field | Value |
|---|---|
| Description | [What this tool does] |
| Side effects | [read-only / write / destructive] |
| Idempotent | [Yes / No] |
| Auth required | [Yes / No] |
| Rate limit | [X calls/min] |

**Input Schema:**
```json
{ "requiredParam": { "type": "string" } }
```

**Output Schema:**
```json
{ "result": { "type": "string" } }
```

**Error codes:**
- `TOOL_TIMEOUT` — did not respond within deadline
- `PERMISSION_DENIED` — agent lacks required scope
- `INVALID_INPUT` — input failed schema validation

**Idempotency key:** [field name]
