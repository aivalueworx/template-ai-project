# EDGE-CONSTRAINTS.md

## Use this template when
- the request/response path should stay fast
- the logic is lightweight
- geography or edge routing matters
- session state can stay small

## Escalate to a heavier runtime when
- you need browser automation
- you need heavy CPU work
- you need long-running background jobs
- you need broad OS or native dependency support
