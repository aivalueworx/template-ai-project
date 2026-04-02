---
Version: 1.0.0
Protocol: MCP 2025-03-26
Last reviewed: REPLACE-WITH-DATE
---

# Task Contract: [TaskType Name]

## Task Proposal Schema
- taskId: string (UUID)
- taskType: enum [list valid types]
- requesterAgent: string
- objective: string
- input: Record<string, unknown>
- constraints:
  - deadline?: ISO8601
  - maxCostUsd?: number
  - dataSensitivity: "low" | "moderate" | "high"
  - requiresHumanApproval: boolean
- provenance:
  - traceId: string (required)
  - parentTaskId?: string

## Negotiation Response Schema
- status: "accepted" | "rejected" | "counter_proposal"
- reason?: string
- adjustedConstraints?: partial constraints
- requiredArtifacts?: string[]

## Policy Rules
- dataSensitivity = "high" → requiresHumanApproval = true
- [Add domain-specific rules]

## Delegation Chain
- Authorised callers: [list]
- Can delegate to: [list]
- Budget conservation: sub-budget ≤ parent budget
