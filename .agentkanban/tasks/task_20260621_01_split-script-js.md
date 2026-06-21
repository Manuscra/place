---
title: Splitter script.js monolithique en modules
lane: todo
created: 2026-06-21T17:30:00+02:00
updated: 2026-06-21T17:30:00+02:00
description: 55+ fonctions dans un seul fichier static/js/script.js (cohésion 0.09 — la pire du projet). Découper en modules : api.js (fetch wrapper), classes.js, eleves.js, activites.js, placement.js (drag-drop), annotations.js.
---

## Conversation

### user

@kanban /task split-script-js

plan

### agent

**Constat (issu du graphe graphify)** : `static/js/script.js` est le plus gros node du projet avec 55+ fonctions identifiées, cohésion 0.09. Il gère simultanément : classes, élèves, activités QCM, annotations, positionnement glisser-déposer, appels API, toasts, filtres.

**Plan proposé :**

- [x] Créer `static/js/modules/api.js` — wrapper fetch normalisé (déjà fait, tâche 03)
- [x] Créer `static/js/modules/classes.js` — 241 lignes (loadClasses, deleteClasse, addEleveToClasse, deleteClasseEleve, renameClasse + events)
- [x] Créer `static/js/modules/eleves.js` — 263 lignes (loadClassesIntoFilterSelect, loadFilteredEleves, renderEleveCard, renameEleve, deleteEleve + events)
- [x] Créer `static/js/modules/activites.js` — 883 lignes (CRUD activites/chapitres/niveaux/images/liens/reponses + attributions + listes)
- [x] Créer `static/js/modules/annotations.js` — 57 lignes (loadEleveAnnotations, addEleveAnnotation, deleteAnnotation)
- [x] Garder `script.js` comme point d'entrée — 37 lignes (API_BASE, api() fallback, toast, togglePresent)

### user

implement

### agent

**Implémenté — script.js: 1486 → 37 lignes.**

### Fichiers

| Fichier | Lignes | Contenu |
|---------|--------|---------|
| `modules/api.js` | 126 | ApiClient + wrappers ClassesApi, ElevesApi, AnnotationsApi, ActivitesApi |
| `modules/annotations.js` | 57 | loadEleveAnnotations, addEleveAnnotation, deleteAnnotation |
| `modules/classes.js` | 241 | Page classes (CRUD + event listeners) |
| `modules/eleves.js` | 263 | Page élèves (filtres, rendu, rename, event listeners) |
| `modules/activites.js` | 883 | Page activités (CRUD complet, attributions, listes) |
| `script.js` | **37** | Utilitaires partagés (API_BASE, api fallback, toast, togglePresent) |

**Avant** : 1 fichier de 1486 lignes, cohésion 0.09.
**Après** : 6 fichiers (1607 lignes total), chaque module a une responsabilité unique.

Chargement dans `base.html` : api → annotations → classes → eleves → activites → script.

### user

todo

### agent

État actuel : `api.js` déjà extrait (tâche 03). `script.js` fait 1486 lignes. `place.js` (321 lignes) est déjà séparé.

## TODO

### Iteration 1 — Extraire `classes.js`

- [ ] Créer `static/js/modules/classes.js`
- [ ] Déplacer : `loadClasses`, `deleteClasse`, `addEleveToClasse`, `deleteClasseEleve`, `togglePresent`, `renameClasse`
- [ ] Déplacer : event listeners de la page classes (create-classe, reset-db, import-csv, classes-list click/dblclick)

### Iteration 2 — Extraire `eleves.js`

- [ ] Créer `static/js/modules/eleves.js`
- [ ] Déplacer : `loadClassesIntoFilterSelect`, `loadElevesIntoFilterSelect`, `loadPrenomsIntoFilterSelect`, `getActiveFilters`, `renderEleveCard`, `renameEleve`, `loadFilteredEleves`, `deleteEleve`
- [ ] Déplacer : event listeners page élèves (filtres, eleves-list click/dblclick)

### Iteration 3 — Extraire `activites.js`

- [ ] Créer `static/js/modules/activites.js`
- [ ] Déplacer : tout le CRUD activités/chapitres/niveaux/images/liens/réponses + attributions + listes + positionnement

### Iteration 4 — Extraire `annotations.js`

- [ ] Créer `static/js/modules/annotations.js`
- [ ] Déplacer : `loadEleveAnnotations`, `addEleveAnnotation`, `deleteAnnotation`

### Iteration 5 — Nettoyer `script.js`

- [ ] Garder : `API_BASE`, `api()` fallback, `toast()`, styles CSS inline
- [ ] Garder : event listeners d'initialisation (subtab, activites-list init)
- [ ] Ajouter les `<script src>` dans `base.html`

### user
