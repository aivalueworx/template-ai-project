---
Status: Accepted
Date: 2026-04-02
Deciders: Engineering Team
---

# ADR-0001: Record Architecture Decisions

## Status

Accepted

## Context

When making significant architectural decisions, we need a way to capture the reasoning
behind them so future engineers (and AI agents) understand not just *what* was decided
but *why*. Without this, the same debates get relitigated, and AI tools may reverse
decisions they don't know the rationale for.

## Decision

We will use Architecture Decision Records (ADRs), stored as individual Markdown files
in `docs/adr/`, to record all significant architectural decisions.

Each ADR is:
- Numbered sequentially (0001, 0002, …)
- Immutable once `Status: Accepted` — never edited, only superseded
- Linked from `DECISIONS.md` (the lightweight index)
- Protected by CODEOWNERS from AI modification

## Rationale

ADRs were introduced by Michael Nygard. The key insight is that architecture is largely
about decisions, and losing the context of those decisions is expensive. Having a
permanent record prevents:
- "Why did we do it this way?" questions from new engineers
- AI agents reversing decisions without knowing the trade-offs
- Repeated architectural debates about settled questions

## Consequences

- Adds a small overhead per significant decision (creating the stub, filling it in)
- Future engineers and AI agents have authoritative context for every major choice
- When decisions are superseded, the old ADR remains with a link to the new one
- CODEOWNERS protection means AI tools cannot silently alter decision rationale

## References

- [Michael Nygard — Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr.github.io](https://adr.github.io/) — community resources and tooling
