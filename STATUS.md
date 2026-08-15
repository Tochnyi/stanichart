# Tochnyi Charts — Current Status

**Document role:** Current capability and scope authority for this repository. It answers what exists today and what is deliberately excluded. It is not a roadmap, design history, or changelog. See [`README.md`](README.md) for orientation and [`TESTING.md`](TESTING.md) for the verification procedure.

## Purpose

A design-library and chart-generation repository for Tochnyi-branded data visualizations. Agents produce static HTML charts from text input using the chart-generation skill, styled by a shared design system. This is the earlier prompt/example-driven generation model; it is not the constrained `ChartSpec` renderer engine used by the `stanichart_2`/`tochnyichart` repositories.

## Implemented today

### Shared design system (source of truth)

- `reference.html` — master reference: color palette, typography scale, chart-type demos (bar, grouped bar, line, pie/donut), change-badge and big-number patterns, and the canonical HTML template including a `CHART METADATA` provenance block.
- `lib/tochnyi.css` — all shared styling, CSS variables, layout, watermark, change-badge, and big-number classes.
- `lib/tochnyi-charts.js` — the `Tochnyi` helper object for AMCharts 5: roots, axis renderers, column/line/pie series, legends, bar colors, annotations, and date formatting.
- `lib/tochnyi-logo.png`, `lib/watermark.svg` — shared brand assets referenced by every chart.

### Chart generation workflow

- `.claude/skills/tochnyi-chart.md` — the generation skill: chart-type selection, year/source prompting rules, template use, `CHART METADATA` provenance, week-folder naming, and relative-path rules.
- Generated charts live in `charts/YYYY-week-WW/` (zero-padded week). Each week folder contains `.html` charts and, where delivered, a `.pptx` deck.

### Verification

- `tools/check-charts.js` — zero-dependency structural verification lane; exposed as `npm test` via `package.json`. It validates every published chart and `reference.html` against the shared contract without a browser or network.
- Manual lanes: browser review of `reference.html` and generated charts for visual quality; source-fidelity review of chart claims against the supplied input data.

## Deliberately excluded (current scope boundary)

- No build system, bundler, or server. Charts are static HTML that load AMCharts 5 and the Mukta font from CDNs and reference local `lib/` assets; opening a chart requires network access for CDN assets unless they are already cached or vendored locally.
- No automated browser, rendering, or visual-diff tests. The automated lane is structural only.
- `index.html` is a legacy pre-design-system example (inline styling, no `lib/` usage). It is retained for reference and excluded from the verification lane.
- Older week folders and charts generated before the `CHART METADATA` template block may lack that provenance block; the verification lane reports them only as an advisory.
- No semantic `ChartSpec` schema or scripted renderer. Chart authoring is prompt/example-driven through the skill.

## Authority map

| Question | Authority |
| --- | --- |
| Repository orientation and primary workflow | `README.md` |
| Current capability and scope boundary | `STATUS.md` (this file) |
| Verification procedure and lane map | `TESTING.md` |
| Canonical chart examples and design patterns | `reference.html` |
| Shared visual tokens and layout styles | `lib/tochnyi.css` |
| Shared chart helper behavior | `lib/tochnyi-charts.js` |
| Agent generation procedure | `.claude/skills/tochnyi-chart.md` |
| One published chart's content | That chart file under `charts/` |

## Future work

Future work belongs in the project's issue tracker or a `DIRECTION.md`; it does not belong in this current-status document.
