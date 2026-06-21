---
description: Développement du sous-système QCM — PHP (index.php, api/*.php, attrib/*.php, script/*.php), Python (act.py), JS (donnees.js, js/*.js), CSS, images quiz
mode: subagent
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

Tu es spécialisé sur le sous-système QCM (Questionnaire à Choix Multiples) dans qcm/.

Architecture :
- `qcm/index.php` — routeur principal
- `qcm/script/accueil.php` — splash screen
- `qcm/act.py` — générateur d'activités (requêtes MySQL → HTML avec étiquettes positionnées)
- `qcm/donnees.js` — dataset statique (chapitres, activités, config quiz)
- `qcm/duss_activites.sql` — dump SQL des activités (tables Img, Activite, Etiquettes, Listes, Attrib_Chap, Act_Attrib)
- `qcm/image.php` — serveur dynamique d'images PNG
- `qcm/api/*.php` — endpoints REST (assoc, assoctype, attribAC/AN/CN, lesrep, liste, moins, movation, plus)
- `qcm/attrib/*.php` — gestion des attributions chapitre/activité/niveau
- `qcm/script/*.php` — scripts CRUD (modif_act, modif_chap, modif_img, modif_lien, modif_niv, modif_rep, save)
- `qcm/js/` — JS client (ap.js, app.js, assoc.js, assoc0.js, assoc1.js, move.js, place.js, send.js)
- `qcm/css/` — menu.css, pres.css
- `qcm/img/sh*.png` — images de fond pour quiz (séries 1xx à 6xx)
- `qcm/images/` — boutons UI

Modèles MySQL sous-jacents : Activite, Img, Chap, Niveau, TypeActivite, Etiquette, Liste, Lien, Attrib_Chap, Attrib_Niv, Act_Attrib.

Quand tu modifies qcm/, vérifie la cohérence avec :
- `routes/activites.py` — API Flask qui expose ces mêmes données
- `models/activite.py` — modèles SQLAlchemy correspondants
- `import_activites.py` — script d'import du SQL legacy vers SQLAlchemy
