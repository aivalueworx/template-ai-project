---
Last updated: REPLACE-WITH-DATE
---

# TRANSCRIPT_LOG.md

> Index of significant AI session transcripts for this project.
> Entries link Claude Code / Cursor / LLM CLI sessions to the commits they produced.
> Transcripts stored as private GitHub Gists (not public search-indexed).
> Update this file at the end of any session that makes significant decisions.

## How to Capture a Transcript

### Claude Code session:
```bash
uvx claude-code-transcripts --gist    # select session → auto-publishes to Gist
uvx claude-code-transcripts all -o docs/transcripts/   # archive all sessions locally
```

### LLM CLI session:
```bash
llm logs -c                            # view latest conversation
llm logs -cue                          # copy url-encoded for sharing
datasette $(llm logs path)             # browse full history as web app
```

### Generate docs from tests:
```bash
files-to-prompt tests/ -e py -c | llm -m claude-3.7-sonnet -s 'write usage docs from these tests'
```

## Session Index

| Date | Commit SHA | Description | Gist Link |
|------|-----------|-------------|-----------|
| YYYY-MM-DD | `abc1234` | [What was decided/built] | [private gist URL] |

## Notes
- Keep Gist visibility PRIVATE unless content has been human-reviewed
- Cross-reference significant decisions into DECISIONS.md and/or docs/adr/
- Transcripts capture reasoning chains — they are the "why" behind commits
