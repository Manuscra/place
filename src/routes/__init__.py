from .annotations import annotations_bp
from .auth import auth_bp
from .classes import classes_bp
from .eleves import eleves_bp
from .groupes import groupes_bp
from .projets import projets_bp


def register_all(app):
    for bp in (auth_bp, annotations_bp, classes_bp, eleves_bp, groupes_bp, projets_bp):
        app.register_blueprint(bp)
