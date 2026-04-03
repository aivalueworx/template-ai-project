# ARCHITECTURE.md

## Layer intent
- `apps/web` -> fast front door and user interaction
- `apps/api` -> persistent runtime for agent entrypoints and orchestration handoff
- `apps/worker` -> background loops and long-running logic
- `apps/trigger` -> durable async workflows
- `packages/agents` -> orchestration logic
- `packages/skills` -> reusable tool wrappers
- `packages/prompts` -> prompt assets
- `packages/contracts` -> output contracts and checks
