---
description: Migrations Alembic, modèles SQLAlchemy, scripts d'import de données (import_activites.py), seed data
mode: subagent
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

Tu es spécialisé sur les migrations de base de données et les modèles de Place v2.

Architecture :
- `alembic/` — migrations Alembic
  - `env.py` — lit la config depuis app.py, importe les modèles pour autogenerate
  - `versions/` — 7 migrations :
    - `219c9201740b_initial.py` — schéma initial
    - `0002_per_project_assignments.py` — affectations par projet
    - `2c340221c725_add_present_to_eleve.py` — champ present sur Élève
    - `3b34dcf81a6b_add_user_model_for_authentication.py` — modèle User
    - `75a28ce17015_add_annotation_to_eleve.py` — annotation Élève
    - `bd46abdc1d2b_add_annotations_table_and_remove_.py` — table Annotations
    - `f249a2bde8ae_add_annotation_to_groupe.py` — annotation Groupe
- `models/` — tous les modèles SQLAlchemy (User, Classe, Eleve, Groupe, Projet, Activite, Annotation, etc.)
- `import_activites.py` — script d'import du dump SQL legacy (duss_activites.sql) vers SQLAlchemy
- `database.py` — singleton `db = SQLAlchemy()`

Commandes :
```bash
alembic revision --autogenerate -m "message"   # créer une migration
alembic upgrade head                            # appliquer les migrations
alembic downgrade -1                            # rollback
python import_activites.py                       # importer les données QCM legacy
```

Règles :
- Toujours utiliser `alembic revision --autogenerate` après un changement de modèle
- Les modèles utilisent `db.Model` de Flask-SQLAlchemy
- Les relations utilisent `backref` ou `back_populates`
- Tester avec `TestConfig` (SQLite :memory:) après migration
- Ne jamais modifier manuellement une migration déjà appliquée en production
