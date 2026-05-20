import json

from .classe import ClasseBase, ClasseCreate, ClasseOut, ClasseUpdate
from .eleve import EleveBase, EleveCreate, EleveOut, EleveUpdate
from .groupe import GroupeBase, GroupeCreate, GroupeOut, GroupeUpdate
from .projet import ProjetBase, ProjetCreate, ProjetOut, ProjetUpdate


def _serialize(model):
    """Pydantic v1: convert ORM-based model to JSON-safe dict."""
    return json.loads(model.json())


__all__ = [
    "ClasseBase", "ClasseCreate", "ClasseOut", "ClasseUpdate",
    "EleveBase", "EleveCreate", "EleveOut", "EleveUpdate",
    "GroupeBase", "GroupeCreate", "GroupeOut", "GroupeUpdate",
    "ProjetBase", "ProjetCreate", "ProjetOut", "ProjetUpdate",
    "_serialize",
]
