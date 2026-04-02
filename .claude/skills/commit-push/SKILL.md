# Skill: commit-push

> Creates a conventional commit and pushes to the current branch.
> Invoke with: `/commit-push` or "commit and push"

## Conventional Commit Format

```
type(scope): description

[optional body]

[optional footer: BREAKING CHANGE: ...]
```

**Types:** `feat` | `fix` | `docs` | `refactor` | `test` | `ci` | `chore` | `perf` | `style`

**Scope:** the module, file group, or feature area affected (e.g. `auth`, `api`, `docs`, `ci`)

## Steps

1. **Stage all changes**
   ```bash
   git add -A
   ```

2. **Inspect what's staged**
   ```bash
   git diff --cached --stat
   ```

3. **Run pre-commit challenge** (Stage 3A from CHALLENGE_PROMPTS.md):
   - Any debug statements or `console.log`?
   - Any dead code or `TODO` in production paths?
   - Commit message accurately describes the change?

4. **Write the commit message** — be specific, present tense, imperative mood:
   ```
   feat(auth): add JWT refresh token rotation
   fix(api): return 404 instead of 500 for missing user
   docs(readme): update quick-start with Node 22 requirement
   ```

5. **Commit**
   ```bash
   git commit -m "type(scope): description"
   ```

6. **Push**
   ```bash
   git push origin HEAD
   ```

## Rules

- Never `--force` push to `main` or `master`.
- Never commit `.env`, secrets, or `node_modules`.
- If the pre-commit challenge finds blocking issues, STOP and fix them first.
- One logical change per commit — don't bundle unrelated fixes.
