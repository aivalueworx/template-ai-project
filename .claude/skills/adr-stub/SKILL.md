# Skill: adr-stub

> Creates an Architecture Decision Record stub when a significant decision is made.
> The human fills in Decision, Rationale, and Consequences. The AI never fills these.
> Invoke with: `/adr-stub` or "create an ADR for [decision]"

## When to Use

Create an ADR stub when:
- Adding a new significant library or framework
- Choosing between two or more architectural approaches
- Changing the database schema in a breaking way
- Introducing a new pattern that others must follow
- Making a performance, security, or cost trade-off

## Steps

1. **Determine the next ADR number**
   ```bash
   ls docs/adr/ | sort | tail -1
   ```

2. **Create the file** at `docs/adr/ADR-{NNN}-{kebab-case-title}.md`

3. **Fill in the scaffold** (AI fills: Context and Options only — never Decision/Rationale/Consequences):

```markdown
---
Status: Proposed
Date: {TODAY}
Deciders: <!-- HUMAN-AUTHORED: who made this decision -->
---

# ADR-{NNN}: {Title}

## Status

Proposed

## Context

{Describe the situation and forces at play — AI can write this from what it knows}

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| {A} | … | … |
| {B} | … | … |

## Decision

<!-- HUMAN-AUTHORED: Fill in the chosen option and brief reasoning -->

## Rationale

<!-- HUMAN-AUTHORED: Why this option over the alternatives -->

## Consequences

<!-- HUMAN-AUTHORED: What becomes easier/harder as a result -->

## References

- [Link to relevant docs, issues, or discussions]
```

4. **Add an entry to DECISIONS.md**:
   ```
   - [{TODAY}] {Brief decision summary} — see docs/adr/ADR-{NNN}-{title}.md
   ```

5. **Notify the human**: "ADR stub created at `docs/adr/ADR-{NNN}-{title}.md`. Please fill in the Decision, Rationale, and Consequences sections before marking Status: Accepted."
