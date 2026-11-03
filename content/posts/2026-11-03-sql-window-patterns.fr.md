---
title: "Cinq modèles SQL de fonctions de fenêtrage à garder sous la main"
slug: "sql-window-function-patterns"
lang: "fr"
date: "2026-11-03"
series: "code"
summary: "Dédoublonner des enregistrements, calculer des cumuls, comparer des périodes, obtenir des parts et classer au sein de groupes : cinq modèles T-SQL prêts à copier, qui fonctionnent aussi dans les entrepôts Microsoft Fabric."
tags: ["SQL", "T-SQL", "Microsoft Fabric"]
related_projects: []
sources: [{"title": "SELECT - OVER clause (Transact-SQL)", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/sql/t-sql/queries/select-over-clause-transact-sql"}, {"title": "Working with time series data in SQL Server 2022 and Azure SQL", "publisher": "Microsoft SQL Server Blog", "url": "https://www.microsoft.com/en-us/sql-server/blog/2023/01/12/working-with-time-series-data-in-sql-server-2022-and-azure-sql/"}]
published: true
review_ok: []
---

Les fonctions de fenêtrage sont le progrès le plus utile après les bases du SQL. Elles permettent de calculer sur des lignes liées entre elles — le mois précédent, le reste d'une région, la version la plus récente d'un enregistrement — sans regrouper les données comme le fait `GROUP BY`.

La clause `OVER` qui les rend possibles est prise en charge par SQL Server, Azure SQL, ainsi que par l'entrepôt (Warehouse) et le point de terminaison d'analytique SQL de Microsoft Fabric. Les modèles ci-dessous se transposent donc facilement d'une plateforme à l'autre. Tous les exemples utilisent une seule table simple :

| Colonne | Signification |
| --- | --- |
| `order_id` | Identifiant de commande |
| `customer_id` | Client |
| `region` | Région de vente |
| `order_date` | Date de la commande |
| `amount` | Montant de la commande |
| `updated_at` | Date de dernière modification de la ligne |

## 1. Dédoublonner : garder uniquement la dernière version de chaque enregistrement

Les systèmes sources envoient souvent plusieurs fois le même enregistrement. `ROW_NUMBER` numérote les versions pour conserver la plus récente.

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

Ajoutez une deuxième colonne dans l'`ORDER BY` (par exemple un identifiant de chargement) si deux versions peuvent avoir le même horodatage ; sinon, le choix de la ligne gagnante est arbitraire.

## 2. Cumul au sein d'un groupe

Une somme cumulée tient en une ligne. Précisez explicitement le cadre avec `ROWS` :

```sql
SELECT region, order_date, amount,
       SUM(amount) OVER (
           PARTITION BY region
           ORDER BY order_date, order_id
           ROWS UNBOUNDED PRECEDING
       ) AS running_total
FROM dbo.sales;
```

Pourquoi `ROWS` ? Avec un `ORDER BY` sans cadre, la valeur par défaut est `RANGE UNBOUNDED PRECEDING AND CURRENT ROW`, qui traite les lignes ayant la même date comme un seul bloc. Deux commandes du même jour afficheraient alors le même cumul. `ROWS` avance ligne par ligne.

## 3. Variation par rapport à la période précédente

Agrégez d'abord, puis comparez chaque mois au précédent avec `LAG`. `NULLIF` évite l'erreur de division par zéro.

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

`LAG` regarde la ligne précédente, pas le mois civil précédent. Si une région peut avoir des mois sans ventes, construisez d'abord une liste complète des mois (voir le bonus) pour que les trous ne faussent pas la comparaison.

## 4. Part du total

Un agrégat de fenêtre sans `ORDER BY` renvoie le total du groupe sur chaque ligne, ce qui simplifie le calcul des pourcentages :

```sql
SELECT region, customer_id,
       SUM(amount) AS customer_revenue,
       100.0 * SUM(amount) / SUM(SUM(amount)) OVER (PARTITION BY region) AS pct_of_region
FROM dbo.sales
GROUP BY region, customer_id;
```

Le `SUM(SUM(amount))` n'est pas une coquille : le `SUM` intérieur est l'agrégat du `GROUP BY`, et l'extérieur additionne ces résultats sur la fenêtre.

## 5. Les N premiers de chaque groupe

Pour afficher les trois plus gros clients de chaque région, classez-les puis filtrez :

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

Utilisez `DENSE_RANK` quand des ex æquo doivent partager le même rang, et `ROW_NUMBER` quand il vous faut exactement trois lignes par groupe.

## Bonus : un calendrier complet des mois

Sur SQL Server 2022 et Azure SQL, `GENERATE_SERIES` crée une suite de nombres que l'on peut transformer en dates, ce qui est pratique pour combler les trous avant le modèle 3. Elle exige un niveau de compatibilité de base de données de 160 ou plus ; vérifiez la documentation de votre plateforme avant de vous y fier ailleurs.

```sql
SELECT DATEADD(MONTH, value, '2024-01-01') AS month_start
FROM GENERATE_SERIES(0, 23);
```

Faites ensuite une jointure externe gauche de vos totaux mensuels sur cette liste et remplacez les revenus manquants par zéro avec `COALESCE`.

## Aide-mémoire

- Ajoutez toujours un critère de départage dans l'`ORDER BY` d'un `OVER` quand l'ordre doit être déterministe.
- Préférez un cadre `ROWS` pour les cumuls.
- Agrégez au bon niveau (jour, mois) avant d'utiliser `LAG` ou `LEAD`.
- Protégez les diviseurs avec `NULLIF(..., 0)`.

Ces cinq modèles couvrent une grande part de la logique de rapport du quotidien. Une fois devenus des réflexes, bien des requêtes qui exigeaient des tables temporaires ou des étapes dans un tableur se réduisent à une seule instruction lisible.
