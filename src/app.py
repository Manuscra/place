"""Flask application factory."""

import logging
import os
import sqlite3
import sys

from flask import Flask, jsonify, render_template, request
from pydantic import ValidationError

from .config import Config, ProdConfig, TestConfig
from .database import db
from .models import Classe, Eleve, EleveGroupe, Groupe, Projet
from .place import place_bp
from .routes import register_all

logger = logging.getLogger(__name__)


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

        elif testing:
            db.create_all()

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": str(e.errors())}), 422

    register_all(app)
    app.register_blueprint(place_bp)

    @app.route("/api/reset", methods=["POST"])
    def reset_db():
        EleveGroupe.query.delete()
        db.session.query(Eleve).delete()
        db.session.query(Groupe).delete()
        db.session.query(Projet).delete()
        db.session.query(Classe).delete()
        db.session.commit()
        return jsonify({"message": "Database reset"}), 200

    @app.route("/api/import-csv", methods=["POST"])
    def import_csv():
        import csv
        import io

        try:
            import chardet
        except ImportError:
            chardet = None

        file = request.files.get("file")
        if not file:
            return jsonify({"error": "Aucun fichier fourni"}), 400
        if not file.filename.lower().endswith(".csv"):
            return jsonify({"error": "Le fichier doit être un .csv"}), 400

        raw = file.read()
        if not raw:
            return jsonify({"error": "Fichier vide"}), 400

        # Détection de l'encodage
        if chardet:
            detected = chardet.detect(raw)
            encoding = detected.get("encoding") if detected and detected.get("confidence", 0) > 0.5 else "utf-8"
        else:
            encoding = "utf-8"

        # Décodage avec fallback
        try:
            text = raw.decode(encoding)
        except (UnicodeDecodeError, LookupError):
            try:
                text = raw.decode("utf-8")
            except UnicodeDecodeError:
                text = raw.decode("latin-1")

        # Détection du délimiteur (tab ou virgule)
        sample = text[:4096]
        try:
            dialect = csv.Sniffer().sniff(sample, delimiters="\t,;")
        except csv.Error:
            dialect = csv.excel

        reader = csv.DictReader(io.StringIO(text), dialect=dialect)
        rows = list(reader)
        if not rows:
            return jsonify({"error": "Aucune ligne de données trouvée"}), 400

        # Mapping attendu
        header_mapping = {
            "NOM_DE_FAMILLE": "eleve_nom",
            "PRENOM": "eleve_prenom",
            "CODE_STRUCTURE": "classe_nom",
        }

        # Normaliser les en-têtes (strip + uppercase)
        fieldnames = [name.strip().upper() for name in reader.fieldnames]
        if not all(k in fieldnames for k in header_mapping):
            return jsonify({"error": f"En-têtes attendues : {', '.join(header_mapping.keys())}. Reçu : {', '.join(fieldnames)}"}), 400

        created_eleves = 0
        created_classes = 0
        skipped = 0

        for row in rows:
            row = {k.strip().upper(): v.strip() for k, v in row.items() if k.strip().upper() in header_mapping}
            nom = row.get("NOM_DE_FAMILLE", "")
            prenom = row.get("PRENOM", "")
            classe_nom = row.get("CODE_STRUCTURE", "")

            if not nom or not prenom or not classe_nom:
                skipped += 1
                continue

            # Chercher ou créer la classe
            classe = Classe.query.filter_by(nom=classe_nom).first()
            if not classe:
                classe = Classe(nom=classe_nom)
                db.session.add(classe)
                db.session.flush()
                created_classes += 1

            # Vérifier si l'élève existe déjà (même nom/prénom/classe)
            existing = Eleve.query.filter_by(nom=nom, prenom=prenom, classe_id=classe.id).first()
            if existing:
                skipped += 1
                continue

            db.session.add(Eleve(nom=nom, prenom=prenom, classe_id=classe.id))
            created_eleves += 1

        db.session.commit()

        return jsonify({
            "message": f"Import terminé : {created_eleves} élève(s) créé(s), {created_classes} classe(s) créée(s), {skipped} ligne(s) ignorée(s)."
        }), 201

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/place")
    def dashboard():
        return render_template("place.html")

    @app.route("/classes")
    def classes_page():
        return render_template("classes.html")

    @app.route("/eleves")
    def eleves_page():
        return render_template("eleves.html")

    prefix = app.config.get("APPLICATION_ROOT")
    if prefix and not testing:
        app.wsgi_app = _PrefixMiddleware(app.wsgi_app, prefix)

    return app
