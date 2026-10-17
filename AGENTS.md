# Agent Guide

**BCA policy:** advisory

**Profiles:** Universal, Artifact Generation

This file is the execution card for Stanichart. [README.md](README.md) owns supported workflow/orientation, [STATUS.md](STATUS.md) owns current scope, [TESTING.md](TESTING.md) owns verification, `reference.html` and `lib/` own the reusable design system, and `.claude/skills/tochnyi-chart.md` owns the chart-generation procedure.

<!-- workspace-contract:begin (generated from ../AGENTS.md by tools/sync_agent_context.py; edit the source, not this copy) -->
## Workspace contract

Applies to every agent in every harness. Source, rationale, and evidence: [../AGENTS.md](../AGENTS.md).

The user is a solo developer. Precedence: current request → this contract → project card → standards. This is a safety kernel, not a prescribed workflow. **Hard** rules survive lower-level advice.

### AG-1 Finish the work

Finish the authorized task. On open-ended goals, iterate from evidence until the goal is met or useful in-scope improvements are exhausted; pivot around blockers instead of stopping at them.

### AG-2 Make the calls yourself

Make routine in-scope decisions yourself. Read the project card once, identify the owner and proof route, then work. Ask only when a choice materially changes the deliverable and cannot be inferred.

### AG-3 Write only in your project (hard)

Write only in the requested project. Read-only sibling inspection is allowed when it materially helps. Do not write to the workspace root, parent, or siblings; use project-ignored output or OS temp for scratch.

### AG-4 Done means the user's copy works (hard)

Verify the result in the user's actual copy, including the release, deployment, or running app when applicable. Use the smallest complete project lane and [`REVIEW.md`](../REVIEW.md) for consequential code. Claim only checked results.

### AG-5 Look at what you made

Run or render changed visual, audio, interactive, or published output and inspect the real result against project references and [`STANDARDS_QUALITY.md`](../STANDARDS_QUALITY.md). Tests do not prove appearance.

### AG-6 Real behavior over proxies

Prefer observed product behavior over proxy success. Use tests, harnesses, validators, and metrics as evidence; fix production root causes and proxy divergence rather than weakening gates or hardcoding outcomes.

### AG-7 Answer first, then stop talking

Answer questions directly. Reports state changes, verification limits, and required user action; keep long audit material in project files instead of chat.

### AG-8 Own mistakes; trust the user's evidence

On a reported failure, re-check your work before blaming setup. Try a capability before claiming it is unavailable.

### AG-9 The outcome outranks the process

Skip ceremony and optional diagnostics when they cost more than they protect. Do not skip the proof required by AG-4 through AG-6 or any hard rule.

### AG-10 Leave nothing running

Run automation without disrupting the desktop. Stop task-owned processes, release locks, and remove scratch; never kill or replace the user's program silently.

### AG-11 Git: `main`, commit, push (hard)

Work on `main`; branches or worktrees only when asked. Commit and push verified work unless told not to. Stage task-owned paths explicitly in dirty trees and never discard or sweep in unrelated work.

### AG-12 Current docs describe the present

Update the authority for changed behavior. Keep history and session notes out of current docs and comments.

### AG-13 CI is local; GitHub Actions are banned (hard)

Use repository-owned local verification. Never create, enable, invoke, or push `.github/workflows/`.

### Optional workspace accelerator

Use native navigation first. If cold-start routing is still expensive or ambiguous, run:

```text
python ../tools/agent_context.py brief stanichart <task ...>
```

It returns bounded authority, verification, and likely-source evidence. Tool output is evidence, not authority. Use `python ../tools/agent_context.py --help` only when a specific unresolved question justifies a deeper probe. No shared analysis command is a prerequisite to editing.
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
