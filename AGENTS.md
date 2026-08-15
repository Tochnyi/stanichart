# Agent Guide

This repository follows [`../STANDARDS.md`](../STANDARDS.md). The applicable profiles are Universal and Artifact Generation. Stanichart is a design-library and chart-output repository whose current generation workflow is partly prompt/example driven, so authority boundaries must be explicit.

When multiple agents may be active in this workspace, read [`../COORDINATION.md`](../COORDINATION.md) and the live [`../COORDINATION_STATUS.md`](../COORDINATION_STATUS.md) before the first consequential write. Coordination claims reserve active write scope only; they do not override Stanichart's status, verification, design-system, generation-skill, or published-chart authorities.

## Cold start

1. Run `git status --short` and preserve unrelated weekly charts and input files.
2. Read `README.md` for the supported chart workflow and directory layout, and `STATUS.md` for the current capability and scope boundary.
3. Read `reference.html`, the relevant files under `lib/`, and `.claude/skills/tochnyi-chart.md` before changing generated-chart conventions.
4. Determine whether the task changes the design system, the generation workflow, or one generated chart. Do not silently turn a one-off chart edit into a global rule.
5. Validate design-system changes in a browser with representative chart types before using them as a new generation pattern.

If README guidance, `reference.html`, shared library code, the skill, and existing generated charts disagree, do not infer a rule from majority usage. Resolve the owning authority named below and update dependents as appropriate.

## Authority

| Question | Authority |
| --- | --- |
| Supported workflow and repository orientation | `README.md` |
| Current capability and scope boundary | `STATUS.md` |
| Verification procedure and lane map | `TESTING.md` |
| Canonical chart examples and design patterns | `reference.html` |
| Shared visual tokens and layout styles | `lib/tochnyi.css` |
| Shared chart helper behavior | `lib/tochnyi-charts.js` |
| Agent generation procedure | `.claude/skills/tochnyi-chart.md` |
| One published chart's content | That chart file under `charts/` |

The generation skill is workflow guidance. It must not become the sole owner of visual constants, reusable JavaScript behavior, or factual chart content that has a clearer source elsewhere.

Generated charts under `charts/` are deliverables and examples, not independent architecture authorities. A pattern copied into many generated files does not override `reference.html` or `lib/`.

## Chart generation

Agents should separate three decisions:

1. **Evidence/content:** what the supplied data actually supports.
2. **Semantic chart choice:** bar, line, donut, comparison, or another supported form.
3. **Rendering/design:** how the shared design system expresses that choice.

Do not invent missing values, sources, units, dates, or causal claims to make a chart more complete. Preserve source attribution in the chart. When data are insufficient for a proposed visual claim, change the claim or chart rather than manufacturing evidence.

## Artifact boundaries

HTML files under weekly chart folders are generated/published artifacts. Keep shared design behavior in `reference.html` and `lib/` when it is intended to affect future charts.

- Do not edit many generated charts to establish a new global rule while leaving the design source unchanged.
- Do not treat screenshots as editable source when the HTML is available.
- Keep publication-week organization and chart metadata truthful to the artifact.
- CDN-backed charts require their external assets to be reachable unless those assets are separately vendored or cached. Do not claim stronger offline guarantees than the artifact actually has.

## Verification

The automated structural lane is:

```text
npm test
```

`tools/check-charts.js` verifies every published chart and `reference.html` against the shared design-system contract (structure, AMCharts wiring, resolvable local assets, week-folder naming) and fails with per-file reasons. It runs offline and is bounded. See [`TESTING.md`](TESTING.md) for the lane map and what the gate cannot prove.

For shared design changes, additionally:

1. open `reference.html` in a browser;
2. inspect the console for runtime errors;
3. review representative bar, line, grouped, and donut examples;
4. generate or update one bounded sample using the documented workflow;
5. verify source paths, branding, data labels, and the `CHART METADATA` provenance block.

Visual review can establish rendering quality but not factual correctness. Check chart claims against the supplied source data separately. A passing `npm test` does not imply a chart is visually correct or editorially accurate.

## Complexity control

This repository is the earlier prompt/example-driven generation model. Do not bolt on a partial semantic API, build system, or second renderer inside ad hoc chart files. If the project is intentionally migrated toward a constrained chart specification/renderer architecture, make that a repository-level architecture change with a single authoritative interface rather than layering it invisibly onto the existing skill.
