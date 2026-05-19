import os

from flask import Flask, jsonify, render_template
from pydantic import ValidationError

from .config import Config, TestConfig
from .database import db
from .models import Classe
from .place import place_bp
from .routes import register_all


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


def create_app(testing=False):
    _here = os.path.dirname(os.path.abspath(__file__))
    _root = os.path.dirname(_here)
    app = Flask(
        __name__,
        template_folder=os.path.join(_root, 'templates'),
        static_folder=os.path.join(_root, 'static'),
    )
    config_class = TestConfig if testing else Config
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        db.create_all()
        if not testing:
            _seed_default_classes()

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": str(e.errors())}), 422

    register_all(app)
    app.register_blueprint(place_bp)

    @app.route("/")
    def index():
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

    return app
