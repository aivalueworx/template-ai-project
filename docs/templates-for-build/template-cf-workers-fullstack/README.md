# template-cf-workers-fullstack

Starter repository for edge-first full-stack apps and APIs on Cloudflare Workers.

## Best fit
- edge APIs
- webhook ingress
- lightweight chat endpoints
- auth/proxy/rate limit layers
- lightweight LLM routing
- session coordination with Durable Objects
- queue and workflow primitives

## Includes
- Worker entrypoint and route handling
- Durable Object placeholder
- queue consumer placeholder
- workflow placeholder
- `wrangler.jsonc`
- CI and deploy workflows

## Quick start
1. Install dependencies.
2. Copy `.dev.vars.example` to `.dev.vars`.
3. Run `npm run dev`.
4. Add your Cloudflare account secrets before enabling deploys.
