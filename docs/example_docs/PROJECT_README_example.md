# OrderFlow API

> REST API for order lifecycle management — cart checkout through refund processing.
> Consumed by the Acme Corp storefront and internal warehouse management system.

![Build](https://github.com/acme-corp/orderflow-api/actions/workflows/api-docs.yml/badge.svg)
![License](https://img.shields.io/github/license/acme-corp/orderflow-api)

## Overview

OrderFlow API manages the complete order lifecycle for the Acme Corp e-commerce platform.
It handles checkout initiation, Stripe payment processing, warehouse fulfilment handoff via
webhook, shipment tracking updates, and customer-initiated refunds. It is a Fastify REST API
backed by PostgreSQL, deployed on Railway.

## Architecture

```
Storefront (Vercel/Next.js)
    ↓ REST API calls (Bearer JWT)
OrderFlow API (Railway/Fastify)
    ↓                    ↓
PostgreSQL (Railway)   Stripe (payments + refunds)
                         ↓ webhooks
                       OrderFlow API (webhook handler)
                         ↓
                       SendGrid (transactional email)
                       WMS webhook (warehouse dispatch)
```

## Prerequisites

- Node.js >= 22
- PostgreSQL >= 16
- Stripe account (test keys for development)
- Railway CLI (for deployment): `npm install -g @railway/cli`

## Installation

```bash
git clone https://github.com/acme-corp/orderflow-api.git
cd orderflow-api
npm install
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY in .env
npm run db:migrate   # Run all pending migrations
npm run dev          # Start dev server on http://localhost:3000
```

## Usage

```bash
npm run dev          # Development server with hot reload
npm run build        # TypeScript compile → dist/
npm start            # Production server (after build)
npm test             # Unit + integration tests
npm run test:watch   # Watch mode
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit (no emit)
npm run db:migrate   # Run pending Drizzle migrations
npm run db:generate  # Generate migration from schema changes
npm run db:studio    # Open Drizzle Studio (local DB browser on port 4983)
```

## Configuration

| Variable | Description | Default | Required |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — | Yes |
| `JWT_SECRET` | Secret for signing access tokens | — | Yes |
| `JWT_EXPIRY` | Access token expiry | `15m` | No |
| `PORT` | API listen port | `3000` | No |
| `LOG_LEVEL` | `debug\|info\|warn\|error` | `info` | No |
| `STRIPE_SECRET_KEY` | Stripe API key | — | Yes (prod) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret | — | Yes (prod) |
| `SENDGRID_API_KEY` | SendGrid API key for email | — | Yes (prod) |
| `SENDGRID_REFUND_TEMPLATE_ID` | SendGrid template ID for refund emails | — | Yes (prod) |

## Testing

```bash
npm test                    # All tests (unit + integration)
npm run test:coverage       # With coverage report (HTML in coverage/)
```

Integration tests require a running PostgreSQL instance. Set `DATABASE_URL` to a test database
(default: `postgres://localhost:5433/orderflow_test`). The test suite seeds and tears down
fixtures automatically.

## API Reference

Full OpenAPI 3.1 spec: [API Docs](https://acme-corp.github.io/orderflow-api/) (GitHub Pages)

Key endpoints:
- `POST /v1/auth/token` — issue access + refresh tokens
- `GET /v1/orders` — list orders for authenticated user
- `POST /v1/orders` — create a new order (checkout)
- `POST /v1/orders/:id/refund` — initiate a full refund
- `GET /v1/orders/:id/refund` — get refund status
- `POST /v1/webhooks/stripe` — Stripe webhook receiver

## Deployment

See [docs/runbooks/](./docs/runbooks/) for deployment runbooks.

Staging: `railway up --environment staging`
Production: automated via GitHub Actions on merge to `main`

## Contributing

Branch strategy: `feature/*`, `fix/*`, `docs/*`, `chore/*`
PR process: PR → CI green → 1 human review → squash merge to main
Coding standards: see [CONVENTIONS.md](./CONVENTIONS.md)

## Ownership

- **Team:** Backend Engineering
- **Slack:** `#eng-backend`
- **On-call:** [PagerDuty — OrderFlow API](https://acme-corp.pagerduty.com/services/P123)
- **Runbooks:** [docs/runbooks/](./docs/runbooks/)

---
Last reviewed: 2026-04-02
