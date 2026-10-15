# Agent Guide

**BCA policy:** advisory

**Profiles:** Universal, Artifact Generation

This file is the execution card for Stanichart. [README.md](README.md) owns supported workflow/orientation, [STATUS.md](STATUS.md) owns current scope, [TESTING.md](TESTING.md) owns verification, `reference.html` and `lib/` own the reusable design system, and `.claude/skills/tochnyi-chart.md` owns the chart-generation procedure.

<!-- workspace-contract:begin (generated from ../AGENTS.md by tools/sync_agent_context.py; edit the source, not this copy) -->
## Workspace contract

Applies to every agent in every harness. Source, rationale, and evidence: [../AGENTS.md](../AGENTS.md).

The user is a solo developer. Precedence: current request → this contract → project card → standards. **Hard** rules survive lower-level workflow advice.

### AG-1 Finish the work

Finish the authorized task; plans, progress, or deferred notes are not delivery. Delegate only bounded read-only work when authorized.

### AG-2 Make the calls yourself

Make in-scope decisions yourself; state consequential choices briefly and continue. Ask only when the answer changes the result and cannot be inferred. Read the project card once, then resolve authority, owner, and proof. Expand only for unresolved scope or boundaries. Links and profiles are lookups; research and artifact work starts at the product workflow.

### AG-3 Stay in your project (hard)

Work only in the requested project. Do not create top-level directories or write to the workspace root or project parent. Put scratch work in the project's ignored output (normally `target/agent-output/`) or OS temp.

### AG-4 Done means the user's copy works (hard)

Verify every requirement against the user's actual copy. Refresh and check the affected release, deployment, or running app; source edits alone do not update it. Docs-only work verifies docs and routes. Use the smallest complete project lane and [`REVIEW.md`](../REVIEW.md) for consequential code. Claim only checked results; report what remains unverified.

### AG-5 Look at what you made

Run or render changed visual, audio, interactive, or published output; inspect it against [`STANDARDS_QUALITY.md`](../STANDARDS_QUALITY.md) and project references. Verify requested files, fix defects, and report rendered evidence. Internal prose needs only readability and route review. Tests do not prove appearance.

### AG-6 Real behavior over proxies

Observe user-experienced behavior. Tests, harnesses, validators, and metrics are evidence, not the goal. Repair proxy/product divergence; never weaken gates, hardcode outcomes, suppress warnings, or retry until green. Simulations stay causal and parameterized (STANDARDS_QUALITY.md QUAL-3).

### AG-7 Answer first, then stop talking

Answer questions directly; they are not permission to act. Reports state changes, verification limits, and required user action. Put long audits or research in a project file. No lectures or revisiting dismissed topics.

### AG-8 Own mistakes; trust the user's evidence

On a user-reported failure, re-check your work before blaming setup; own and fix mistakes. Try a tool, file, or capability before claiming it is unavailable.

### AG-9 The outcome outranks the process

If procedure harms the result or costs more than it protects, favor the result and state what you skipped. Hard rules still apply.

### AG-10 Leave nothing running

Stop task-owned processes, servers, watchers, and terminals; release locks and remove scratch. Keep deliverables and the app the user should run. Never kill or replace the user's program silently. Built software cleans up child processes on exit.

### AG-11 Git: `main`, commit, push (hard)

Work on `main`; branches or worktrees only when asked. Commit and push verified work unless told not to. Never revert, stash, or discard others' changes. Include sound shared progress when appropriate; leave broken unrelated work out and report it.

### AG-12 Current docs describe the present

Update the single authority for changed behavior. Keep history, session notes, and changelog prose out of current docs/comments. Plans and design intent do not prove capability.

### AG-13 CI is local; GitHub Actions are banned (hard)

Use repository-owned local verification. Never create, enable, invoke, or push `.github/workflows/`; remove existing workflows while keeping their local equivalent.
<!-- workspace-contract:end -->

## Start here

1. Preserve unrelated weekly charts, source inputs, and working-tree changes.
2. Read [README.md](README.md) and [STATUS.md](STATUS.md) before assuming a workflow or chart convention is current.
3. Decide whether the task changes the reusable design system, generation workflow, or one published chart.
4. For design-system work, read `reference.html`, `lib/tochnyi.css`, `lib/tochnyi-charts.js`, and focused verification before editing.
5. For generation work, read `.claude/skills/tochnyi-chart.md` but verify constants/behavior against the actual design-system owners.
6. Use [TESTING.md](TESTING.md) for the automated lane and required visual/source-fidelity review.

This project applies the Universal and Artifact Generation portfolio profiles. Do not infer a global rule from copied generated charts when `reference.html`, `lib/`, or the generation procedure has a clearer owner.

## Project guardrails

- Separate evidence/content, semantic chart choice, and rendering/design decisions.
- Do not invent values, dates, units, sources, or causal claims to make a chart more complete; change the claim or chart when evidence is insufficient.
- Shared visual behavior belongs in `reference.html`/`lib/`, not duplicated across many published chart files.
- Generated weekly HTML and `*-share.html` files are delivery artifacts/examples, not reusable design-system authority.
- Share builds derive from the shared design system and must not become an alternate source of visual constants or helper behavior.
- CDN-backed charts have only the offline guarantees the artifact actually provides; do not overstate them.
- One-off chart edits stay local to that artifact unless the task explicitly changes the reusable design contract.

## Completion

Run `npm test`, then the applicable visual/source-fidelity review from [TESTING.md](TESTING.md). Shared design changes require representative browser review before becoming a generation pattern. Confirm the correct documentary/code owner changed, provenance remains truthful, generated artifacts are not mistaken for reusable authority, and the diff is task-scoped.
