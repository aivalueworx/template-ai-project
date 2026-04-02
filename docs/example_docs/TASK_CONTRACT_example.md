---
Version: 1.0.0
Protocol: MCP 2025-03-26
Last reviewed: 2026-04-02
---

# Task Contract: CodeReviewTask

> Defines the protocol for delegating a code review task from the orchestrator agent
> to the `code-review` sub-agent. Used when PR review automation is triggered.

---

## Task Proposal Schema

```json
{
  "taskId": "550e8400-e29b-41d4-a716-446655440000",
  "taskType": "CodeReviewTask",
  "requesterAgent": "orderflow-coding-agent-v1",
  "objective": "Review the diff for PR #47 (feat/order-refund-api) against the criteria in REVIEW.md Phase 5, and return a structured review report.",
  "input": {
    "prNumber": 47,
    "prTitle": "feat(orders): add refund initiation endpoint",
    "diffUrl": "https://github.com/acme-corp/orderflow-api/pull/47.diff",
    "contextFiles": ["AGENTS.md", "CONVENTIONS.md", "DECISIONS.md", "docs/adr/ADR-0006-stripe-payments.md"],
    "reviewPhase": "PHASE_5_PRE_MERGE"
  },
  "constraints": {
    "deadline": "2026-04-02T18:00:00Z",
    "maxCostUsd": 0.50,
    "dataSensitivity": "low",
    "requiresHumanApproval": false
  },
  "provenance": {
    "traceId": "trace-2026-04-02-pr47-review",
    "parentTaskId": null
  }
}
```

---

## Negotiation Response Schema

**Accepted example:**
```json
{
  "status": "accepted",
  "requiredArtifacts": ["pr-diff", "CONVENTIONS.md", "DECISIONS.md"]
}
```

**Counter-proposal example (if context window too large):**
```json
{
  "status": "counter_proposal",
  "reason": "Diff is 3,200 lines — exceeds single-pass context. Propose splitting into two review tasks: routes + services first, then tests.",
  "adjustedConstraints": {
    "maxCostUsd": 1.00
  }
}
```

**Rejected example:**
```json
{
  "status": "rejected",
  "reason": "dataSensitivity is 'high' but requiresHumanApproval is false — policy violation. Set requiresHumanApproval: true for high-sensitivity tasks."
}
```

---

## Policy Rules

- `dataSensitivity = "high"` → `requiresHumanApproval` must be `true` (policy: payment/PII data reviews require human sign-off)
- `taskType = "DatabaseMigrationTask"` → `requiresHumanApproval` must be `true`
- `taskType = "DeploymentTask"` → `requiresHumanApproval` must be `true` regardless of sensitivity
- Any task touching `src/db/schema.ts` or `migrations/` → `dataSensitivity` must be at least `"moderate"`
- Budget ceiling for review tasks: $0.50 per PR review; escalate to human if diff exceeds 5,000 lines

---

## Delegation Chain

- **Authorised callers:** `orderflow-coding-agent-v1`, `github-actions[bot]` (PR automation)
- **Can delegate to:** `code-review` skill, `devils-advocate` skill
- **Budget conservation:** sub-task budget ≤ 25% of parent budget ($0.50 of $2.00 parent ceiling)

---

## Output Contract

The reviewing agent must return a Markdown document with:
1. One-sentence PR summary (`"This PR [does what] by [how], affecting [what systems]."`)
2. Structured review: `✅ Done well | ❌ Must fix | ⚠️ Should fix | 📄 Doc gaps | 🧠 Tribal knowledge risk`
3. Verdict: `GO` / `STOP (reason)`
4. Estimated review confidence: `HIGH` / `MEDIUM` / `LOW` (low = agent recommends human re-review)
