# template-agent-runtime-hybrid

Starter repository for AI products with agents, skills, async orchestration, and mixed runtimes.

## Best fit
- AI apps
- research systems
- multi-step generation flows
- approval-based automation
- realtime chat plus background work
- apps where a user needs fast UI while heavier work continues elsewhere

## Default stack encoded by this template
- web/front door: Cloudflare Workers or Vercel
- persistent core runtime: Railway
- durable workflow layer: Trigger.dev
- auth/data/storage: Supabase or Convex

## Includes
- monorepo layout for web, API, worker, and trigger tasks
- packages for agents, skills, prompts, contracts, and shared utilities
- baseline docs for architecture, contracts, and failure modes
- CI workflow
- placeholder deploy workflows

## Quick start
1. Decide whether `apps/web` will deploy to Cloudflare or Vercel.
2. Fill in the planning files before coding.
3. Add your chosen platform env variables.
4. Replace placeholder agents, skills, prompts, and contracts with your real workflow logic.
