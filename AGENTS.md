# AGENTS.md

## TL;DR

- `python run.py` starts the dev server on port 5000.
- `npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch` for live CSS.
- `pytest -v` runs all tests; `ruff check .` lints.
- **🔒 Authentication required**: Create a user with `python -m src.cli create-user` before accessing the app.

## Stack

Flask 3 + SQLAlchemy (SQLite) + Pydantic v2 + Alembic + Tailwind CSS v3 + Flask-Session.

## Project layout

```
app.py              — Flask app factory (create_app), error handlers, page routes
run.py              — dev entrypoint (app.run)
config.py           — Config (SQLite file) / TestConfig (SQLite :memory:)
database.py         — db = SQLAlchemy() singleton
models/             — ORM models (User, Classe, Eleve, Groupe, Projet, etc.)
schemas/            — Pydantic v2 models (validation & serialization)
routes/
  auth.py           — Authentication routes (/login, /register, /logout)
  *.py              — API routes by resource (classes, eleves, groupes, projets, annotations)
cli.py              — CLI commands for user management
templates/          — Jinja2 templates (base.html, auth/*, pages)
static/css/         — input.css (Tailwind directives) → output.css (built, git-ignored)
static/js/          — script.js (vanilla fetch-based CRUD UI)
alembic/            — migrations (env.py reads app config, imports models for autogenerate)
tests/              — pytest + pytest-flask (auto-login fixtures)
AUTHENTICATION.md   — Full authentication documentation
```

## Key conventions

- Always use `.venv/` (auto-created by `python3 -m venv .venv`).
- Tailwind output CSS is **git-ignored**; build it before running the app or CI does it.
- The app factory pattern means you **must not** import `app = create_app()` at module level in other modules — use `app` context or the `db` singleton.
- Pydantic v2: use `.model_validate()` (not `.parse_obj()`). Dump with `mode="json"` for datetime serialization.
- Validation errors from Pydantic return HTTP 422 (handler in app.py).
- Tests use `create_app(testing=True)` which gives SQLite in-memory; db is created/dropped per session.
- **Authentication**: All routes (except `/login`, `/register`) require a session with `user_id`. Tests auto-login via conftest fixture.
- Frontend routes are defined with `@app.route` in `create_app()`, API routes are Blueprints at `/api/*`.

## Commands

```bash
# Setup
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt -r requirements-dev.txt
npm install

# Create first user (required before using app!)
python -m src.cli create-user

# List users
python -m src.cli list-users

# Toggle user active status
python -m src.cli toggle-user --username <username>

# Delete user
python -m src.cli delete-user --username <username>

# Dev
python run.py                          # server on port 5000
npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch

# Test & lint
.venv/bin/pytest -v
.venv/bin/ruff check .
.venv/bin/ruff check --fix .           # auto-fix

# Database migrations
.venv/bin/alembic revision --autogenerate -m "message"
.venv/bin/alembic upgrade head

# Production CSS build
npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --minify
```

## Authentication & Security

- All routes require login (redirects to `/login` if no session)
- Passwords hashed with Werkzeug (PBKDF2)
- Sessions stored on filesystem (configurable in config.py)
- `SECRET_KEY` must be set in production (env var or .env)
- Users can be marked inactive to prevent login
- See [AUTHENTICATION.md](AUTHENTICATION.md) for full details

## CI/CD

Runs `ruff check .` then `pytest -v` on every push/PR. On main, also builds Tailwind CSS and uploads it as an artifact. See `.github/workflows/ci.yml`.


<!-- BEGIN AGENT KANBAN — DO NOT EDIT THIS SECTION -->
## Agent Kanban

Read `.agentkanban/INSTRUCTION.md` for task workflow rules.
Read `.agentkanban/memory.md` for project context.

If a task file (`.agentkanban/tasks/**/*.md`) was referenced earlier in this conversation, re-read it before responding and always respond in and at the end the task file.
<!-- END AGENT KANBAN -->
