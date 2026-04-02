# Skill: doc-sync

> Syncs all documentation files after code changes, then commits and pushes.
> Invoke with: `/doc-sync` or "run doc-sync"

## When to Use

After completing any code change that touches:
- Route handlers or API endpoints
- Exported functions or public interfaces
- Database schema or migrations
- Configuration or environment variables
- Build or deployment process

## Steps

1. **Check what changed**
   ```bash
   git diff --name-only HEAD
   ```

2. **Sync README.md** — update any changed commands, config vars, or architecture notes (skip HUMAN-AUTHORED sections)

3. **Sync openapi.yaml** — if any route handler was added/modified/deleted

4. **Sync CHANGELOG.md** — add a Keep-a-Changelog entry under `[Unreleased]`:
   ```
   ### Added / Changed / Fixed / Removed
   - [description of change]
   ```

5. **Update DECISIONS.md** — if a new library, service, or significant pattern was introduced

6. **Create ADR stub** — if an architecturally significant decision was made (run `/adr-stub`)

7. **Update HANDOFF.md** — record what was completed, what is in progress, what is blocked

8. **Commit and push** — run `/commit-push`

## Rules

- Never modify `<!-- HUMAN-AUTHORED -->` sections.
- Never modify `docs/adr/` Decision or Rationale sections.
- Never modify `docs/postmortems/`.
- Update `Last reviewed: YYYY-MM-DD` frontmatter on any file you touch.
