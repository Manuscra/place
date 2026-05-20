"""Flask application factory."""

import logging
import os
import sqlite3
import sys

from flask import Flask, jsonify, render_template
from pydantic import ValidationError

from .config import Config, ProdConfig, TestConfig
from .database import db
from .models import Classe
from .place import place_bp
from .routes import register_all

logger = logging.getLogger(__name__)


def _seed_default_classes():
    if Classe.query.count() == 0:
        default_classes = [
            "6A", "6B", "6C",
            "5A", "5B", "5C",
            "4A", "4B", "4C",
            "3A", "3B", "3C",
        ]
        for nom in default_classes:
            db.session.add(Classe(nom=nom))
        db.session.commit()


def _needs_stamp(db_uri: str) -> bool:
    """Return True if the database exists but was never tracked by Alembic."""
    db_file = db_uri.replace("sqlite:///", "", 1)
    if not os.path.exists(db_file):
        return False
    conn = sqlite3.connect(db_file)
    try:
        tables = [
            r[0]
            for r in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        ]
        return bool(tables) and "alembic_version" not in tables
    finally:
        conn.close()


def _run_migrations(app, _here):
    import alembic.command
    from alembic.config import Config as AlembicConfig

    _alembic_ini = os.path.join(_here, "..", "alembic.ini")
    _alembic_cfg = AlembicConfig(_alembic_ini)
    _alembic_cfg.set_main_option(
        "sqlalchemy.url", app.config["SQLALCHEMY_DATABASE_URI"]
    )

    if _needs_stamp(app.config["SQLALCHEMY_DATABASE_URI"]):
        logger.info("Legacy database detected — stamping at head")
        alembic.command.stamp(_alembic_cfg, "head")

    alembic.command.upgrade(_alembic_cfg, "head")


class _PrefixMiddleware:
    """Sets SCRIPT_NAME and strips the APPLICATION_ROOT from PATH_INFO."""

    def __init__(self, wsgi_app, prefix):
        self.app = wsgi_app
        self.prefix = prefix.rstrip("/")

    def __call__(self, environ, start_response):
        environ["SCRIPT_NAME"] = self.prefix
        path = environ.get("PATH_INFO", "")
        if path.startswith(self.prefix):
            environ["PATH_INFO"] = path[len(self.prefix):] or "/"
        return self.app(environ, start_response)


def create_app(testing=False, run_migrations=True):
    _here = os.path.dirname(os.path.abspath(__file__))
    _root = os.path.dirname(_here)

    if _root not in sys.path:
        sys.path.insert(0, _root)

    app = Flask(
        __name__,
        template_folder=os.path.join(_root, "templates"),
        static_folder=os.path.join(_root, "static"),
    )

    env = os.environ.get("FLASK_ENV", "development")
    if testing:
        config_class = TestConfig
    elif env == "production":
        config_class = ProdConfig
    else:
        config_class = Config

    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        if run_migrations and not testing:
            try:
                _run_migrations(app, _here)
            except Exception:
                logger.exception("Failed to run migrations — continuing anyway")
            try:
                _seed_default_classes()
            except Exception:
                logger.exception("Failed to seed default classes")
        elif testing:
            db.create_all()

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": str(e.errors())}), 422

    register_all(app)
    app.register_blueprint(place_bp)

    @app.route("/")
    def index():
        return render_template("place.html")

    @app.route("/dashboard")
    def dashboard():
        return render_template("index.html")

    @app.route("/classes")
    def classes_page():
        return render_template("classes.html")

    @app.route("/projets")
    def projets_page():
        return render_template("projets.html")

    @app.route("/groupes")
    def groupes_page():
        return render_template("groupes.html")

    @app.route("/eleves")
    def eleves_page():
        return render_template("eleves.html")

    prefix = app.config.get("APPLICATION_ROOT")
    if prefix and not testing:
        app.wsgi_app = _PrefixMiddleware(app.wsgi_app, prefix)

    return app
