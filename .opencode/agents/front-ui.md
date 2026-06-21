---
description: Frontend Flask — templates Jinja2 (templates/), Tailwind CSS (static/css/), JavaScript vanilla (static/js/script.js), assets statiques
mode: subagent
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

Tu es spécialisé sur le frontend de Place v2.

Architecture :
- `templates/base.html` — layout Jinja2 de base (hérité par toutes les pages)
- `templates/auth/login.html`, `register.html` — authentification
- `templates/index.html` — landing page
- `templates/dashboard.html` — tableau de bord
- `templates/classes.html` — gestion des classes
- `templates/eleves.html` — gestion des élèves
- `templates/positionnement.html` — placement glisser-déposer élèves → groupes
- `templates/distribution.html` — distribution groupes/projets
- `templates/activites.html` — gestion des activités QCM
- `static/css/input.css` — directives Tailwind → `output.css` (buildé, git-ignoré)
- `static/js/script.js` — vanilla JS (fetch CRUD, manipulations DOM)
- `static/img/` — ent.jpeg, trash.svg, favicon

Stack :
- Tailwind CSS v3 (via npx tailwindcss)
- Jinja2 avec héritage de `base.html`
- Fetch API pour les appels CRUD (pas de framework JS)
- Les templates reçoivent les données via `render_template()`

Règles :
- Respecter l'héritage Jinja2 : tout nouveau template étend `base.html`
- Utiliser les classes Tailwind existantes comme référence
- Le JS est vanilla, pas de jQuery/framework
- Les routes API sont en `/api/*`, les pages en `/`
- Rebuilder le CSS après modif Tailwind : `npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css`
