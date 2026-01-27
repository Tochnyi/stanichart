# Tochnyi Charts Library

A data visualization library for creating beautiful, shareable charts in Ukrainian flag colors (blue and yellow). Designed for Claude Code with a chart generation skill that converts text descriptions into interactive HTML charts.

## Overview

Tochnyi Charts helps you create professional, publication-ready data visualizations quickly. Simply provide data as text, and the Claude Code chart skill will generate a complete HTML chart with proper styling, layout, and branding.

## Prerequisites

### Required Software

1. **Claude Code CLI** - The official Claude Code command-line interface
   - Download from: https://github.com/anthropics/claude-code
   - Requires Claude API access (Sonnet 4.5 recommended)

2. **Web Browser** - Any modern browser to view generated charts
   - Chrome, Firefox, Safari, or Edge

3. **Git** (optional) - For version control
   - Download from: https://git-scm.com/

### Technical Requirements

- No JavaScript/TypeScript compilation needed
- No npm/node dependencies required
- Charts work as standalone HTML files with CDN-hosted libraries

## Project Structure

```
stanichart/
├── README.md                          # This file
├── reference.html                     # Master reference with all chart examples
├── lib/
│   ├── tochnyi.css                   # Shared styles and variables
│   ├── tochnyi-charts.js             # AMCharts helper functions
│   ├── tochnyi-logo.png              # Logo image
│   └── watermark.svg                 # Watermark graphic
├── charts/
│   └── YYYY-week-WW/                 # Charts organized by publication week
│       └── chart-name.html           # Generated chart files
└── .claude/
    └── skills/
        └── tochnyi-chart.md          # Chart generation skill for Claude Code
```

## Getting Started

### 1. Set Up Claude Code

```bash
# Install Claude Code (follow instructions at the URL above)
# Configure your Claude API key
claude-code configure

# Navigate to the project directory
cd path/to/stanichart
```

### 2. View the Reference

Open `reference.html` in your browser to see all available chart types, color palettes, and code examples. This is your design system documentation.

### 3. Generate Your First Chart

In Claude Code, there are two ways to use the chart skill:

#### Method 1: Natural Language (Recommended for Long Text)

Simply describe what you want in natural language:

```
Create a chart with this data: In 2025, Russian bankruptcies rose 31.5% to 568,000.
97.3% were self-initiated, 2.1% by creditors, 0.6% by tax authorities.
```

Claude will automatically recognize this as a chart request and use the chart skill.

#### Method 2: Skill Command (For Short Requests)

Use the skill command directly:

```
use your chart skill with this text "bankruptcy data here"
```

**Note**: The `/chart` slash command syntax has limitations with long text prompts and may not work reliably. Use natural language instead.

#### What Happens Next

Claude will:
1. Analyze the data
2. Choose the appropriate chart type
3. Generate an HTML file in `charts/YYYY-week-WW/`
4. Tell you where to open it

### 4. View the Chart

Open the generated HTML file in your browser. The chart is:
- **Interactive** - Powered by AMCharts 5
- **Standalone** - No server needed, works offline
- **Shareable** - Send the HTML file or screenshot it
- **Print-ready** - Optimized for social media and reports

## Chart Types

The library supports:

- **Bar/Column Charts** - Compare categories, show year-over-year changes
- **Grouped Bar Charts** - Compare multiple series across categories
- **Line Charts** - Show trends over time (5+ data points)
- **Pie/Donut Charts** - Show parts of a whole (3-6 categories)
- **Change Badges** - Highlight growth/decline with visual indicators

## Color Palette

Based on Ukrainian flag colors:

- **Primary Blue**: `#005bbb`
- **Primary Yellow**: `#ffd500`
- **Blue Light**: `#0088ff` (bright accent)
- **Blue Dark**: `#003d7a` (depth)
- **Yellow Dark**: `#cc9900` (warm accent)
- **Yellow Light**: `#ffeb3b` (bright accent)

## Customization

### Single Source of Truth

The project follows a "single source of truth" principle:

1. **`reference.html`** - Master template with all chart code examples
2. **`lib/tochnyi.css`** - All styling, colors, typography, layout
3. **`lib/tochnyi-charts.js`** - Reusable helper functions
4. **`.claude/skills/tochnyi-chart.md`** - Workflow guidance (no code)

### Making Changes

**To update chart styling or behavior:**

1. Edit `reference.html` with your changes
2. Test in browser to verify it works
3. The chart skill automatically reads from `reference.html` for future charts

**To update colors:**

1. Edit `lib/tochnyi.css` (CSS variables)
2. Edit `lib/tochnyi-charts.js` (color palette)
3. Update `reference.html` (color swatches)
4. Changes apply to all new charts automatically

## Features

### Automatic Layout

Charts use smart positioning:
- **Top-left**: Big numbers (for donut charts)
- **Top-right**: Large watermark
- **Bottom-left**: Change badges
- **Bottom-right**: Legend (vertical list)
- **Footer**: Source (left) + Social links (right)

### Responsive Design

- Max-width: 1200px
- Optimized for 16:9 screenshots
- Mobile-friendly when needed

### Branding

Every chart includes:
- Tochnyi logo
- Date stamp
- Watermark (customizable size)
- Footer with social links (@delfoo)

## Weekly Organization

Charts are organized by publication week for easy packaging:

```
charts/
├── 2026-week-04/
│   ├── russia-bankruptcies-2025.html
│   └── another-chart.html
└── 2026-week-05/
    └── new-chart.html
```

This makes it easy to:
- Package all charts from a specific week
- Track when charts were created
- Archive by time period

## Advanced Usage

### Reading Chart Metadata

Each generated chart includes metadata in HTML comments:

```html
<!--
CHART METADATA
==============
Week: 2026-week-04
Date: 2026-01-27
Chart Type: donut
Topic: bankruptcy, consumer debt
Country: Russia
Data Period: 2025
Source: User provided
Key Finding: Personal bankruptcies surged 31.5% to 568,000
Created By: Claude Sonnet 4.5
-->
```

### Customizing Individual Charts

Charts are self-contained HTML files. You can:
- Edit the title/subtitle directly in the HTML
- Modify data in the JavaScript section
- Add custom CSS inline for one-off styling
- Change colors for specific series

### Helper Functions

Available in `Tochnyi` object (see `lib/tochnyi-charts.js`):

```javascript
// Create chart elements
Tochnyi.createRoot(containerId)
Tochnyi.createColumnSeries(root, chart, options)
Tochnyi.createLineSeries(root, chart, options)
Tochnyi.createPieSeries(root, chart, options)
Tochnyi.createLegend(root, chart, options)
Tochnyi.createPieLegend(root, chart)  // Right-aligned, vertical

// Apply colors
Tochnyi.applyBarColors(series)  // Alternating colors per bar

// Axis styling
Tochnyi.createXRenderer(root, options)
Tochnyi.createYRenderer(root, options)
Tochnyi.addYAxisLabel(root, yAxis, text)
```

## Best Practices

1. **Be Creative** - Charts should tell a story, not just show data
2. **Avoid Abbreviations** - Use full names (international audience)
3. **Choose the Right Chart** - Pie for parts of whole, line for trends, bar for comparisons
4. **Include Context** - Titles and subtitles should explain the insight
5. **Cite Sources** - Always include data source

## Troubleshooting

### Chart Skill Not Found

Make sure you're in the project directory:
```bash
cd path/to/stanichart
```

The skill file must be at `.claude/skills/tochnyi-chart.md`

### Charts Look Wrong

1. Check browser console for JavaScript errors
2. Verify CDN links are accessible (requires internet)
3. Ensure file paths are correct (`../../lib/` for week subdirectories)

### Colors Not Updating

CSS changes require browser refresh. For reference.html:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache if needed

## Contributing

When improving the library:

1. Update `reference.html` first (single source of truth)
2. Test thoroughly in browser
3. Verify the chart skill generates correct code
4. Update this README if adding new features

## License

Created for Tochnyi data visualization project.

## Credits

- **Charts**: AMCharts 5 (https://www.amcharts.com/)
- **Font**: Mukta from Google Fonts
- **Colors**: Ukrainian flag (blue #005bbb, yellow #ffd500)
- **Generated by**: Claude Sonnet 4.5 via Claude Code
- **Analysis by**: [@delfoo](https://x.com/delfoo)

## Support

For issues or questions:
- Review `reference.html` for examples
- Check `.claude/skills/tochnyi-chart.md` for workflow details
- Examine existing charts in `charts/` for patterns

---

**Happy charting!** 📊🇺🇦
