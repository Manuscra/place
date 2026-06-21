---
title: Terminer la migration QCM — supprimer le backend PHP legacy
lane: todo
created: 2026-06-21T17:30:00+02:00
updated: 2026-06-21T17:30:00+02:00
description: Le projet a deux backends parallèles pour le QCM : l'ancien en PHP/MySQL direct (qcm/api/*.php, qcm/act.py, qcm/script/*.php) et le nouveau en Flask/SQLAlchemy (routes/activites.py, models/activite.py). Le script import_activites.py suggère une migration en cours. Terminer la bascule pour n'avoir qu'un seul backend.
---

## Conversation

### user

@kanban /task migrate-qcm-backend

plan

### agent

**Constat** : Deux systèmes coexistent pour la même fonctionnalité QCM :

**Legacy (PHP/MySQL direct)** :
- `qcm/api/*.php` — 10 endpoints REST (assoc, assoctype, attribAC/AN/CN, lesrep, liste, moins, movation, plus)
- `qcm/act.py` — génération HTML avec étiquettes positionnées (MySQL → `<img>` + `<input>`)
- `qcm/script/*.php` — CRUD admin (modif_act, modif_chap, modif_img, modif_lien, modif_niv, modif_rep, save)
- `qcm/attrib/*.php` — gestion attributions chapitre/activité/niveau
- `qcm/donnees.js` — dataset statique JS en fallback

**Nouveau (Flask/SQLAlchemy)** :
- `routes/activites.py` — CRUD + positionnement + attributions + enrichissement
- `models/activite.py` — ORM complet (Activite, Img, Chap, Niveau, TypeActivite, Etiquette, Liste, Lien, ActAttrib, AttribChap, AttribNiv)
- `import_activites.py` — script d'import du dump SQL legacy

**Plan :**

1. Vérifier la couverture : l'API Flask expose-t-elle 100% des fonctionnalités PHP ?
2. Migrer `qcm/act.py` en route Flask (`/qcm/activite/<id>` → template Jinja2 au lieu de HTML généré)
3. Rediriger les appels JS frontend (`qcm/js/`) vers `/api/activites` au lieu de `qcm/api/*.php`
4. Supprimer `qcm/api/`, `qcm/script/`, `qcm/attrib/` après vérification
5. Garder `qcm/img/`, `qcm/images/`, `qcm/css/` (assets statiques)
6. Conserver `qcm/index.php` et `qcm/script/accueil.php` temporairement ? Ou les recréer en Flask

### user
