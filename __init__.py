import os
import sys

_base = os.path.abspath(os.path.dirname(__file__))

# Ajouter le dossier au path pour les imports src.*
if _base not in sys.path:
    sys.path.insert(0, _base)

# Config production
os.environ.setdefault("FLASK_ENV", "production")
os.environ.setdefault("APPLICATION_ROOT", "/place")
os.environ.setdefault("SECRET_KEY", "changez-moi-en-production-12345")
os.environ.setdefault("DATABASE_URL", f"sqlite:///{_base}/place.db")

try:
    from src.app import create_app
    app = create_app()
except Exception:
    import traceback

    from flask import Flask

    _tb = traceback.format_exc()
    app = Flask(__name__)

    @app.route("/")
    def debug_error():
        return f"<pre>Erreur démarrage:\n{_tb}</pre>", 500
