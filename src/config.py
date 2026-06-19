import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    APPLICATION_ROOT = os.environ.get("APPLICATION_ROOT", "/place")
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'place.db'}"
    )
    API_TOKEN = os.environ.get("API_TOKEN", "")
    API_URL = os.environ.get("API_URL", "")
    REGISTRATION_ENABLED = os.environ.get("REGISTRATION_ENABLED", "true").lower() in ("true", "1", "yes")


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProdConfig(Config):
    DEBUG = False
