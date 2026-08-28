# Agent Guide

**BCA policy:** advisory

This file is the execution card for Stanichart. [README.md](README.md) owns supported workflow/orientation, [STATUS.md](STATUS.md) owns current scope, [TESTING.md](TESTING.md) owns verification, `reference.html` and `lib/` own the reusable design system, and `.claude/skills/tochnyi-chart.md` owns the chart-generation procedure.

## Start here

1. Read [`../AGENTS.md`](../AGENTS.md) and preserve unrelated weekly charts, source inputs, and working-tree changes.
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
- Repository verification is local. Do not create or depend on GitHub Actions workflows.

## Completion

Run `npm test`, then the applicable visual/source-fidelity review from [TESTING.md](TESTING.md). Shared design changes require representative browser review before becoming a generation pattern. Confirm the correct documentary/code owner changed, provenance remains truthful, generated artifacts are not mistaken for reusable authority, and the diff is task-scoped.
