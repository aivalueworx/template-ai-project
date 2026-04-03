# Which GitHub template should I use?

This guide describes the **core template set** for new projects: six separate starter repositories, each aligned to a **workload shape** and platform execution model—not a single “do everything” monorepo.

The templates live under the **aivalueworx** GitHub organization as [GitHub Template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template). Use **Use this template** on GitHub to create a new repo without forking.

---

## Why six templates instead of one?

- **GitHub Actions** is optimized for **repo-triggered, non-interactive** automation (CI, schedules, evals, artifacts).
- **Cloudflare Pages** fits **static or mostly static** sites with **light** edge logic (marketing, SEO, simple APIs via Pages Functions).
- **Cloudflare Workers** fits **edge-first, request-driven** apps (APIs, proxies, Durable Objects, queues, Workflows on the edge).
- **Railway** fits **persistent** services: full Node/Python runtimes, long-lived workers, heavier dependencies, browser automation.
- **Hybrid (agent runtime)** combines **fast surfaces + durable backends + long async workflows** (e.g. Trigger.dev) when a single runtime would be the wrong place for part of the work.

Choosing the wrong layer (e.g. running a heavy ML pipeline entirely in GitHub Actions because it is “free”) creates reliability and scaling debt. These templates encode a **decision tree** so you pick the natural home for each kind of work.

---

## Quick reference

| Template | Primary use | Not for |
|----------|-------------|---------|
| [template-stack-recommender](https://github.com/aivalueworx/template-stack-recommender) | **Planning only** — classify the project before code | Implementation code |
| [template-gh-automation](https://github.com/aivalueworx/template-gh-automation) | Repo automation, CI, schedules, evals, releases | User-facing web apps as the main runtime |
| [template-cf-pages-static](https://github.com/aivalueworx/template-cf-pages-static) | Static/marketing/SEO, light forms, edge middleware | Heavy APIs, long CPU work |
| [template-cf-workers-fullstack](https://github.com/aivalueworx/template-cf-workers-fullstack) | Edge APIs, webhooks, chat edges, DOs, queues | Full Node ecosystem, GPUs, long unconstrained compute |
| [template-railway-service-core](https://github.com/aivalueworx/template-railway-service-core) | APIs, workers, pipelines, automation backends | Pure static sites only |
| [template-agent-runtime-hybrid](https://github.com/aivalueworx/template-agent-runtime-hybrid) | Agents, skills, async jobs, multi-runtime AI products | A simple landing page |

---

## Recommended order of operations

1. **Start with classification**  
   Use [template-stack-recommender](https://github.com/aivalueworx/template-stack-recommender) (or copy its `plan/` files into an empty repo). Work through `plan/STACK-RECOMMENDER.md` and related plan docs **before** writing application code.

2. **Choose one implementation template**  
   Based on the decision rules below, create a new repository from **one** of the five implementation templates.

3. **Layer the compound documentation template (`template-ai-project`)**  
   Merge in [aivalueworx/template-ai-project](https://github.com/aivalueworx/template-ai-project) so the repo gets **AGENTS.md**, **CONVENTIONS.md**, **DECISIONS.md**, **HANDOFF.md**, **MEMORY.md**, **CHALLENGE_PROMPTS.md**, `.claude/` and `.cursor/rules/`, and the documentation workflows. See [Compound documentation template](#compound-documentation-template-template-ai-project) below for *why*, *how*, and what to avoid duplicating.

4. **Fill planning artifacts in the new repo**  
   Complete `ARCHITECTURE-DECISION.md`, `DELIVERY-PHASES.md`, `RISKS-AND-CONSTRAINTS.md`, and `REPO-SETUP.md` (from the stack template, or merged with `plan/` from the recommender) **and** personalise `AGENTS.md` / `CONVENTIONS.md` from `template-ai-project` so one written contract covers both **product delivery** and **agent process**.

5. **Add platform secrets and IDs**  
   Skeletons ship with placeholder configs (`wrangler.jsonc`, `railway.json`, `trigger.config.ts`, etc.). Replace placeholders with real project names, account IDs, and secrets via each platform’s dashboard or GitHub Actions secrets.

6. **Layer add-ons only when needed**  
   Auth, DB, Trigger.dev, Convex, etc. are **add-ons**, not assumed defaults for every project.

---

## Compound documentation template (`template-ai-project`)

The **stack templates** answer: *where does this workload run and how is it deployed?*  
[**template-ai-project**](https://github.com/aivalueworx/template-ai-project) answers: *how do we write, review, and evolve documentation and agent context so quality compounds over time?*

They are **orthogonal**. For a serious app repo you generally want **both**: one implementation stack template **plus** the files from `template-ai-project`.

### What `template-ai-project` adds

- **Canonical AI context:** `AGENTS.md`, `CLAUDE.md`, `CONVENTIONS.md`, `DECISIONS.md`, `HANDOFF.md`, `MEMORY.md`, `TRANSCRIPT_LOG.md`  
- **Review discipline:** `CHALLENGE_PROMPTS.md`, `REVIEW_GATE.md`, `REVIEW.md`  
- **Agent tooling:** `.claude/` (skills, hooks, memory), `.cursor/rules/`  
- **Governance and workflow templates:** `docs/agent-governance/`, `docs/agentic-workflow/`, ADR stubs, OpenAPI template, runbook/postmortem templates  
- **Automation:** doc staleness, readme sync, API docs workflows, etc.

### How to combine repos (practical)

There is no single GitHub feature that merges two templates automatically. Typical approaches:

1. **Create the repo from your chosen stack template** (Workers, Railway, hybrid, …).  
2. **Clone [template-ai-project](https://github.com/aivalueworx/template-ai-project)** locally and copy in everything you need: root markdown files, `docs/` (merge folders), `.claude/`, `.cursor/`, `.github/` (merge workflows—resolve duplicates by hand), `scripts/`.  
3. **Resolve overlaps:** you may have two `README.md` styles—keep one primary README and fold stack-specific setup under “Runtime” or “Deployment”. Same for `.github/workflows`: keep stack deploy workflows *and* add doc workflows from `template-ai-project` without duplicate `ci.yml` names.  
4. Run **`setup.sh`** from `template-ai-project` if you use it, after paths make sense.  
5. **Commit** as something like `docs: layer compound engineering template over stack skeleton`.

Do this **early**—before large amounts of feature code—so agents and humans inherit one consistent process.

### Project history: do you need `history.md`?

Most of what people want from a rolling “errors we fixed / lessons learned” file is **already split** across the compound stack:

| Need | Where it usually lives |
|------|-------------------------|
| **What shipped when** | `CHANGELOG.md` |
| **Session / task continuity** | `HANDOFF.md` |
| **Why we decided X** | `DECISIONS.md` + `docs/adr/` |
| **Incidents and blameless analysis** | `docs/postmortems/` (human-only) |
| **Narrative of AI sessions** | `TRANSCRIPT_LOG.md` + Gist links |
| **Reusable “we hit error Y, fix was Z”** | `docs/solutions/` (solved-problem notes—already in the template tree) |

Adding a root-level **`history.md`** is optional. Use it only if you want a **single chronological narrative** (e.g. onboarding new humans who dislike jumping between files). Otherwise prefer **`docs/solutions/`** for discrete write-ups and **CHANGELOG** for user-visible fixes, to avoid a fourth duplicate log the LLM must reconcile.

### Which docs to read when—and how much to give the LLM

**Humans**

| When | Read |
|------|------|
| First day on the repo | `README.md`, `AGENTS.md`, `CONVENTIONS.md`, `docs/` onboarding if present |
| Before a feature | Relevant `plan/` or PRD/plan templates, `DECISIONS.md` if touching architecture |
| Each session / handoff | `HANDOFF.md` |
| Before merging risky work | `CHALLENGE_PROMPTS.md` / `REVIEW_GATE.md` for your stage |

**LLMs (token discipline)**

- **Always in rules / project context:** `AGENTS.md` (and Cursor rules that point at it)—not the entire repo.  
- **Per task:** paste or `@`-reference only what changes—e.g. the files you are editing, `CONVENTIONS.md` for style, one ADR if the task touches that decision.  
- **Avoid** dumping full `docs/`, all ADRs, and full changelog into every chat; use **layered retrieval** (open the 3–8 files that matter).  
- **Session continuity:** `HANDOFF.md` + `MEMORY.md` index—small, high signal.  
- **Stale docs:** rely on `template-ai-project` staleness workflows where enabled; the LLM should not be the primary freshness checker.

Rule of thumb: **enough context to not violate architecture; not so much that the model attends to noise.**

### MCP servers that pair with this stack

You already named **Railway**, **Playwright**, and **MCP_Docker**—those cover deploy/debug, E2E verification, and reproducible environments. Consider adding (enable only what you actually use; each MCP adds surface area and distraction):

| MCP / integration | Why it saves time |
|--------------------|-------------------|
| **GitHub** (official or well-maintained) | Issues, PRs, checks, and repo context without leaving the IDE |
| **Documentation / “context” MCP** (e.g. library doc lookup) | Correct API usage for frameworks you depend on—fewer hallucinated props |
| **Supabase** (if you adopt Supabase) | Schema, migrations, and auth alignment with the live project |
| **Stripe / payments** (if billing) | Reduces payment-code errors |
| **Sentry / observability** (if you use it) | Tie errors in production to code paths in the editor |
| **Slack / Linear** (if the team uses them) | Fewer “what’s the ticket?” round trips |

There is no universal “install these ten” list: **install MCPs for systems you touch every week**, and skip the rest until the workflow needs them. Railway + browser/E2E + Docker already cover a large fraction of full-stack pain if you use that path.

---

## 1. `template-stack-recommender`

**Purpose:** Meta-template for **intake and stack selection**. It does not ship a production app; it ships **planning structure** and optional GitHub issue templates.

### What it contains

- `plan/STACK-RECOMMENDER.md` — questions, classification, decision rules, handoff output format  
- `plan/PROJECT-CLASSIFICATION.md` — worksheet  
- `plan/ARCHITECTURE-DECISION.md`, `DELIVERY-PHASES.md`, `RISKS-AND-CONSTRAINTS.md`, `REPO-SETUP.md`  
- `.github/ISSUE_TEMPLATE/stack-intake.yml` — optional issue-based intake  
- `.github/workflows/docs-check.yml` — light documentation checks  

### How to use it

- **On GitHub:** Create a new repo from this template when you want a **dedicated planning repo**, or  
- **In Cursor:** Copy the `plan/` folder into any project and run through `STACK-RECOMMENDER.md` first.

### Output you should produce

A short written recommendation: **which implementation template**, **which add-ons** (auth, DB, Trigger.dev, etc.), **constraints**, and **delivery phases**. Do not skip this step for non-trivial work.

---

## 2. `template-gh-automation`

**Purpose:** **Repository-triggered** automation—everything that runs on `push`, `pull_request`, `schedule`, or `workflow_dispatch`, without serving a primary user-facing product from Actions itself.

### Best fit

- CI and quality gates  
- Scheduled reports, cron-style maintenance  
- Prompt evals, test matrices, artifact generation  
- Release packaging and release automation  
- Repo hygiene (sync labels, stale issues, etc.—extend as needed)

### What it includes

- Reusable workflows (`reusable-build`, `reusable-test`) consumed by a main CI workflow  
- `scheduled.yml` for time-based jobs  
- `release.yml` placeholder for release flows  
- `scripts/*.mjs` placeholders (`build`, `lint`, `test`, `report`)  
- Docs: `docs/SECRETS.md`, `docs/RUNBOOK.md`, `docs/ROLLBACK.md`  
- `package.json` at repo root for script orchestration  

### How to use it

1. Create a new repo from the template.  
2. Copy `.env.example` to `.env` if local scripts need variables.  
3. Replace placeholder scripts under `scripts/` with your real logic.  
4. Configure **GitHub Secrets** and variables as documented in `docs/SECRETS.md`.  
5. Adjust workflow names/triggers only if your branching model requires it.

### Anti-patterns

- Do **not** treat Actions as the primary runtime for interactive user traffic or long-lived sessions.  
- Do **not** pick Actions “because it is free” when the workload is really an app or API.

---

## 3. `template-cf-pages-static`

**Purpose:** **Static or mostly static** sites on **Cloudflare Pages**, with **light** server logic via **Pages Functions** (e.g. form handling, health checks).

### Best fit

- Marketing and landing pages  
- SEO-focused content sites  
- Documentation-style static sites  
- Simple contact forms and small API routes at the edge  

### What it includes

- `public/` static assets (`index.html`, `styles.css`, `_headers`, etc.)  
- `functions/` — middleware and API routes (e.g. `api/health`, `api/contact`)  
- `wrangler.jsonc` for Wrangler/Pages alignment  
- `.github/workflows/ci.yml` and `deploy.yml` (Wrangler-based deploy patterns)  
- Docs: cache and environment notes  

### How to use it

1. Install dependencies (`npm install` at project root).  
2. Copy `.dev.vars.example` → `.dev.vars` for local dev.  
3. Run `npm run dev` (per template README).  
4. Connect the GitHub repo to Cloudflare Pages and set **secrets/vars** for production deploys.  
5. Replace copy, forms, and headers with your product requirements.

### Anti-patterns

- **Full-stack Next.js** workloads that Cloudflare documents as better suited to **Workers**—check current Cloudflare guidance for SSR/full-stack frameworks.  
- Heavy CPU, large dependencies, or long-running processes—move those to **Railway** or a dedicated worker service.

---

## 4. `template-cf-workers-fullstack`

**Purpose:** **Edge-first** applications on **Cloudflare Workers**: request-driven APIs, ingress, coordination, and edge primitives (Durable Objects, Queues, Workflows) as stubbed examples.

### Best fit

- Edge APIs and BFF layers  
- Webhook receivers and rate limiting  
- Lightweight chat or streaming edges  
- Session or room coordination (Durable Objects placeholder)  
- Queue consumers and workflow stubs  

### What it includes

- `src/index.ts` and route modules (`health`, `chat`, `webhook`, etc.)  
- `src/durable-objects/`, `src/queues/`, `src/workflows/` placeholders  
- `wrangler.jsonc`, `tsconfig.json`  
- CI and deploy workflows using Wrangler  

### How to use it

1. Install dependencies.  
2. Copy `.dev.vars.example` → `.dev.vars`.  
3. Run `npm run dev`.  
4. Configure Cloudflare **account and API tokens** for CI deploys.  
5. Flesh out routes, bindings, and limits; read `docs/EDGE-CONSTRAINTS.md` in the repo for edge limits and patterns.

### Anti-patterns

- **Heavy backend jobs** (GPU, large Node native addons, long unbounded CPU)—use **Railway** or a batch/worker platform.  
- **Durable multi-step business processes** that need strong retries and human approval—often pair this template’s edge layer with **Trigger.dev** or a backend queue on Railway.

---

## 5. `template-railway-service-core`

**Purpose:** **Persistent** backend services deployed as **containers** on **Railway**: API + worker split with shared libraries, config-as-code via `railway.json` per service.

### Best fit

- REST/GraphQL APIs and internal services  
- Background workers and ingestion  
- Dashboards and tooling that need a full runtime  
- Browser automation (Playwright, etc.), MCP servers, heavy Node/Python  

### What it includes

- Monorepo: `apps/api`, `apps/worker`, `packages/shared`  
- Per-service `railway.json` and minimal `index.mjs` placeholders  
- `scripts/check.mjs` and root `package.json` orchestration  
- CI plus deploy workflows for API and worker, post-deploy smoke placeholder  
- Docs: deployment runbook, rollback  

### How to use it

1. Install from repo root.  
2. Copy `.env.example` → `.env` for local development.  
3. Run `npm run dev:api` or `npm run dev:worker` as documented in the template README.  
4. In Railway, create **one service per app** and point each at the correct **root directory** and config.  
5. Wire GitHub → Railway deploys using secrets expected by the workflows.

### Anti-patterns

- Using Railway for **globally static** content only—**Pages** may be simpler and cheaper.  
- Ignoring **multi-service** boundaries: keep API and worker concerns separated as in the template.

---

## 6. `template-agent-runtime-hybrid`

**Purpose:** **AI/agent** products that need **multiple runtimes**: a fast web or edge surface, a **persistent** API/worker tier on Railway, and **durable async** tasks (Trigger.dev placeholder), plus packages for **agents, skills, prompts, and contracts**.

### Best fit

- Chat + background research/generation  
- Multi-step flows with retries and resume  
- Approval gates and human-in-the-loop  
- Products where the user should not block on long-running work  

### Default architectural idea (encoded as stubs)

| Layer | Typical home in this template |
|--------|-------------------------------|
| Web / front door | Cloudflare Workers **or** Vercel (`apps/web`) |
| Persistent API / worker | Railway (`apps/api`, `apps/worker`) |
| Durable workflows | Trigger.dev (`apps/trigger`) |
| Auth / data | Supabase or Convex (bring your integration) |

### What it includes

- Monorepo: `apps/web`, `apps/api`, `apps/worker`, `apps/trigger` with `trigger.config.ts` and example task  
- Packages: `agents`, `skills`, `prompts`, `contracts`, `shared`  
- Docs: architecture, agent contracts, failure modes  
- CI and deploy workflows for API, worker, web (Cloudflare path), Trigger sync  

### How to use it

1. Decide where **`apps/web`** deploys (Cloudflare vs Vercel) and align env vars and workflows.  
2. Complete planning files in `plan/` before deep implementation.  
3. Set platform env vars and GitHub secrets for Railway, Trigger.dev, and Cloudflare as applicable.  
4. Replace placeholder agents, skills, prompts, and contracts with your domain logic.  

### Anti-patterns

- Using this template for a **static marketing page**—use **template-cf-pages-static** instead.  
- Putting **all** long-running AI work in the synchronous request path—use Trigger.dev or a worker queue for durable work.

---

## Add-ons (not default in every template)

Use these when **classification** says you need them:

| Add-on | When |
|--------|------|
| **Trigger.dev** | Long-running jobs, retries, multi-step workflows, “user left but work continues” |
| **Supabase** | Fast auth, Postgres, storage, edge functions for webhooks (mind CPU/runtime limits on Edge Functions) |
| **Convex** | Live/reactive state, realtime sync-heavy UX |
| **Modal** (or similar) | GPU, heavy media/AI compute, custom model execution |
| **Cloudflare in front of Railway** | Edge caching, WAF, routing when the backend stays heavy on Railway |
| **Vercel for frontend** | When Next.js DX and previews matter more than CF edge primitives |

---

## Decision rules (short)

These mirror `STACK-RECOMMENDER.md`:

1. **Repo-triggered and non-interactive** → `template-gh-automation`  
2. **Public-facing, mostly static, light server logic** → `template-cf-pages-static`  
3. **Edge-first, request-driven, latency-sensitive** → `template-cf-workers-fullstack`  
4. **Persistent services, full runtime, workers, automation** → `template-railway-service-core`  
5. **Agents, skills, long async work, approvals, multi-runtime** → `template-agent-runtime-hybrid`  

**Before implementation:** answer in one sentence: *what exact type of work is each layer responsible for, and why is that the natural home for that work?*

---

## GitHub: creating a repo from a template

1. Open the template repository on GitHub (links in [Quick reference](#quick-reference)).  
2. Click **Use this template** → **Create a new repository**.  
3. Choose owner, name, visibility, and create.  
4. Clone locally, install dependencies, and follow the template’s **Quick start** in its README.  
5. Add **GitHub Actions secrets** and **repository variables** required by the workflows (see each repo’s `docs/` and `SECRETS` files).

---

## Cursor: how to work with the plan files

For any new project:

1. Add or generate `plan/STACK-RECOMMENDER.md` (from **template-stack-recommender**).  
2. Run through classification and paste the **Recommended Starter Stack** output into your session or PR description.  
3. Only then scaffold or copy code from the chosen implementation template.

This keeps stack choice **explicit** and avoids retrofitting the wrong platform after code exists.

---

## Official template locations (aivalueworx)

| Template | URL |
|----------|-----|
| Compound docs + agent harness (`template-ai-project`) | https://github.com/aivalueworx/template-ai-project |
| Stack recommender | https://github.com/aivalueworx/template-stack-recommender |
| GitHub automation | https://github.com/aivalueworx/template-gh-automation |
| Cloudflare Pages static | https://github.com/aivalueworx/template-cf-pages-static |
| Cloudflare Workers full-stack | https://github.com/aivalueworx/template-cf-workers-fullstack |
| Railway service core | https://github.com/aivalueworx/template-railway-service-core |
| Agent runtime hybrid | https://github.com/aivalueworx/template-agent-runtime-hybrid |

---

## Summary

- **Plan first** with **template-stack-recommender**.  
- **Implement** with exactly **one** of the five workload templates.  
- **Layer** [template-ai-project](https://github.com/aivalueworx/template-ai-project) early so documentation, agent rules, and review loops stay consistent.  
- **Add** auth, DB, Trigger.dev, and other services only when the workload requires them.  
- Treat these repos as **skeletons**: configs and workflows are in place; you still supply secrets, IDs, and business logic.

For the full question set and copy-paste handoff format, see the upstream `plan/STACK-RECOMMENDER.md` inside **template-stack-recommender**.
