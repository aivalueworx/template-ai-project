---
Status: Approved
Date: 2026-03-25
Feature: Order Refund API
Author: Sarah Mitchell (Product)
Reviewed by: James Okafor (Engineering Lead)
---

# PRD: Order Refund API

## Problem Statement

Customers currently cannot self-serve refunds — they must contact support, who manually
processes refunds through the Stripe dashboard. This creates a 2–3 day average resolution
time and accounts for 34% of all support tickets. We need a programmatic refund endpoint
so the storefront and support tooling can trigger refunds directly.

## Goals

- Reduce refund-related support ticket volume by 60% within 30 days of launch
- Achieve sub-2-second refund initiation response time (P95)
- Zero double-charge incidents (idempotency must be enforced)
- Provide a refund status that the storefront can poll or receive via webhook

## Non-Goals

- **Partial refunds** (line-item level) — deferred to v1.2; too many edge cases around bundled shipping
- **Automated refund approval** — all refunds still require a support agent or customer-initiated trigger; no auto-approve rules this sprint
- **Refund reason analytics** — out of scope; will be addressed in the analytics sprint

## User Stories

- As a **customer**, I want to request a full refund on a delivered order within 30 days, so I don't have to contact support
- As a **support agent**, I want to initiate a refund from the admin tool using an order ID, so I can resolve tickets in one action
- As a **storefront frontend**, I want to poll refund status so I can show the customer accurate progress

## Acceptance Criteria

- [ ] `POST /v1/orders/:id/refund` returns `202 Accepted` with a `refundId` within 2 seconds
- [ ] Calling the same endpoint twice with the same order ID within 5 minutes returns the existing refund (idempotent)
- [ ] If the order is not in `DELIVERED` or `COMPLETED` status, return `409 Conflict` with code `ORDER_NOT_REFUNDABLE`
- [ ] If the order is older than 30 days, return `422 Unprocessable` with code `REFUND_WINDOW_EXPIRED`
- [ ] Stripe `charge.refund.updated` webhook updates refund status in DB
- [ ] `GET /v1/orders/:id/refund` returns current refund status and estimated settlement date
- [ ] All new endpoints documented in `openapi.yaml` before merging

## Business Rules

1. Refund window: 30 calendar days from `order.deliveredAt` timestamp
2. Eligible statuses: `DELIVERED`, `COMPLETED` only — `PROCESSING`, `SHIPPED`, `CANCELLED` are not refundable via this endpoint
3. Only one active refund per order at a time — concurrent refund requests must be rejected with `409`
4. Stripe is the system of record for refund status — our DB mirrors it via webhook
5. Refund amount = original `order.totalPaidCents` — no partial amounts this sprint
