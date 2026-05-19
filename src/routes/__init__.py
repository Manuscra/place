from .classes import classes_bp
from .eleves import eleves_bp
from .groupes import groupes_bp
from .projets import projets_bp


def register_all(app):
    for bp in (classes_bp, eleves_bp, groupes_bp, projets_bp):
        app.register_blueprint(bp)
