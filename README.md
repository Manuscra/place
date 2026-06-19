# Place — Gestion d'équipe

Application Flask de gestion d'équipes et de membres avec API REST, interface Tailwind CSS, et base SQLite gérée par SQLAlchemy/Alembic.

## 🔒 Authentification

L'application est **entièrement protégée** par un système d'authentification. Tous les utilisateurs doivent se connecter pour accéder aux fonctionnalités.

### Créer un utilisateur

```bash
python -m src.cli create-user --username admin --email admin@example.com --password password123
```

Pour plus de détails: voir [AUTHENTICATION.md](AUTHENTICATION.md)

## Démarrage rapide

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
npm install

# Construire les styles CSS
npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch

# Créer un utilisateur admin
python -m src.cli create-user

# Lancer l'application
python run.py
```

L'application est disponible sur http://localhost:5000.

Connectez-vous avec vos identifiants pour accéder au dashboard.

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

**⚠️ Toutes les routes de l'API nécessitent une authentification.**

Pour plus de détails, voir `AGENTS.md`.

