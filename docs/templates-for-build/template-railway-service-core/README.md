# template-railway-service-core

Starter repository for persistent backend services on Railway.

## Best fit
- APIs
- dashboards
- background workers
- ingestion pipelines
- browser automation
- Python or full Node backends
- MCP or tool servers

## Includes
- monorepo with API and worker apps
- shared package
- Railway config files for each service
- CI workflow
- deploy workflows for API and worker
- healthcheck and worker placeholders

## Quick start
1. Install dependencies from the repo root.
2. Copy `.env.example` to `.env` if needed locally.
3. Run `npm run dev:api` or `npm run dev:worker`.
4. Create matching Railway services and point each at the correct subdirectory config.
