from flask import Flask, jsonify, render_template
from pydantic import ValidationError

from .config import Config, TestConfig
from .database import db
from .routes.api import api


def create_app(testing=False):
    app = Flask(__name__)
    config_class = TestConfig if testing else Config
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return jsonify({"error": str(e.errors())}), 422

    app.register_blueprint(api)

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/teams")
    def teams_page():
        return render_template("teams.html")

    @app.route("/members")
    def members_page():
        return render_template("members.html")

    return app
