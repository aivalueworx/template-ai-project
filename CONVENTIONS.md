---
Last reviewed: REPLACE-WITH-DATE
Owner: Engineering Team
---

# CONVENTIONS.md — Coding Standards & Naming Rules

> This file is the authoritative source for coding standards.
> AI agents must follow these rules. Humans update this file when standards evolve.

## Language & Typing

- TypeScript strict mode (`"strict": true` in tsconfig.json)
- No `any` — use `unknown` + type guard or proper generic
- No non-null assertion (`!`) without a comment explaining why it's safe
- Prefer `interface` over `type` for object shapes; use `type` for unions/intersections

## File & Folder Naming

- Files: `kebab-case.ts` (e.g. `user-service.ts`, `auth-middleware.ts`)
- Components: `PascalCase.tsx` (e.g. `UserCard.tsx`)
- Test files: co-located `*.test.ts` or `*.spec.ts`
- Index files: allowed only in `components/` and `lib/` directories

## Import Rules

- Use absolute imports via `@/` alias — never `../../..`
- Group imports: external packages → internal `@/` → relative (only if same dir)
- No barrel imports that cause circular dependencies

## Function & Variable Naming

- Functions: camelCase, imperative verb (`getUser`, `createOrder`, `handleError`)
- React components: PascalCase
- Constants: SCREAMING_SNAKE_CASE for module-level constants
- Boolean variables: prefix with `is`, `has`, `can`, `should`

## Error Handling

- Never swallow errors silently — log or re-throw
- Use typed error classes (extend `Error`) for domain errors
- API routes: always return structured `{ code, message }` error responses

## Testing

- Test runner: Vitest
- Co-locate tests with source: `user-service.test.ts` next to `user-service.ts`
- Coverage threshold: 80% lines (enforced in CI)
- Test naming: `describe('functionName') > it('should [expected behaviour] when [condition]')`

## Git & Commits

- Branches: `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`
- Commits: conventional commits — `type(scope): description`
- PR titles: same format as commit messages
- No WIP commits to `main` — squash or rebase before merging

## Documentation

- Every exported function: TSDoc with `@param`, `@returns`, `@throws`, `@example`
- New npm packages added: update DECISIONS.md with rationale
- New services/routes: update openapi.yaml before or alongside the code
