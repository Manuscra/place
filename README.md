# Place — Gestion d'équipe

Application Flask de gestion d'équipes et de membres avec API REST, interface Tailwind CSS, et base SQLite gérée par SQLAlchemy/Alembic.

## Démarrage rapide

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
npm install
npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --minify
python run.py
```

L'application est disponible sur http://localhost:5000.

## API

| Méthode | Endpoint              | Description          |
|---------|-----------------------|----------------------|
| GET     | /api/teams            | Lister les équipes   |
| POST    | /api/teams            | Créer une équipe     |
| GET     | /api/teams/:id        | Détail d'une équipe  |
| PUT     | /api/teams/:id        | Modifier une équipe  |
| DELETE  | /api/teams/:id        | Supprimer une équipe |
| GET     | /api/members          | Lister les membres   |
| POST    | /api/members          | Créer un membre      |
| GET     | /api/members/:id      | Détail d'un membre   |
| PUT     | /api/members/:id      | Modifier un membre   |
| DELETE  | /api/members/:id      | Supprimer un membre  |

Pour plus de détails, voir `AGENTS.md`.
