# AGENTS.md

## TL;DR

- `python run.py` starts the dev server on port 5000.
- `npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch` for live CSS.
- `pytest -v` runs all tests; `ruff check .` lints.

## Stack

Flask 3 + SQLAlchemy (SQLite) + Pydantic v2 + Alembic + Tailwind CSS v3.

## Project layout

```
app.py          — Flask app factory (create_app), error handlers, page routes
run.py          — dev entrypoint (app.run)
config.py       — Config (SQLite file) / TestConfig (SQLite :memory:)
database.py     — db = SQLAlchemy() singleton
models.py       — Member and Team ORM models
schemas.py      — Pydantic v2 models (MemberCreate, MemberUpdate, MemberOut, TeamCreate, TeamUpdate, TeamOut)
routes/api.py   — /api/* CRUD blueprint (teams + members)
templates/      — Jinja2: base.html, index.html, teams.html, members.html
static/css/     — input.css (Tailwind directives) → output.css (built, git-ignored)
static/js/      — script.js (vanilla fetch-based CRUD UI)
alembic/        — migrations (env.py reads app config, imports models for autogenerate)
tests/          — pytest + pytest-flask (app fixture, test_client)
```

## Key conventions

- Always use `.venv/` (auto-created by `python3 -m venv .venv`).
- Tailwind output CSS is **git-ignored**; build it before running the app or CI does it.
- The app factory pattern means you **must not** import `app = create_app()` at module level in other modules — use `app` context or the `db` singleton.
- Pydantic v2: use `.model_validate()` (not `.parse_obj()`). Dump with `mode="json"` for datetime serialization.
- Validation errors from Pydantic return HTTP 422 (handler in app.py).
- Tests use `create_app(testing=True)` which gives SQLite in-memory; db is created/dropped per session.
- Frontend routes are defined with `@app.route` in `create_app()`, API routes are a Blueprint at `/api`.

## Commands

```bash
# Setup
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt -r requirements-dev.txt
npm install

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

## CI/CD

Runs `ruff check .` then `pytest -v` on every push/PR. On main, also builds Tailwind CSS and uploads it as an artifact. See `.github/workflows/ci.yml`.
