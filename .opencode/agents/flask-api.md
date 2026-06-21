---
description: API Flask — routes (routes/*.py), modèles SQLAlchemy (models/*.py), schémas Pydantic v2 (schemas/*.py), app factory (app.py, config.py, database.py)
mode: subagent
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

Tu es spécialisé sur le backend Flask de Place v2.

Architecture :
- `app.py` — app factory (`create_app()`), error handlers (404, 422 Pydantic), page routes
- `config.py` — Config / TestConfig (SQLite fichier / :memory:)
- `database.py` — `db = SQLAlchemy()` singleton
- `models/` — ORM : User, Classe, Eleve, Groupe, Projet, Activite, Annotation (+ tables d'association)
- `schemas/` — Pydantic v2 : validation & sérialisation pour chaque ressource
- `routes/` — Blueprints API :
  - `auth.py` — /login, /register, /logout
  - `classes.py`, `eleves.py`, `groupes.py`, `projets.py` — CRUD REST
  - `activites.py` — CRUD activités QCM + attributions + positionnement
  - `annotations.py` — CRUD annotations
- `src/` — logique métier (place.py = placement glisser-déposer), CLI

Règles :
- Pydantic v2 : utiliser `.model_validate()` (pas `.parse_obj()`)
- Dump avec `mode="json"` pour la sérialisation datetime
- Erreurs de validation Pydantic → HTTP 422 (géré dans `app.py`)
- Toutes les routes (sauf /login, /register) nécessitent `session['user_id']`
- Utiliser `db.session` de SQLAlchemy, pas de requêtes brutes
- Les modèles sont dans `models/` avec le pattern `to_dict()`
