# Tochnyi Chart Generator

When the user provides text containing data or statistics, analyze it and generate an interactive chart in Tochnyi style.

## Files Structure

The chart library consists of:
- `lib/tochnyi.css` - Shared CSS styles and variables
- `lib/tochnyi-charts.js` - JavaScript helper functions for AMCharts
- `reference.html` - Reference page with all chart types and code examples
- `charts/` - Output directory for generated charts

## Workflow

1. **Analyze the text** - Extract:
   - Numbers/percentages/values
   - Categories or time periods
   - Relationships (comparisons, changes over time, distributions)

2. **Choose the best chart type** based on the data:
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

3. **Be creative** - Don't make boring charts! Think about what makes the data interesting:
   - What's the story? A rejection, a dramatic change, a surprising comparison?
   - Add custom visual elements when appropriate (stamps, badges, annotations)
   - Use the subtitle and title to frame the narrative
   - Consider custom inline styles for one-off effects (e.g., a "REJECTED" stamp rotated at an angle)
   - The goal is to make charts that people want to share, not just display data
   - **Avoid abbreviations** - Use descriptive names instead (e.g., "Russia's Largest Telecom" not "MTS", "Federal Antimonopoly Service" not "FAS"). International audiences won't know local acronyms.

4. **Explain your choice** - Tell the user why this chart type best visualizes their data

5. **Generate the HTML file** at `charts/[descriptive-name].html`

## Tochnyi Style Guide

### Colors (defined in CSS variables and JS)
```css
--tochnyi-blue: #005bbb;
--tochnyi-yellow: #ffd500;
--tochnyi-blue-light: #245eab;
--tochnyi-yellow-dark: #fdd400;
--tochnyi-blue-dark: #003d7a;
--tochnyi-black: #020303;
--tochnyi-gray: #666666;
```

### JavaScript Color Access
```javascript
Tochnyi.colors.blue      // 0x005bbb
Tochnyi.colors.yellow    // 0xffd500
Tochnyi.palette          // Array of all colors for series
```

### Typography
- Font: Mukta (Google Fonts)
- Title: 42px, weight 400
- Subtitle: 22px, weight 500
- Axis labels: 18-20px, weight 500
- Axis titles: 16px, weight 600, UPPERCASE
- Value labels on bars: 28px, weight 700, white (or black on yellow bars)
- Footer: 16px

### Label Colors
- Blue bars: white text (default)
- Yellow bars: black text (use `labelColor: Tochnyi.colors.black`)
- When using `Tochnyi.applyBarColors(series)`, label colors are automatically adjusted

## HTML Template

```html
<!--
Original text:
[PASTE THE ORIGINAL SOURCE TEXT HERE]
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[CHART TITLE]</title>
    <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../lib/tochnyi.css">
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
    <script src="../lib/tochnyi-charts.js"></script>
</head>
<body>
    <div class="tochnyi-chart">
        <div class="tochnyi-header">
            <img src="../lib/tochnyi-logo.png" class="tochnyi-logo" alt="Tochnyi">
            <div class="tochnyi-date">Date: [TODAY'S DATE]</div>
        </div>

        <h1 class="tochnyi-title">[TITLE]</h1>
        <p class="tochnyi-subtitle">[SUBTITLE with <span class="tochnyi-highlight">highlights</span>]</p>

        <div id="chartdiv" class="tochnyi-chart-container">
            <img src="../lib/watermark.svg" class="tochnyi-watermark" alt="">
        </div>

        <div class="tochnyi-source">Source: [SOURCE]</div>

        <div class="tochnyi-footer">
            <span>Analysis by:</span>
            <a href="https://x.com/delfoo">@delfoo</a>
            <a href="https://bsky.app/profile/delfoo.bsky.social">@delfoo.bsky.social</a>
        </div>
    </div>

    <script>
        am5.ready(function() {
            // Chart code using Tochnyi helpers
        });
    </script>
</body>
</html>
```

## AMCharts Code Using Tochnyi Helpers

### Bar Chart
```javascript
am5.ready(function() {
    var root = Tochnyi.createRoot("chartdiv");
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false, panY: false, wheelX: "none", wheelY: "none",
        paddingLeft: 10, paddingRight: 10, layout: root.verticalLayout
    }));

    var data = [
        { category: "Category A", value: 85 },
        { category: "Category B", value: 65 }
    ];

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: Tochnyi.createXRenderer(root)
    }));
    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0, numberFormat: "#'%'",
        renderer: Tochnyi.createYRenderer(root)
    }));
    Tochnyi.addYAxisLabel(root, yAxis, "Y-AXIS TITLE");

    var series = Tochnyi.createColumnSeries(root, chart, {
        name: "Value", xAxis: xAxis, yAxis: yAxis,
        valueField: "value", categoryField: "category",
        labelFormat: "{valueY}%"
    });
    Tochnyi.applyBarColors(series); // Multi-color bars
    series.data.setAll(data);

    chart.appear(1000, 100);
});
```

### Grouped Bar Chart
```javascript
am5.ready(function() {
    var root = Tochnyi.createRoot("chartdiv");
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false, panY: false, wheelX: "none", wheelY: "none",
        paddingLeft: 10, paddingRight: 10, layout: root.verticalLayout
    }));

    var data = [
        { category: "Category A", before: 2, after: 4 },
        { category: "Category B", before: 1, after: 2 }
    ];

    var xRenderer = Tochnyi.createXRenderer(root, { cellStartLocation: 0.1, cellEndLocation: 0.9 });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "category", renderer: xRenderer
    }));
    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0, numberFormat: "#'%'",
        renderer: Tochnyi.createYRenderer(root)
    }));

    var series1 = Tochnyi.createColumnSeries(root, chart, {
        name: "Before", xAxis: xAxis, yAxis: yAxis,
        valueField: "before", categoryField: "category",
        color: Tochnyi.colors.blue, labelFormat: "{valueY}%"
    });
    series1.data.setAll(data);

    var series2 = Tochnyi.createColumnSeries(root, chart, {
        name: "After", xAxis: xAxis, yAxis: yAxis,
        valueField: "after", categoryField: "category",
        color: Tochnyi.colors.yellow, labelFormat: "{valueY}%",
        labelColor: Tochnyi.colors.black  // Black text on yellow bars
    });
    series2.data.setAll(data);

    var legend = Tochnyi.createLegend(root, chart);
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);
});
```

### Line Chart
```javascript
am5.ready(function() {
    var root = Tochnyi.createRoot("chartdiv");
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true, panY: false, wheelX: "panX", wheelY: "zoomX",
        paddingLeft: 10, paddingRight: 10, layout: root.verticalLayout
    }));

    var data = [
        { date: "2020", value: 100 },
        { date: "2021", value: 150 },
        { date: "2022", value: 180 }
    ];

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "date",
        renderer: Tochnyi.createXRenderer(root, { minGridDistance: 50 })
    }));
    xAxis.data.setAll(data);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        min: 0, renderer: Tochnyi.createYRenderer(root)
    }));

    var series = Tochnyi.createLineSeries(root, chart, {
        name: "Trend", xAxis: xAxis, yAxis: yAxis,
        valueField: "value", categoryField: "date",
        color: Tochnyi.colors.blue
    });
    series.data.setAll(data);
    series.appear(1000);

    chart.appear(1000, 100);
});
```

### Pie/Donut Chart
```javascript
am5.ready(function() {
    var root = Tochnyi.createRoot("chartdiv");
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50) // Remove for solid pie
    }));

    var data = [
        { category: "Part A", value: 60 },
        { category: "Part B", value: 30 },
        { category: "Part C", value: 10 }
    ];

    var series = Tochnyi.createPieSeries(root, chart, {
        valueField: "value",
        categoryField: "category",
        labelFormat: "{category}: {value}%"
    });
    series.data.setAll(data);

    // For donut charts, add center label
    Tochnyi.addDonutCenterLabel(root, chart, "100K", "total");

    var legend = Tochnyi.createLegend(root, chart);
    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);
});
```

## Output

After generating the chart:
1. Create the `charts/` directory if it doesn't exist
2. Save the HTML file with a descriptive filename (e.g., `charts/russia-bankruptcies-2025.html`)
3. Tell the user:
   - Why you chose this chart type
   - What data you extracted
   - The file path to open in their browser
