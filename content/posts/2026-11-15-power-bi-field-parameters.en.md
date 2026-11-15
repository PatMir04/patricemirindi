---
title: "One chart, many views: field parameters in Power BI after the October 2026 update"
slug: "power-bi-field-parameters"
lang: "en"
date: "2026-11-15"
series: "fabric"
summary: "Field parameters let report viewers choose what a chart shows. The October 2026 Power BI update makes bar, column and line charts expand hierarchy axes automatically when several fields are selected. Here is how to set it up, with copy-ready DAX."
tags: ["Power BI", "DAX", "Microsoft Fabric"]
related_projects: []
sources: [{"title": "What's new in Power BI? October 2026 update", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/power-bi/fundamentals/whats-new"}, {"title": "Let report readers use field parameters to change visuals", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-field-parameters"}, {"title": "Power BI October 2026 Feature Summary", "publisher": "Microsoft Fabric Community", "url": "https://community.fabric.microsoft.com/blog/fbc_pbiupdatesblog/power-bi-october-2026-feature-summary/5374650"}]
published: true
review_ok: []
---

Most report pages grow the same way. Someone asks for sales by region, then by product, then by year, and each request becomes another chart. Soon the page is crowded, slow to load and hard to read.

Field parameters fix this by letting the person reading the report decide what a chart shows. One chart, one slicer, many views. The October 2026 Power BI update makes them even more useful: bar, column and line charts can now **automatically expand hierarchy axes when several columns are selected**, including columns supplied by a field parameter. Viewers can switch axis fields with a slicer or with **Personalize this visual**.

This article walks through a practical set-up using a simple development-indicators model, similar to the World Bank data behind this site's [dashboard](/data-analytics.html).

A field parameter is a small calculated table that lists fields (columns or measures) the viewer can pick from. You place it in a visual's axis or values well, and add it to a slicer. When the viewer picks "Region" in the slicer, the chart groups by region; when they pick "Income group", it regroups instantly. No bookmarks, no duplicated visuals.

Microsoft's documentation notes a few useful properties:

- A parameter can mix fields from different tables.
- You can mix and match measures and dimensions within the same parameter, although in practice one parameter for the axis and another for values is easier to maintain.
- Column-based parameters go in the axis field wells; measure-based parameters go in the values field wells.

The model in this example has a `Country` table (country, region, income group), a `Calendar` table (year, decade) and an `Indicators` fact table holding values such as GDP per capita or access to electricity.

## Step 1: create the axis parameter

In Power BI Desktop, open the **Modeling** tab and choose **New parameter** > **Fields**. Pick the fields, give the parameter a name, and Power BI writes the DAX for you. You can also edit that DAX directly, which is the fastest way to rename or reorder options. Each row holds a display name, a reference to the field, and a sort order:

```dax
Axis Choice = {
    ("Region", NAMEOF('Country'[Region]), 0),
    ("Income group", NAMEOF('Country'[Income Group]), 1),
    ("Country", NAMEOF('Country'[Country Name]), 2),
    ("Decade", NAMEOF('Calendar'[Decade]), 3)
}
```

Keep exactly three values per row and make every value unique; the documentation warns that extra columns can lead to unexpected results. To add an option later, type a comma after the last row and add a new one.

## Step 2: write explicit measures

Field parameters do not accept implicit measures (dragging a raw numeric column and letting Power BI sum it). Define explicit DAX measures first, then reference them in a second parameter for the values:

```dax
Average Value = AVERAGE ( Indicators[Value] )

Countries Reporting = DISTINCTCOUNT ( Indicators[Country Code] )
```

## Step 3: create the measure parameter

With those measures in place, a second parameter lets the viewer switch between the average value and how many countries have data, which is a good habit for any indicator chart: show the number, and show how much data sits behind it.

```dax
Measure Choice = {
    ("Average value", NAMEOF([Average Value]), 0),
    ("Countries reporting", NAMEOF([Countries Reporting]), 1)
}
```

## Step 4: let the axis expand

Place `Axis Choice` on the X-axis of a column or line chart and `Measure Choice` in its values. Add `Axis Choice` to a slicer and allow multiple selections.

This is where the October update helps. When a viewer selects both "Region" and "Country", the chart can now expand the axis as a hierarchy, so they see regions with their countries nested underneath, rather than having to rebuild the visual. Viewers who prefer not to use a slicer can change the axis fields through **Personalize this visual**, if you have enabled personalization for the report.

For a cleaner slicer, right-click the parameter in the **Build** pane and choose **Show values of the selected field**. The slicer then behaves like a hierarchy slicer. This option works only for parameters that contain columns, not measures.

## Limits to know, and takeaways

Field parameters are mature, but a few constraints from the documentation will save you a support call:

- **AI visuals and Q&A** do not work with field parameters.
- **Selecting nothing equals selecting everything.** Viewers cannot choose "none", so set a sensible default selection.
- **Drill-through and tooltip pages** cannot use a field parameter as their linked field.
- **Dates:** a date column in a parameter loses its date hierarchy when auto date/time is on. A proper `Calendar` table with `Year` and `Decade` columns, as above, avoids the issue.
- **Live connections** without a local model cannot create field parameters; DirectQuery models can, once a local model is added.

In short:

- Replace near-duplicate charts with one visual, one axis parameter and one measure parameter.
- Write explicit measures early; they are required here and make models easier to test.
- Edit the generated DAX to control labels and order, and keep it to three unique values per row.
- After the October 2026 update, allow multi-select on the axis slicer so viewers can drill from regions to countries in the same chart.
- Pair every value with a coverage measure such as "countries reporting" so readers know how much data sits behind each bar.

Fewer visuals, clearer pages and readers who can answer their own follow-up questions: that is a good return for a few lines of DAX.
