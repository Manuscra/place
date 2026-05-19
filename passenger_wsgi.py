import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from src.app import create_app

os.environ.setdefault("FLASK_ENV", "production")
application = create_app()
