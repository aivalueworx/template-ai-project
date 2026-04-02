---
Last reviewed: REPLACE-WITH-DATE
---

# Observability & Audit Log Specification

## What is Logged (per agent invocation)
- Who: user/agent identity, session ID
- What: tool calls, arguments, outputs
- When: timestamp (ISO8601, ms precision)
- Where: system, data sources accessed
- Why: traceId linking to parent task/conversation

## Trace Structure
- traceId: propagated across full delegation chain
- parentTaskId: links sub-agent work to parent contract
- spanId: individual tool call within a trace

## Retention Policy
- Standard: 90 days
- Compliance/regulated: 7 years (EU AI Act high-risk)
- PII redaction: [describe approach]

## Alert Thresholds
- Error rate > [X]%: page on-call
- Token spend > [budget ceiling]: alert + suspend
- Tool call rate anomaly: flag for review

## Log Storage
- Location: [e.g. CloudWatch / Datadog / self-hosted]
- Access control: [who can query logs]
- Encryption: at-rest + in-transit

## AI Activity Logging (Simon Willison Stack)
- All CLI LLM interactions logged to: ~/.llm/logs.db (via `llm` tool)
- Claude Code session transcripts: ~/.claude/projects/ → exported via claude-code-transcripts
- Transcript index: TRANSCRIPT_LOG.md (one line per significant session)
