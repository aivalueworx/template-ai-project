---
applies_to: ["src/routes/**", "src/controllers/**", "src/api/**"]
---

# API Rules (Claude Code — scoped to route/controller files)

## Mandatory Before Modifying Any Route

1. Read `openapi.yaml` — the route you are touching MUST have a corresponding path entry.
2. If a new route is added, add the OpenAPI path entry **before** writing the handler code.
3. Never remove existing `responses` entries from `openapi.yaml` — only add.

## Request/Response Contract

- All handlers must return `{ code: string, message: string, data?: unknown }` on error.
- Validate all request body fields before processing — reject with `400` if invalid.
- Authentication: check at route level via middleware, not inside handler logic.
- Authorisation: check `req.user` permissions before accessing any resource.

## Error Handling

```typescript
// Required pattern for API error responses
return res.status(400).json({
  code: "VALIDATION_ERROR",
  message: "Descriptive message safe to show users",
});
```

- Never expose stack traces, file paths, or internal service names in API responses.
- Log the full error internally; return only `code` + `message` to clients.

## When You Finish

- Update `openapi.yaml` to match all changes.
- Run Stage 4D (API Contract Check) from `CHALLENGE_PROMPTS.md`.
- Update `CHANGELOG.md`.
