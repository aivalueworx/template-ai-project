---
applies_to: ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/*.spec.tsx"]
---

# Test Rules (Claude Code — scoped to test files)

## Core Rules

- **Never** modify a test to make it pass — fix the source code instead.
  This is the "AI rewrites the test" anti-pattern. It destroys the value of tests.
- Test behaviour, not implementation. Test what the function does, not how it does it.
- Never mock the unit under test — only mock its dependencies.

## Test Structure

```typescript
describe("functionName", () => {
  it("should [expected behaviour] when [condition]", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Coverage Requirements

- Minimum 80% line coverage (enforced in CI).
- Every new exported function must have at least one test.
- Every error path must have at least one test.
- Edge cases to always cover: `null`, `undefined`, empty string, empty array, zero.

## Anti-Patterns (Do Not Do)

- `expect(true).toBe(true)` — meaningless assertion.
- Commenting out `expect()` calls to unblock CI.
- Testing private implementation details via `(module as any).__private`.
- Using `Date.now()` directly in tests — mock the clock.

## When Adding Tests

- Co-locate: `user-service.test.ts` next to `user-service.ts`
- Import only from the public module boundary — same imports a consumer would use.
- Clean up all test state in `afterEach` or `afterAll`.
