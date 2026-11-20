---
title: "Un graphique, plusieurs vues : les paramètres de champ dans Power BI après la mise à jour d'octobre 2026"
slug: "power-bi-field-parameters"
lang: "fr"
date: "2026-11-15"
series: "fabric"
summary: "Les paramètres de champ permettent au lecteur de choisir ce qu'affiche un graphique. Depuis la mise à jour d'octobre 2026, les graphiques à barres, à colonnes et en courbes déploient automatiquement les axes hiérarchiques lorsque plusieurs champs sont sélectionnés. Voici comment les mettre en place, avec du DAX prêt à copier."
tags: ["Power BI", "DAX", "Microsoft Fabric"]
related_projects: []
sources: [{"title": "What's new in Power BI? October 2026 update", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/power-bi/fundamentals/whats-new"}, {"title": "Let report readers use field parameters to change visuals", "publisher": "Microsoft Learn", "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/power-bi-field-parameters"}, {"title": "Power BI October 2026 Feature Summary", "publisher": "Microsoft Fabric Community", "url": "https://community.fabric.microsoft.com/blog/fbc_pbiupdatesblog/power-bi-october-2026-feature-summary/5374650"}]
published: true
review_ok: []
---

La plupart des pages de rapport grossissent de la même façon. On demande les ventes par région, puis par produit, puis par année, et chaque demande devient un nouveau graphique. Bientôt, la page est encombrée, lente à charger et difficile à lire.

Les paramètres de champ règlent ce problème en laissant la personne qui consulte le rapport décider de ce que montre un graphique. Un graphique, un segment, plusieurs vues. La mise à jour d'octobre 2026 de Power BI les rend encore plus utiles : les graphiques à barres, à colonnes et en courbes peuvent maintenant **déployer automatiquement les axes hiérarchiques lorsque plusieurs colonnes sont sélectionnées**, y compris celles fournies par un paramètre de champ. Le lecteur peut changer les champs de l'axe avec un segment ou avec l'option **Personnaliser ce visuel**.

Cet article présente une mise en place concrète à partir d'un modèle simple d'indicateurs de développement, semblable aux données de la Banque mondiale qui alimentent le [tableau de bord](/data-analytics.html) de ce site.

Un paramètre de champ est une petite table calculée qui énumère les champs (colonnes ou mesures) parmi lesquels le lecteur peut choisir. On le place dans l'axe ou dans les valeurs d'un visuel, puis dans un segment. Si le lecteur choisit « Région », le graphique regroupe par région; s'il choisit « Groupe de revenu », tout se réorganise aussitôt. Pas de signets, pas de visuels en double.

La documentation de Microsoft signale quelques propriétés utiles :

- Un paramètre peut combiner des champs provenant de tables différentes.
- On peut mélanger mesures et dimensions dans un même paramètre, mais en pratique, un paramètre pour l'axe et un autre pour les valeurs est plus facile à maintenir.
- Les paramètres de colonnes vont dans les zones d'axe; les paramètres de mesures, dans les zones de valeurs.

Le modèle de l'exemple comprend une table `Country` (pays, région, groupe de revenu), une table `Calendar` (année, décennie) et une table de faits `Indicators` qui contient des valeurs comme le PIB par habitant ou l'accès à l'électricité.

## Étape 1 : créer le paramètre d'axe

Dans Power BI Desktop, ouvrez l'onglet **Modélisation** et choisissez **Nouveau paramètre** > **Champs**. Sélectionnez les champs, nommez le paramètre, et Power BI écrit le DAX à votre place. Vous pouvez aussi modifier ce DAX directement : c'est la façon la plus rapide de renommer ou de réordonner les choix. Chaque ligne contient un nom affiché, une référence au champ et un ordre de tri :

```dax
Axis Choice = {
    ("Région", NAMEOF('Country'[Region]), 0),
    ("Groupe de revenu", NAMEOF('Country'[Income Group]), 1),
    ("Pays", NAMEOF('Country'[Country Name]), 2),
    ("Décennie", NAMEOF('Calendar'[Decade]), 3)
}
```

Gardez exactement trois valeurs par ligne et rendez chaque valeur unique; la documentation prévient que des colonnes supplémentaires peuvent produire des résultats inattendus. Pour ajouter un choix plus tard, mettez une virgule après la dernière ligne et ajoutez-en une nouvelle.

## Étape 2 : écrire des mesures explicites

Les paramètres de champ n'acceptent pas les mesures implicites (glisser une colonne numérique brute et laisser Power BI en faire la somme). Définissez d'abord des mesures DAX explicites, que vous utiliserez ensuite dans un second paramètre pour les valeurs :

```dax
Average Value = AVERAGE ( Indicators[Value] )

Countries Reporting = DISTINCTCOUNT ( Indicators[Country Code] )
```

## Étape 3 : créer le paramètre de mesures

Avec ces mesures en place, un second paramètre permet au lecteur de passer de la valeur moyenne au nombre de pays qui ont des données. C'est une bonne habitude pour tout graphique d'indicateurs : montrer le chiffre, et montrer combien de données le soutiennent.

```dax
Measure Choice = {
    ("Valeur moyenne", NAMEOF([Average Value]), 0),
    ("Pays déclarants", NAMEOF([Countries Reporting]), 1)
}
```

## Étape 4 : laisser l'axe se déployer

Placez `Axis Choice` sur l'axe X d'un graphique à colonnes ou en courbes, et `Measure Choice` dans ses valeurs. Ajoutez `Axis Choice` à un segment et autorisez la sélection multiple.

C'est là que la mise à jour d'octobre fait la différence. Quand le lecteur sélectionne à la fois « Région » et « Pays », le graphique peut maintenant déployer l'axe comme une hiérarchie : il voit les régions, avec leurs pays imbriqués en dessous, sans devoir reconstruire le visuel. Ceux qui préfèrent se passer du segment peuvent modifier les champs de l'axe avec **Personnaliser ce visuel**, si la personnalisation est activée pour le rapport.

Pour un segment plus clair, cliquez avec le bouton droit sur le paramètre dans le volet **Générer** et choisissez **Afficher les valeurs du champ sélectionné**. Le segment se comporte alors comme un segment hiérarchique. Cette option ne fonctionne qu'avec les paramètres qui contiennent des colonnes, pas des mesures.

## Limites à connaître, et points à retenir

Les paramètres de champ sont éprouvés, mais quelques contraintes tirées de la documentation vous éviteront des appels de soutien :

- **Les visuels d'IA et Questions et réponses** ne fonctionnent pas avec les paramètres de champ.
- **Ne rien sélectionner revient à tout sélectionner.** Le lecteur ne peut pas choisir « aucun »; prévoyez donc une sélection par défaut sensée.
- **Les pages d'extraction et d'info-bulle** ne peuvent pas utiliser un paramètre de champ comme champ lié.
- **Les dates :** une colonne de date dans un paramètre perd sa hiérarchie de dates lorsque la date/heure automatique est activée. Une vraie table `Calendar` avec des colonnes `Year` et `Decade`, comme ci-dessus, évite le problème.
- **Les connexions actives** sans modèle local ne permettent pas de créer des paramètres de champ; les modèles DirectQuery le peuvent, une fois un modèle local ajouté.

En bref :

- Remplacez les graphiques presque identiques par un seul visuel, un paramètre d'axe et un paramètre de mesures.
- Écrivez tôt des mesures explicites; elles sont obligatoires ici et rendent les modèles plus faciles à tester.
- Modifiez le DAX généré pour contrôler les libellés et l'ordre, en gardant trois valeurs uniques par ligne.
- Depuis la mise à jour d'octobre 2026, autorisez la sélection multiple dans le segment d'axe pour que le lecteur passe des régions aux pays dans le même graphique.
- Associez chaque valeur à une mesure de couverture comme « pays déclarants » pour que le lecteur sache combien de données se cachent derrière chaque barre.

Moins de visuels, des pages plus claires et des lecteurs qui trouvent eux-mêmes la réponse à leurs questions de suivi : un bon rendement pour quelques lignes de DAX.
