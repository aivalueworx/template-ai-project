# FAILURE-MODES.md

## Common failure modes
- user-facing request path does too much work
- async workflow has no durable retry or resume path
- agent output has no contract validation
- tool permissions are too broad
- live state and background state drift apart
