---
title: Auditer et nettoyer les 35 nœuds isolés
lane: todo
created: 2026-06-21T17:30:00+02:00
updated: 2026-06-21T17:30:00+02:00
description: 35 nœuds ont ≤1 connexion dans le graphe. Principalement des scripts QCM orphelins (api/moins.php, api/plus.php, script/save.php...) et des nœuds OpenCode. Identifier le code mort à supprimer et les vrais orphelins à documenter/reconnecter.
---

## Conversation

### user

@kanban /task audit-isolated-nodes

plan

### agent

**Constat** : 35 nœuds isolés (≤1 edge) identifiés par le graphe :

**Scripts QCM orphelins probables (code mort ?)** :
- `qcm/api/moins.php`, `plus.php`, `movation.php` — endpoints sans appelant visible
- `qcm/script/save.php`, `modif_act.php`, `modif_chap.php`, `modif_img.php`, `modif_lien.php`, `modif_niv.php`, `modif_rep.php` — scripts CRUD admin
- `qcm/attrib/actchapatri.php`, `nivactatri.php`, `nivchapatri.php` — gestion attributions
- `qcm/etiqtomove.php` — déplacement d'étiquettes
- `qcm/movation.php` — feature non référencée

**Nœuds infra/config isolés** :
- `tailwind.config.js` — pas connecté au reste
- `package.json` — isolé dans sa propre communauté
- Nœuds OpenCode (plugin, schema) — 2 communautés séparées

**Plan :**

1. Pour chaque script QCM : vérifier s'il est référencé dans `qcm/index.php`, `donnees.js`, ou les appels JS
2. Marquer comme "à supprimer" si aucun appelant trouvé
3. Pour les scripts utilisés mais isolés : ajouter les edges manquants dans le graphe (ou documenter)
4. Supprimer le code mort confirmé
5. Mettre à jour `import_activites.py` si des données legacy dépendent de ces scripts

### user
