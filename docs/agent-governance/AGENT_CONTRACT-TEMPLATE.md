---
Version: 1.0.0
Status: Draft
Parent contract: root
Last reviewed: REPLACE-WITH-DATE
---

# Agent Contract: [Agent Name]

## Identity
- Agent ID: [unique identifier]
- Purpose: [one sentence]
- Owner: [team or individual]

## Input Specification (I)
- Accepted input types: [schemas]
- Required fields: [list]
- Validation rules: [constraints]

## Output Specification (O)
- Output schema: [structure]
- Quality criteria: [measurable thresholds]
- Format: [JSON / Markdown / structured text]

## Skill Set (S)
- Tools available: [list of MCP tools / functions]
- Knowledge domains: [what the agent knows]
- Capabilities explicitly NOT granted: [blocklist]

## Resource Constraints (R)
- Max tokens per session: [N]
- Max cost per invocation: [$X]
- Max API calls per tool: [N]
- Rate limits: [per minute / per hour]

## Temporal Constraints (T)
- Max session duration: [X minutes]
- Deadline handling: [fail / escalate / handoff]
- Timeout per tool call: [X seconds]

## Success Criteria (Φ)
- [Output passes schema validation]
- [Confidence score ≥ 0.85]

## Termination Conditions (Ψ)
- Budget exhausted
- Deadline exceeded
- Human-in-the-loop escalation triggered

## Delegation Rules
- Can spawn sub-agents: [Yes / No]
- Sub-agent budget ceiling: [% of own budget]
- Requires human approval before delegating to: [list]
