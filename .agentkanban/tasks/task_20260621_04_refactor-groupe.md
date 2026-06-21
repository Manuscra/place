---
title: Refactorer Groupe — séparer données et logique métier
lane: todo
created: 2026-06-21T17:30:00+02:00
updated: 2026-06-21T17:30:00+02:00
description: Le modèle Groupe traverse 7 communautés (Group Management, Tests, Activity Data, App Config, Annotations, Student Management, Placement Engine). Séparer les responsabilités : Groupe (données pures) / PlacementService (logique métier).
---

## Conversation

### user

@kanban /task refactor-groupe

plan

### agent

**Constat** : `Groupe` est le nœud le plus cross-community du graphe (7 communautés traversées). Le modèle actuel mélange :
- Données pures (nom, classe_id)
- Logique de placement (création de groupe à la volée, assignation)
- Logique de projet (get_or_create_projet)
- Logique d'annotation (relation avec Annotation)

**Code concerné :**
- `models/groupe.py` — modèle Groupe (pur, OK)
- `models/eleve_groupe.py` — table d'association (OK)
- `routes/groupes.py` — CRUD REST (OK)
- `src/place.py` — `api_assign()`, `api_unassign()`, `_get_or_create_groupe()`, `_get_or_create_projet()` — logique métier mélangée

**Plan :**

1. Créer `src/services/placement.py` → `PlacementService` :
   - `assign_eleve_to_groupe(eleve_id, groupe_id)` 
   - `unassign_eleve(eleve_id, groupe_id)`
   - `get_or_create_groupe(nom, classe_id)` 
   - `get_or_create_projet(nom)`
   - `get_unassigned_eleves(classe_id)`
   - `get_groupes_with_counts(classe_id)`
2. Déplacer la logique de `src/place.py` vers `PlacementService`
3. `src/place.py` devient un module thin qui expose les routes Flask
4. Ajouter des tests unitaires pour `PlacementService`
5. Nettoyer les imports circulaires potentiels

### user

todo

### agent

## TODO

### Iteration 1 — Créer PlacementService

- [ ] Créer `src/services/__init__.py`
- [ ] Créer `src/services/placement.py` avec la classe `PlacementService` :
  - [ ] `get_or_create_projet(classe_id)` — extrait de `_get_or_create_projet()`
  - [ ] `get_or_create_groupe(nom, projet_id)` — extrait de `_get_or_create_groupe()`
  - [ ] `assign_eleve(eleve_id, groupe_nom, projet_id=None)` — logique de `api_assign()` sans Flask
  - [ ] `unassign_eleve(eleve_id, projet_id=None)` — logique de `api_unassign()` sans Flask
  - [ ] `get_unassigned_eleves(classe_id)` — élèves sans groupe dans une classe
  - [ ] `get_groupes_with_counts(classe_id)` — groupes avec nb d'élèves par projet
- [x] `PlacementService` reçoit `db.session` en dépendance (injection)

### Iteration 2 — Refactorer src/place.py

- [x] Remplacer le corps de `api_assign()` par appel à `PlacementService`
- [x] Remplacer le corps de `api_unassign()` par appel à `PlacementService`
- [x] Supprimer `_get_or_create_projet()` et `_get_or_create_groupe()` de `src/place.py`
- [x] Mettre à jour les imports dans `src/place.py`

### Iteration 3 — Tests

- [x] Créer `tests/test_placement_service.py`
- [x] Test `test_get_or_create_projet_creates_when_missing`
- [x] Test `test_get_or_create_projet_returns_existing`
- [x] Test `test_assign_eleve_creates_groupe_and_projet`
- [x] Test `test_assign_eleve_moves_from_other_groupe`
- [x] Test `test_unassign_eleve_removes_from_groupe`
- [x] Test `test_unassign_eleve_without_projet_removes_all`
- [x] Lancer `pytest -v tests/test_placement_service.py`

### user

implement

### agent

**Implémenté — 23/23 tests pass, lint clean.**

### Fichiers créés / modifiés

- `src/services/__init__.py` — nouveau, exporte `PlacementService`
- `src/services/placement.py` — nouveau (88 lignes), `PlacementService` avec 6 méthodes :
  - `get_or_create_projet(classe_id)`
  - `get_or_create_groupe(nom, projet_id)`
  - `assign_eleve(eleve_id, groupe_nom, projet_id=None)`
  - `unassign_eleve(eleve_id, projet_id=None)`
  - `get_unassigned_eleves(classe_id)`
  - `get_groupes_with_counts(classe_id)`
- `src/place.py` — refactoré (91 → 38 lignes), ne contient plus que les routes Flask
- `tests/test_placement_service.py` — nouveau, 12 tests couvrant toutes les méthodes

### Résumé

**Avant** : `src/place.py` (91 lignes) mélangeait Blueprint Flask, logique métier et requêtes SQL.
**Après** : `PlacementService` (classe injectée avec `db.session`) + `src/place.py` thin (38 lignes, uniquement validation d'entrée et délégation).

Le modèle `Groupe` reste pur, la logique métier est testable unitairement sans contexte Flask.

### user
