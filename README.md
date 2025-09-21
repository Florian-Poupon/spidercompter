# Spidercompter

Application React permettant de suivre un calendrier annuel complet avec un mode de coche progressif et un suivi des fêtes et
vacances scolaires (zone A).

## Fonctionnalités

- **Calendrier annuel** : visualisation de janvier à décembre, avec surbrillance des week-ends, des fêtes et des vacances.
- **Progression interactive** : coche un jour à la fois ou active le mode "cocher en continu" pour remplir automatiquement tous les
dodos précédents.
- **Événements festifs et vacances** : les principaux jours fériés, les fêtes familiales et toutes les vacances scolaires de la zone A sont affichés
  directement sur les cases du calendrier.
- **Timeline détaillée** : un panneau récapitulatif liste chaque événement de l'année avec son statut (à venir, en cours ou terminé).
- **Sauvegarde locale** : la progression est mémorisée dans le navigateur pour chaque année disponible.
- **Statistiques** : barre de progression, nombre de jours restants et série de jours validés pour garder la motivation.

## Développement

```bash
npm install
npm run dev
```

## Structure du projet

- `src/hooks/useCalendarState.js` centralise l'état du calendrier, la persistance dans le stockage local et le calcul des statistiques.
- Les composants sont organisés par domaine (`calendar`, `controls`, `insights`, `timeline`) pour faciliter la navigation.
- Les données d'événements (`src/data/events.js`) regroupent les fêtes récurrentes et toutes les vacances scolaires de la zone A.

## Lint

```bash
npm run lint
```

## Déploiement GitHub Pages

- Chaque push sur `main` déclenche le workflow GitHub Actions [`Deploy to GitHub Pages`](.github/workflows/deploy.yml) qui construit l'application (`npm run build`) et publie automatiquement le contenu du dossier `dist`.
- Pour un déclenchement manuel, utilise l'onglet **Actions** de GitHub et lance le workflow, ou exécute localement `npm run deploy` pour pousser le build statique vers la branche `gh-pages`.

