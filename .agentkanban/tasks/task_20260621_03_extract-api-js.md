---
title: Extraire api.js — wrapper fetch typé par ressource
lane: todo
created: 2026-06-21T17:30:00+02:00
updated: 2026-06-21T15:31:28.580Z
description: La fonction api() dans script.js a 39 connexions (god node du graphe). C'est un wrapper fetch unique utilisé pour tous les appels CRUD, ce qui crée un couplage fort. Extraire en module avec des méthodes typées par ressource.
sortOrder: 1782055800001
slug: extract-api-js
---

## Conversation

### user

@kanban /task extract-api-js

plan

### agent

**Constat** : `api()` est le nœud le plus connecté du graphe (39 edges). Une seule fonction gère tous les appels CRUD — n'importe quel changement casse potentiellement tout le frontend.

**Plan :**

1. Créer `static/js/modules/api.js` avec :
   - `ApiClient` class ou objet avec `get(endpoint)`, `post(endpoint, data)`, `put(endpoint, data)`, `delete(endpoint)`
   - Gestion centralisée des erreurs (toast automatique)
   - Support du `Content-Type: application/json`
2. Créer des wrappers typés :
   - `ClassesApi` — `list()`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`
   - `ElevesApi` — `listByClasse(id)`, `create(data)`, `update(id, data)`, `delete(id)`, `togglePresent(id)`
   - `ActivitesApi` — `list()`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`, `listChapitres()`, `listNiveaux()`, ...
   - `GroupesApi` — `list()`, `create(data)`, `delete(id)`, `assign(studentId, groupeId)`, `unassign(studentId, groupeId)`
   - `AnnotationsApi` — `listByEleve(id)`, `create(data)`, `delete(id)`
3. Remplacer tous les appels `api('GET', '/api/...')` dans `script.js` par les méthodes typées

### user

todo

### agent

## Analyse du code

- `static/js/script.js` — 1521 lignes, 60+ appels `api()`, 1 wrapper `api(url, options)`
- `static/js/place.js` — 321 lignes, wrapper `fetchAPI(endpoint, method, data)` séparé, base `/place/api`
- Chargé dans `base.html` ligne 35 : `<script src="script.js">` (pas de `type="module"`)
- Toutes les fonctions sont globales (utilisées dans `onclick` inline des templates)

**Approche** : compatible `<script src>` classique (pas de `type="module"`), nouveau fichier chargé avant `script.js`.

## TODO

### Iteration 1 — Créer `static/js/modules/api.js`

- [x] Fichier non-module (IIFE), expose `apiClient` globalement
- [x] `ApiClient` class avec méthodes de base : `get(url)`, `post(url, data)`, `put(url, data)`, `delete(url)`
- [x] Gestion centralisée des erreurs (parse JSON, throw Error)
- [x] Créer les wrappers typés exposés sur `window` :
  - [x] `ClassesApi` — `list()`, `create(data)`, `update(id, data)`, `delete(id)`, `reset()`, `importCsv(file)`
  - [x] `ElevesApi` — `list(classeId)`, `listAll()`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`, `togglePresent(id, present)`
  - [x] `ActivitesApi` — 29 méthodes
  - [x] `AnnotationsApi` — `listByEleve(eleveId)`, `create(data)`, `delete(id)`
- [x] Remplacer le corps de `api()` par délégation vers `ApiClient` (compatibilité transitoire)
- [x] Remplacer tous les appels directs `api("/api/...")` par les wrappers typés (60+ call sites)
- [x] `api()` ne sert plus que de fallback (1 appel restant = la définition elle-même)
- [x] Ajouter `<script src="modules/api.js">` dans `base.html` avant `script.js`

### user

implement

### agent

**Implémenté — 60+ appels `api()` migrés vers wrappers typés.**

### Fichiers créés / modifiés

- `static/js/modules/api.js` — nouveau, 115 lignes
  - Classe `ApiClient` avec `get/post/put/del`
  - 4 wrappers : `ClassesApi` (7 méthodes), `ElevesApi` (7 méthodes), `AnnotationsApi` (3 méthodes), `ActivitesApi` (29 méthodes)
- `templates/base.html` — ajout du chargement de `modules/api.js`
- `static/js/script.js` — refactoré (1521 → 1486 lignes)
  - Corps de `api()` réduit à 3 lignes (délégation vers `ApiClient`)
  - 60+ appels directs remplacés par wrappers typés

### Résumé

**Avant** : `api("/api/classes", { method: "POST", body: JSON.stringify(data) })`
**Après** : `ClassesApi.create(data)`

La couche API est isolée dans `modules/api.js`. `script.js` ne contient plus d'URLs en dur — toutes les routes sont dans les wrappers typés. `api()` reste comme fallback pour compatibilité.

### user
