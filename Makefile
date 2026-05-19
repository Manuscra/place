.PHONY: dev css css-watch test lint lint-fix setup db-upgrade db-migrate clean

PYTHON = .venv/bin/python
PIP = .venv/bin/pip
RUFF = .venv/bin/ruff
PYTEST = .venv/bin/pytest
ALEMBIC = .venv/bin/alembic
NPM = npx

# ---------------------------------------------------------------------------
# Development
# ---------------------------------------------------------------------------

dev: css
	$(PYTHON) run.py

# ---------------------------------------------------------------------------
# Tailwind CSS
# ---------------------------------------------------------------------------

css:
	$(NPM) tailwindcss -i ./static/css/input.css -o ./static/css/output.css

css-watch:
	$(NPM) tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch

css-minify:
	$(NPM) tailwindcss -i ./static/css/input.css -o ./static/css/output.css --minify

# ---------------------------------------------------------------------------
# Testing & linting
# ---------------------------------------------------------------------------

test:
	PYTHONPATH=. $(PYTEST) -v

lint:
	$(RUFF) check .

lint-fix:
	$(RUFF) check --fix .

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------

setup:
	python3 -m venv .venv
	$(PIP) install -r requirements.txt -r requirements-dev.txt
	npm install

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

db-upgrade:
	$(ALEMBIC) upgrade head

db-migrate:  # usage: make db-migrate msg="description"
	$(ALEMBIC) revision --autogenerate -m "$(msg)"

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache .ruff_cache 2>/dev/null || true
