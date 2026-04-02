---
Status: Accepted
Date: 2026-01-10
Deciders: James Okafor (Engineering Lead), Sarah Mitchell (Product), CTO sign-off
---

# ADR-0002: Use Fastify 5 as the HTTP Framework

## Status

Accepted

## Context

OrderFlow API needs an HTTP framework for Node.js 22. The two primary candidates were
Express 5 and Fastify 5. The API is expected to handle 500 concurrent requests at peak
(Black Friday), with P99 response times under 200ms for order reads. Type safety and
developer experience matter given the team is 4 engineers, all TypeScript-first.

We also evaluated NestJS but ruled it out early — the abstraction overhead is significant
for a team this size and the opinionated DI system would constrain future architectural
changes.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Fastify 5** | ~80,000 req/s vs Express's ~35,000; native TypeScript plugin system; built-in JSON schema validation (no separate middleware); first-class async/await; Pino logging built in | Smaller ecosystem than Express; fewer StackOverflow answers; learning curve for Express-familiar engineers |
| **Express 5** | Ubiquitous; enormous ecosystem; every engineer on the team has used it; stable API | No native TypeScript types (requires `@types/express`); JSON schema validation requires separate library; ~40% lower throughput than Fastify at P99; async error handling requires explicit try/catch everywhere |
| **NestJS** | Full enterprise framework; opinionated structure prevents architecture drift | Significant DI overhead; framework owns too much; overkill for a 4-engineer team; migration cost if we outgrow it |

## Decision

We will use **Fastify 5**.

## Rationale

Throughput was the deciding factor — we project 500 concurrent requests at peak and a 200ms
P99 SLA. Fastify's benchmark advantage is well-documented and reproducible. Express would
require significant optimisation effort (connection pooling, caching layers) to meet the same
SLA. Fastify gives us that headroom for free.

The built-in JSON schema validation (via Ajv) eliminates an entire category of middleware and
keeps validation co-located with route definitions — this aligns with our goal of keeping
routes self-documenting.

The TypeScript plugin system is a genuine advantage: `fastify.decorate()` + type augmentation
gives compile-time safety for request/reply extensions, which Express cannot provide.

## Consequences

- **Positive:** ~2× throughput headroom vs Express at peak load; validation is built-in; Pino structured logging is free; TypeScript plugin types are compile-time safe
- **Positive:** Fastify plugin architecture enforces encapsulation — each domain registers its own plugin, preventing the "god router" anti-pattern common in Express apps
- **Negative:** Engineers familiar with Express need ~1 week to internalise the plugin/decorator model
- **Negative:** Some npm packages only have Express middleware bindings — need to wrap or find Fastify equivalents
- **Watch:** Fastify 5 was released 2025-09 and has a smaller community than Fastify 4 — monitor for breaking changes in minor releases

## References

- [Fastify benchmarks](https://fastify.dev/benchmarks/)
- [Fastify v5 migration guide](https://fastify.dev/docs/v5/Reference/Migration-Guide-V5/)
- ADR-0003 (Drizzle ORM) was decided in the same session — the two decisions are complementary
