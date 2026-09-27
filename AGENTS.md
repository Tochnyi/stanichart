# Agent Guide

**BCA policy:** advisory

**Profiles:** Universal, Artifact Generation

This file is the execution card for Stanichart. [README.md](README.md) owns supported workflow/orientation, [STATUS.md](STATUS.md) owns current scope, [TESTING.md](TESTING.md) owns verification, `reference.html` and `lib/` own the reusable design system, and `.claude/skills/tochnyi-chart.md` owns the chart-generation procedure.

<!-- workspace-contract:begin (generated from ../AGENTS.md by tools/sync_agent_context.py; edit the source, not this copy) -->
## Workspace contract

Applies to every agent in every harness. Source, rationale, and evidence: [../AGENTS.md](../AGENTS.md).

The user is a solo developer. Precedence: the user's current request → this contract → the project card → standards references. **Hard** rules cannot be waived by lower-level workflow advice.

### AG-1 Finish the work

Finish the authorized task; a plan, progress update, or deferred note is not delivery. Delegate only bounded, read-only work when delegation is authorized.

### AG-2 Make the calls yourself

Make design and implementation decisions within scope; state consequential choices briefly and continue. Ask only when the answer changes the result and cannot be inferred. Read the project card once, then the task's authority, owner, and proof route. Begin when those are clear; expand for unclear scope or crossed boundaries. Links and profiles are lookups, not a recursive reading list. Use product workflows before internals for research or artifact authoring.

### AG-3 Stay in your project (hard)

Identify the requested project before working. Do not create top-level directories or write output to the workspace root or a project's parent. Scratch work belongs in the project's ignored output location (normally `target/agent-output/`) or OS temp.

### AG-4 Done means the user's copy works (hard)

Check every requested requirement against the actual result. Refresh and verify the affected release binary, deployed site, or running application the user uses; source edits alone do not update it. Documentation-only work verifies the delivered documents and routes. Use the smallest complete project verification lane, and [`REVIEW.md`](../REVIEW.md) for consequential code changes. Claim only what you checked; report unverified requirements.

### AG-5 Look at what you made

Render or run changed visual, audio, interactive, or published output and inspect it against the applicable [`STANDARDS_QUALITY.md`](../STANDARDS_QUALITY.md) rubric and references. Inspect individual assets at useful scales and angles, verify every requested file, and fix defects. Include rendered evidence in the report. Internal prose needs readability and route review only, not a publication workflow. Tests do not prove appearance.

### AG-6 Real behavior over proxies

Observe the behavior the user experiences. A passing test, harness, validator, or metric is evidence, not the goal. Repair harness/product divergence; never pass a gate by weakening it, hardcoding outcomes, suppressing warnings, or retrying until green. Simulations use causal, parameterized systems (STANDARDS_QUALITY.md QUAL-3).

### AG-7 Answer first, then stop talking

Answer questions directly; do not treat them as permission to act. Reports state what changed, verification and its limits, and any required user action. Put long audits or research in a project file and link it. No lectures or revisiting dismissed topics.

### AG-8 Own mistakes; trust the user's evidence

When the user reports a failure, re-check your work before blaming their setup. Own mistakes plainly and fix them. Try a tool, file, or capability before claiming it is unavailable.

### AG-9 The outcome outranks the process

If a procedure harms the requested result or costs more than it protects, favor the result and briefly state what you skipped. This does not waive hard rules.

### AG-10 Leave nothing running

Stop task-owned processes, servers, watchers, and terminals; release locks and remove your scratch output. Keep requested deliverables and the updated application the user is meant to run. Never kill or replace the user's program without saying so. Built software must clean up its own child processes on exit.

### AG-11 Git: `main`, commit, push (hard)

Work on `main`; create branches or worktrees only when asked. Commit and push verified work unless the user says not to. Preserve others' changes: never revert, stash, or discard them. Include sound shared progress when appropriate; leave clearly broken unrelated work out and report it.

### AG-12 Current docs describe the present

Update the single authority for changed behavior. Keep history, session notes, and changelogs out of current docs and comments. Plans and design intent do not prove implemented capability.

### AG-13 CI is local; GitHub Actions are banned (hard)

Use repository-owned local build, test, check, and audit commands. Never create, enable, invoke, or push `.github/workflows/`; remove existing workflow files while retaining their local verification equivalent.
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
