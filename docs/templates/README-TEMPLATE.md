# [Project Name]

> One-line description of what this project does.

![Build](https://github.com/[org]/[repo]/actions/workflows/api-docs.yml/badge.svg)
![License](https://img.shields.io/github/license/[org]/[repo])

<!-- HUMAN-AUTHORED: Do not modify this section automatically -->
## Overview

[Describe the purpose, audience, and context of this project.]
<!-- END HUMAN-AUTHORED -->

## Architecture

[High-level diagram or description of components]

## Prerequisites

- Node.js >= 20 / Python >= 3.11 (adjust as needed)
- [List other required tools]

## Installation

```bash
git clone https://github.com/[org]/[repo].git
cd [repo]
npm install        # or pip install -r requirements.txt
cp .env.example .env
```

## Usage

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Configuration

| Variable | Description | Default | Required |
|---|---|---|---|
| `PORT` | Server port | `3000` | No |
| `DATABASE_URL` | Postgres connection string | — | Yes |

## Testing

```bash
npm test                    # All tests
npm run test:coverage       # With coverage report
```

## Deployment

See [docs/runbooks/](./docs/runbooks/) for deployment runbooks.

<!-- HUMAN-AUTHORED: Do not modify this section automatically -->
## Contributing

[Describe branching strategy, PR process, and coding standards.]
<!-- END HUMAN-AUTHORED -->

## Ownership

- **Team:** [Team name]
- **Slack:** [#channel]
- **On-call:** [Link to PagerDuty / incident runbook]

---
Last reviewed: [AUTO-UPDATED]
