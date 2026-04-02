---
Last updated: 2026-04-02
---

# TRANSCRIPT_LOG.md

> Index of significant AI session transcripts for OrderFlow API.
> Entries link Claude Code / Cursor / LLM CLI sessions to the commits they produced.
> Transcripts stored as private GitHub Gists (not public search-indexed).
> Update this file at the end of any session that makes significant decisions.

## How to Capture a Transcript

### Claude Code session:
```bash
uvx claude-code-transcripts --gist    # select session → auto-publishes to Gist
uvx claude-code-transcripts all -o docs/transcripts/   # archive all sessions locally
```

### LLM CLI session:
```bash
llm logs -c                            # view latest conversation
datasette $(llm logs path)             # browse full history as web app
```

## Session Index

| Date | Commit SHA | Description | Gist Link |
|------|-----------|-------------|-----------|
| 2026-01-10 | `f2a1b3c` | Initial project scaffold — Fastify + Drizzle + Railway setup, ADRs 0002–0004 | [gist](https://gist.github.com/peterjabraham/abc123) |
| 2026-01-18 | `8d4e921` | Stripe payment integration — payment intent flow, webhook handler, ADR-0006 | [gist](https://gist.github.com/peterjabraham/def456) |
| 2026-02-05 | `3c7f019` | JWT auth implementation — access + refresh token flow, rotation runbook | [gist](https://gist.github.com/peterjabraham/ghi789) |
| 2026-03-01 | `1a9b445` | Soft delete migration for orders and payments — legal requirement, ADR-0007 | [gist](https://gist.github.com/peterjabraham/jkl012) |
| 2026-04-02 | `a4f892c` | Refund API implementation — RefundService, Stripe refunds.create, openapi.yaml update | [gist](https://gist.github.com/peterjabraham/mno345) |

## Notes

- Keep Gist visibility PRIVATE unless content has been human-reviewed
- Cross-reference significant decisions into DECISIONS.md and/or docs/adr/
- Transcripts capture reasoning chains — they are the "why" behind commits
- The 2026-01-18 Stripe session is the most important reference for payment-related work
