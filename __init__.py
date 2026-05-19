import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("FLASK_ENV", "production")
os.environ.setdefault("SECRET_KEY", "changez-moi-en-production-12345")

from src.app import create_app

app = create_app()
