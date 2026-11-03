---
title: "Five SQL window-function patterns every analyst should keep handy"
slug: "sql-window-function-patterns"
lang: "en"
date: "2026-11-03"
series: "code"
summary: "Deduplicate records, build running totals, compare periods, compute shares and rank within groups — five copy-ready T-SQL patterns that also run in Microsoft Fabric warehouses."
tags: ["SQL", "T-SQL", "Microsoft Fabric"]
related_projects: []
sources: [{"title": "SELECT - OVER clause (Transact-SQL)", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/sql/t-sql/queries/select-over-clause-transact-sql"}, {"title": "Working with time series data in SQL Server 2022 and Azure SQL", "publisher": "Microsoft SQL Server Blog", "url": "https://www.microsoft.com/en-us/sql-server/blog/2023/01/12/working-with-time-series-data-in-sql-server-2022-and-azure-sql/"}]
published: true
review_ok: []
---

Window functions are the single most useful step up from basic SQL. They let you calculate across related rows — the previous month, the rest of a region, the latest version of a record — without collapsing your data the way `GROUP BY` does.

The `OVER` clause that powers them is supported across SQL Server, Azure SQL, and the Warehouse and SQL analytics endpoint in Microsoft Fabric, so the patterns below travel well between platforms. All examples use one simple table:

| Column | Meaning |
| --- | --- |
| `order_id` | Order identifier |
| `customer_id` | Customer |
| `region` | Sales region |
| `order_date` | Date of the order |
| `amount` | Order value |
| `updated_at` | When the row was last changed |

## 1. Remove duplicates: keep only the latest version of each record

Source systems often send the same record several times. `ROW_NUMBER` numbers the versions so you can keep the newest one.

```sql
WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY updated_at DESC) AS rn
    FROM dbo.sales
)
SELECT order_id, customer_id, region, order_date, amount
FROM ranked
WHERE rn = 1;
```

Add a second column to the `ORDER BY` (for example an ingestion ID) if two versions can share the same timestamp; otherwise the winner is arbitrary.

## 2. Running total within a group

A cumulative sum is one line. Specify the frame explicitly with `ROWS`:

```sql
SELECT region, order_date, amount,
       SUM(amount) OVER (
           PARTITION BY region
           ORDER BY order_date, order_id
           ROWS UNBOUNDED PRECEDING
       ) AS running_total
FROM dbo.sales;
```

Why `ROWS`? When you write `ORDER BY` without a frame, the default is `RANGE UNBOUNDED PRECEDING AND CURRENT ROW`, which treats rows with the same date as one block. Two orders on the same day would then show the same running total. `ROWS` moves one row at a time.

## 3. Change versus the previous period

Aggregate first, then compare each month with the one before using `LAG`. `NULLIF` avoids a divide-by-zero error.

```sql
WITH monthly AS (
    SELECT region,
           DATEFROMPARTS(YEAR(order_date), MONTH(order_date), 1) AS month_start,
           SUM(amount) AS revenue
    FROM dbo.sales
    GROUP BY region, DATEFROMPARTS(YEAR(order_date), MONTH(order_date), 1)
)
SELECT region, month_start, revenue,
       LAG(revenue) OVER (PARTITION BY region ORDER BY month_start) AS prev_revenue,
       100.0 * (revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY month_start))
             / NULLIF(LAG(revenue) OVER (PARTITION BY region ORDER BY month_start), 0) AS pct_change
FROM monthly;
```

`LAG` looks at the previous row, not the previous calendar month. If a region can have months with no sales, build a complete month list first (see the bonus below) so gaps don't distort the comparison.

## 4. Share of the total

A window aggregate with no `ORDER BY` returns the group total on every row, which makes percentages straightforward:

```sql
SELECT region, customer_id,
       SUM(amount) AS customer_revenue,
       100.0 * SUM(amount) / SUM(SUM(amount)) OVER (PARTITION BY region) AS pct_of_region
FROM dbo.sales
GROUP BY region, customer_id;
```

The `SUM(SUM(amount))` is not a typo: the inner `SUM` is the `GROUP BY` aggregate, and the outer one adds those results up across the window.

## 5. Top N within each group

To list the three largest customers in each region, rank them and filter:

```sql
WITH customer_totals AS (
    SELECT region, customer_id, SUM(amount) AS revenue
    FROM dbo.sales
    GROUP BY region, customer_id
), ranked AS (
    SELECT *, DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS rnk
    FROM customer_totals
)
SELECT region, customer_id, revenue, rnk
FROM ranked
WHERE rnk <= 3
ORDER BY region, rnk;
```

Use `DENSE_RANK` when ties should share a place, and `ROW_NUMBER` when you need exactly three rows per group.

## Bonus: a complete calendar of months

On SQL Server 2022 and Azure SQL, `GENERATE_SERIES` creates a number sequence you can turn into dates — handy for filling gaps before pattern 3. It needs database compatibility level 160 or higher; check your platform's documentation before relying on it elsewhere.

```sql
SELECT DATEADD(MONTH, value, '2024-01-01') AS month_start
FROM GENERATE_SERIES(0, 23);
```

Left-join your monthly totals to this list and replace missing revenue with zero using `COALESCE`.

## Quick checklist

- Always include a tie-breaker in `ORDER BY` inside `OVER` when the order must be deterministic.
- Prefer `ROWS` frames for running totals.
- Aggregate to the grain you want (day, month) before using `LAG` or `LEAD`.
- Wrap divisors in `NULLIF(..., 0)`.

These five patterns cover a large share of everyday reporting logic. Once they become habits, many queries that used to need temporary tables or spreadsheet steps shrink to a single readable statement.
