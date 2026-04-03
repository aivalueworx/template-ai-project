# STACK-RECOMMENDER.md

## Purpose
Use this file at the start of every project during the Cursor plan phase.

The goal is to classify the app correctly before code is written.
This file should produce:

1. the recommended GitHub template,
2. the recommended starter stack,
3. required add-ons,
4. key constraints,
5. a delivery shape.

---

## Instructions for the Planner
Work through the questions below.
Do not skip classification.
Do not jump straight to implementation.
Do not choose a platform by familiarity alone.
Choose based on workload shape.

---

## Step 1. Classify the project

### Project summary
- Project name:
- One-line objective:
- Who uses it:
- Core user action:
- Core system action:

### Project type
Pick one primary type:
- repo automation
- static/marketing site
- edge app/API
- persistent backend/service
- AI / agent / async workflow app
- internal ops tool

### User wait state
- Does a user wait for a response in the browser/app? yes/no
- Does work continue after the user leaves? yes/no
- Is live progress needed? yes/no

### Longest unit of work
Pick one:
- under 5 seconds
- 5–30 seconds
- 30 seconds–5 minutes
- more than 5 minutes
- hours / multi-step / wait-and-resume

---

## Step 2. Answer the architecture questions

### Runtime
- Does the app need full Node or Python runtime behavior?
- Does it require native binaries or browser automation?
- Does it need always-on services?
- Does edge latency matter by geography?

### API / integration
- Public API needed?
- Webhook receiver needed?
- Queue/event processing needed?
- Streaming responses needed?
- Realtime/WebSockets needed?

### Data / state
- Auth needed?
- Database needed?
- File storage needed?
- Live sync or subscribable state needed?
- Session memory needed?

### AI / agents
- Hosted LLM APIs only, or heavier AI compute too?
- Tool-calling agents needed?
- Multi-step agent workflows needed?
- Skills / reusable tools needed?
- Human approval steps needed?
- Vector search / memory needed?

### Delivery / governance
- Is this an MVP, production system, or internal prototype?
- Is auditability important?
- Is cloud portability important?
- Is speed of delivery more important than infra control?

---

## Step 3. Apply the decision rules

### Rule A
If the project is repo-triggered and non-interactive:
- choose `template-gh-automation`

### Rule B
If the project is public-facing and mostly static with light server logic:
- choose `template-cf-pages-static`

### Rule C
If the project is edge-first, request-driven, and latency-sensitive:
- choose `template-cf-workers-fullstack`

### Rule D
If the project needs persistent services, runtime freedom, workers, or browser automation:
- choose `template-railway-service-core`

### Rule E
If the project has agents, skills, long async work, approval steps, or multi-runtime needs:
- choose `template-agent-runtime-hybrid`

---

## Step 4. Add stack extensions

Add these only when needed.

### Add Trigger.dev when
- jobs are long-running,
- users should not wait,
- retries/resume matter,
- workflows have multiple steps.

### Add Supabase when
- auth is needed,
- database/storage is needed quickly,
- backend primitives should be fast to stand up.

### Add Convex when
- live state is core,
- chat/realtime sync is central,
- agentic UX needs reactive subscriptions.

### Add Modal when
- GPU is needed,
- media or AI workloads are heavy,
- own-model execution is part of the product.

### Add Cloudflare in front of Railway when
- public traffic benefits from edge protection/routing,
- the backend is heavy but the edge should stay fast.

### Consider Vercel for the frontend when
- Next.js delivery speed and preview workflows matter most,
- Cloudflare edge primitives are not central to the design.

---

## Step 5. Produce the output

Copy and fill in this format.

```md
# Recommended Starter Stack

## 1. Project classification
- Project type:
- User-facing or internal:
- Core workload shape:
- Longest unit of work:

## 2. Recommended GitHub template
- Template:
- Reason:

## 3. Recommended starter stack
- Frontend:
- Edge/API layer:
- Persistent backend/runtime:
- Background workflow layer:
- Auth/data/storage:
- Optional AI compute:

## 4. Why this stack wins
- Reason 1:
- Reason 2:
- Reason 3:

## 5. Key constraints
- Constraint 1:
- Constraint 2:
- Constraint 3:

## 6. Delivery phases
- Phase 1:
- Phase 2:
- Phase 3:
```

---

## Step 6. Handoff into implementation

Once the stack is chosen, create:

- `ARCHITECTURE-DECISION.md`
- `DELIVERY-PHASES.md`
- `RISKS-AND-CONSTRAINTS.md`
- `REPO-SETUP.md`

Do not start coding until these four files exist.

---

## Short-form reasoning guide

Use this mental model:

- GitHub Actions = repo automation
- Cloudflare Pages = static/light edge delivery
- Cloudflare Workers = edge-first app/API/orchestration
- Railway = persistent backend/runtime
- Trigger.dev = durable async workflows
- Supabase = fast auth/data/storage
- Convex = reactive app state
- Modal = heavy AI/GPU compute

---

## Anti-pattern checks

Do not choose GitHub Actions because it is free if the app is user-facing.
Do not choose Cloudflare Workers if the workload is really heavy backend compute.
Do not choose Railway alone if the system needs durable multi-step async workflows.
Do not choose a heavy hybrid stack if the project is just a static site.
Do not let one runtime absorb jobs that belong to separate layers.

---

## Final check
Before implementation, answer this in one sentence:

**What exact type of work is each layer responsible for, and why is that the natural home for that work?**
