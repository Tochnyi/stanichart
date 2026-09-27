# Agent Guide

**BCA policy:** advisory

**Profiles:** Universal, Artifact Generation

This file is the execution card for Stanichart. [README.md](README.md) owns supported workflow/orientation, [STATUS.md](STATUS.md) owns current scope, [TESTING.md](TESTING.md) owns verification, `reference.html` and `lib/` own the reusable design system, and `.claude/skills/tochnyi-chart.md` owns the chart-generation procedure.

<!-- workspace-contract:begin (generated from ../AGENTS.md by tools/sync_agent_context.py; edit the source, not this copy) -->
## Workspace contract

Applies to every agent in every harness. Source, rationale, and evidence: [../AGENTS.md](../AGENTS.md).

The user is a solo developer. Precedence: the user's current request → this contract → the project's `AGENTS.md` → the standards reference. Rules marked **hard** hold even when the user says to ignore the workflow.

### AG-1 Finish the work

Finish the task before reporting. Don't stop at a plan or a progress update, and don't defer requested work into notes. Delegate only bounded, read-only work to subagents.

### AG-2 Make the calls yourself

Design and implementation decisions inside the task are yours. Choose the approach a strong senior engineer would choose, state the choice in one line, and keep going. Ask only when the answer would change what the user gets and you cannot infer it from the request, the code, or common sense.

### AG-3 Stay in your project (hard)

Work only inside the project the task is about. If your session starts at the workspace root, identify that project from the request and work there. Never create top-level directories, and never write output to the workspace root or a project's parent. Temporary output goes in the project's ignored output location (normally `target/agent-output/`) or the OS temp directory.

### AG-4 Done means the user's copy works (hard)

Before you say done:

- Re-read the original request and check every requirement against the actual result by running it, opening it, or looking at it.
- Rebuild the release binary, redeploy the site, or restart whatever the user will actually run, and say that it's current.
- For consequential code changes, go through [`REVIEW.md`](../REVIEW.md) against your diff.

Never claim something is fixed, verified, deployed, or certain unless you checked it. Report what you did not verify.

### AG-5 Look at what you made

For anything seen or heard (graphics, UI, charts, animation, audio, documents), render it and inspect it yourself against the matching rubric in [`STANDARDS_QUALITY.md`](../STANDARDS_QUALITY.md) before calling it done.

- Look at individual assets up close and from several angles, not a crowded overview.
- Compare against the references.
- Check that every output file was actually produced.
- Keep iterating until you would be proud to show it.

Include the screenshots or rendered files in your report. Tests prove behavior, not appearance.

### AG-6 Real behavior over proxies

A passing harness, test, validator, or metric is evidence, not the goal. The goal is the behavior the user experiences. Observe it directly and judge it with common sense against how the real world works. Fix a harness that diverges from the product rather than tuning the product to the harness. Never make a gate pass by weakening it, hardcoding the expected outcome, suppressing warnings, or retrying until green. Simulations get emergent, parameterized systems, not scripted outcomes (STANDARDS_QUALITY.md QUAL-3).

### AG-7 Answer first, then stop talking

When the user asks a question, the first sentence answers it directly. Don't act on a question as though it were a request. Reports are short:

- what changed;
- what you verified and how;
- what you did not verify;
- anything the user must do.

No lectures, recaps, hedging paragraphs, or repeated caveats, and never keep raising a topic the user has dismissed. Put long material (audits, research, data) in a file in the project and link it.

### AG-8 Own mistakes; trust the user's evidence

When the user says something is broken, believe them and re-check your own work before suspecting their setup. Say plainly when you were wrong, then fix it. Never claim a tool, file, or capability is unavailable without actually trying it.

### AG-9 The outcome outranks the process

Standards and workflows exist to make results better. When a documented procedure would make the requested result worse, or cost far more than it protects, favor the result and note in one line what you skipped. This never overrides a hard rule.

### AG-10 Leave nothing running

Before you finish, stop every process, server, watcher, and terminal you started. Release file locks, and delete temporary builds and scratch files you created. Software you build must not leave orphaned child processes when it closes. Never kill or replace a program the user is running without saying so.

### AG-11 Git: `main`, commit, push (hard)

Work on `main`, and don't create branches or worktrees unless asked. When the work is complete and verified, commit and push `main` unless the user said not to. Other agents' changes in the tree may go in with yours when they are sound progress. Never revert, stash, or discard work you did not make; leave out anything clearly broken that isn't yours, and mention it.

### AG-12 Current docs describe the present

When behavior changes, update the one document that owns that fact. No history, war stories, changelogs, or session notes in current docs or comments. Design and roadmap documents are not proof that something is implemented.

### AG-13 CI is local; GitHub Actions are banned (hard)

All builds, tests, checks, and audits run through repository-owned local commands. Never create, enable, invoke, or push `.github/workflows/`; existing workflow files are defects to remove.
<!-- workspace-contract:end -->

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
