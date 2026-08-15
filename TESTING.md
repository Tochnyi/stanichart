# Tochnyi Charts — Testing and Verification

**Document role:** How tests are selected, written, and completed in this repository. [`AGENTS.md`](AGENTS.md) routes agent work; this file owns the verification procedure.

## Lanes

| Lane | Command | Covers |
| --- | --- | --- |
| Structural gate (complete automated lane) | `npm test` (or `node tools/check-charts.js`) | every generated chart and `reference.html` against the shared design-system contract |
| Browser visual review | manual | `reference.html` rendering, runtime console errors, representative bar/line/grouped/donut examples |
| Source fidelity | manual | chart claims versus the supplied input data and documented sources |

## Structural gate

`npm test` is the complete automated gate. It MUST pass before a consequential chart, design-system, or documentation change is considered complete.

The gate runs offline and verifies:

- week folders under `charts/` match `YYYY-week-WW` (zero-padded) and contain only `.html` and `.pptx` files;
- every published chart contains the universal contract: doctype, `lang="en"`, charset, viewport, non-empty title, Mukta font, `tochnyi.css`, and the `tochnyi-chart`/header/logo/date/title/subtitle/source/footer structure with attribution;
- AMCharts charts additionally load the AMCharts CDN `index.js`, include the `chartdiv` container, bootstrap with `am5.ready(...)`, and reference `lib/tochnyi-charts.js`;
- every local asset reference (`../../lib/...`) resolves to an existing file;
- `reference.html` contains the four demos, the HTML template, and the `CHART METADATA` provenance block.

The gate prints one advisory line when existing charts predate the `CHART METADATA` provenance block. Advisory output does not fail the gate.

## Writing or changing a check

Keep checks in `tools/check-charts.js`. Prefer exact structural predicates that fail with a per-file reason. Do not parse prose, add network-dependent checks, or make the gate depend on a browser. The gate must stay fast and deterministic.

## What the gate cannot prove

- rendering quality, layout, or runtime console errors — requires manual browser review;
- factual or editorial correctness of chart claims — requires checking against the supplied source data;
- that a future chart follows the template if the skill is bypassed — the gate detects drift after the fact.

## Completion

For any change, run `npm test`. For shared design-system changes, additionally open `reference.html` in a browser, inspect the console for errors, and review representative bar, line, grouped, and donut examples before finishing.
