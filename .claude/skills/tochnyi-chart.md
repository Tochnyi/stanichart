---
name: chart
description: Generate interactive data visualization charts in Tochnyi style from text containing data or statistics
version: 1.0.0
triggers:
  - pattern: "chart"
  - pattern: "visualize"
  - pattern: "graph"
---

# Tochnyi Chart Generator

When the user provides text containing data or statistics, analyze it and generate an interactive chart in Tochnyi style.

## Single Source of Truth

**IMPORTANT**: `reference.html` is the single source of truth for all chart templates, code examples, and styling patterns.

- **Before generating any chart**, read `reference.html` to see the latest working examples
- Extract the HTML template structure from the "HTML Template" section in `reference.html`
- Use the JavaScript code patterns from the chart demo sections (bar, grouped-bar, line, pie)
- All updates to charts should be made to `reference.html` first, then this skill will automatically use them

## Files Structure

The chart library consists of:
- `reference.html` - **MASTER REFERENCE** with all chart types, HTML template, and working code examples
- `lib/tochnyi.css` - Shared CSS styles and variables (referenced by all charts)
- `lib/tochnyi-charts.js` - JavaScript helper functions for AMCharts (referenced by all charts)
- `charts/` - Output directory for generated charts organized by week

## Workflow

1. **Read reference.html** - Always read `reference.html` first to get the latest template and code patterns

2. **Analyze the text** - Extract:
   - Numbers/percentages/values
   - Categories or time periods
   - Relationships (comparisons, changes over time, distributions)
   - **Calculate missing data points** - If you have a value and a percentage change, calculate the previous/next value to create a comparison chart:
     - "Sales fell 30% to 326K" → Calculate: 326K ÷ (1 - 0.30) = 466K previous value → Create 2-bar chart
     - "Revenue grew 15% to $5M" → Calculate: 5M ÷ (1 + 0.15) = $4.35M previous value → Create 2-bar chart
     - This creates more compelling visualizations than single data points
   - **Years/dates** - If the text doesn't specify the year(s) for the data, you MUST ask the user before proceeding. Never assume or guess the year. Examples:
     - "Sales grew 15% compared to May" → Ask: "What year is this data from?"
     - "Q4 revenue was $5M" → Ask: "Which year's Q4?"
     - Only proceed if year is explicitly stated in the text or provided by the user
   - **Data source** - If the text doesn't mention the source, you MUST ask the user before proceeding. Never use placeholders like "User provided" or "User provided data". Examples:
     - No source mentioned → Ask: "What is the source for this data?"
     - Only proceed if source is explicitly stated or provided by the user

3. **Choose the best chart type** based on the data:
   - **Bar/Column**: Single series categorical comparison, or year-over-year with 2 data points (use years as x-axis categories)
   - **Grouped Bar**: Comparing 3+ categories across 2+ series (e.g., multiple metrics across multiple years)
   - **Stacked Bar**: Parts of a whole across categories
   - **Line**: Trends over time (5+ data points)
   - **Area**: Trends over time with emphasis on volume
   - **Pie/Donut**: Parts of a whole (use sparingly, max 5-6 slices)
   - **XY/Scatter**: Correlation between two variables

   **Important**: For simple year-over-year comparisons (2024 vs 2025), use a simple bar chart with years as categories and `Tochnyi.applyBarColors(series)` for alternating colors. Avoid grouped bars with only one category - it causes layout issues.

   **Change Badge**: For charts showing growth/decline, add a change badge to make the chart more engaging:
   ```html
   <div class="tochnyi-change-badge down">▼ 9.3%</div>  <!-- for decline -->
   <div class="tochnyi-change-badge up">▲ 15%</div>    <!-- for growth -->
   ```
   Place this inside the `tochnyi-chart-container` div. Two positioning options:
   - **Default** (no extra class): Positioned between bars (`right: 380px`) - use for 2-bar charts
   - **Corner** (add `corner` class): Top-right corner (`top: 20px; right: 20px`) - use for line charts or when default interferes

   Example: `<div class="tochnyi-change-badge down corner">▼ 0.4pp</div>`

   **Big Number** (for pie/donut charts): Instead of using `addDonutCenterLabel()` JS function, use HTML:
   ```html
   <div id="chartdiv" class="tochnyi-chart-container">
       <div class="tochnyi-big-number">
           <div class="number">568K</div>
           <div class="label">total</div>
       </div>
   </div>
   ```

   **Watermark Sizing**:
   - **Pie/Donut charts**: Use `class="tochnyi-watermark small"` (160px, top-right corner)
   - **All other charts** (bar, line, grouped bar): Use `class="tochnyi-watermark"` (large, centered, 80% height)

4. **Be creative** - Don't make boring charts! Think about what makes the data interesting:
   - What's the story? A rejection, a dramatic change, a surprising comparison?
   - Add custom visual elements when appropriate (stamps, badges, annotations)
   - Use the subtitle and title to frame the narrative
   - Consider custom inline styles for one-off effects (e.g., a "REJECTED" stamp rotated at an angle)
   - The goal is to make charts that people want to share, not just display data
   - **Avoid abbreviations** - Use descriptive names instead (e.g., "Russia's Largest Telecom" not "MTS", "Federal Antimonopoly Service" not "FAS"). International audiences won't know local acronyms.

5. **Explain your choice** - Tell the user why this chart type best visualizes their data

6. **Determine the week** - Before generating the file:
   - Run `powershell Get-Date -UFormat "%Y-week-%V"` to get current week (e.g., "2026-week-4")
   - Zero-pad to 2 digits: `2026-week-04` (for proper sorting)
   - Use this for the folder structure: `charts/2026-week-04/chart-name.html`
   - This organizes charts by publication week for easy packaging later

7. **Generate the HTML file** at `charts/[YYYY-week-WW]/[descriptive-name].html` (WW must be zero-padded)
   - Use the HTML template from `reference.html`
   - Adapt the JavaScript code from the relevant chart demo in `reference.html`
   - Ensure relative paths are correct for the week subfolder (use `../../lib/` instead of `lib/` or `../lib/`)

## Getting Code Examples

All code examples, templates, and patterns are in `reference.html`. When generating a chart:

1. **Read `reference.html`** to get the latest patterns
2. **Extract the HTML template** from the "HTML Template" section (around line 409-474)
3. **Find the matching chart demo** (bar, grouped-bar, line, or pie) and adapt the JavaScript code
4. **Check the CSS** for any special classes or patterns (change badges, big numbers, watermarks)

Key sections in `reference.html`:
- **Lines 409-474**: HTML template structure (copy this for all new charts)
- **Lines 487-519**: Bar chart demo code
- **Lines 522-563**: Grouped bar chart demo code
- **Lines 566-601**: Line chart demo code
- **Lines 604-629**: Pie/donut chart demo code

**Important differences from this skill doc:**
- `reference.html` uses `<img>` tag for logo (simpler than styled div)
- Big numbers for donut charts use HTML `.tochnyi-big-number` div (not JS `addDonutCenterLabel()`)
- Watermark positioning uses `.small` or `.corner` classes for flexibility

## Output

After generating the chart:
1. Create the `charts/[YYYY-week-WW]/` directory if it doesn't exist
2. Save the HTML file with a descriptive filename (e.g., `charts/2026-week-04/russia-bankruptcies-2025.html`)
3. Tell the user:
   - Why you chose this chart type
   - What data you extracted
   - The file path to open in their browser

## Maintaining Consistency

**When you fine-tune charts or discover better patterns:**
- Update `reference.html` with the improvement
- The next chart generation will automatically use the updated pattern
- No need to update this skill file - just read from `reference.html`

**Single source of truth hierarchy:**
1. `reference.html` - Template structure, working code examples, visual patterns
2. `lib/tochnyi.css` - All styling, colors, typography, layout
3. `lib/tochnyi-charts.js` - Reusable helper functions
4. This skill file - Workflow and decision-making guidance only
