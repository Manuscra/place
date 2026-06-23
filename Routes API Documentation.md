# Routes & API — Documentation

## Authentification

Toutes les routes sauf celles listées ci-dessous exigent `session['user_id']`.
Sans session → redirection vers `/login`.

### Routes publiques (pas d'auth)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` `POST` | `/login` | Connexion |
| `GET` `POST` | `/register` | Inscription (si `REGISTRATION_ENABLED`) |
| `POST` | `/logout` | Déconnexion |
| `GET` | `/qcm/<niv>` | Page QCM pour un niveau (1–4) |
| `GET` | `/api/activites/niveau/<niv>` | Données QCM : chapitres → activités |
| `GET` | `/api/activites/image-proxy/<code>` | Proxy d'image QCM |

---

## Pages (auth requise)

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/`, `/dashboard` | Tableau de bord |
| `GET` | `/classes` | Gestion des classes |
| `GET` | `/eleves` | Gestion des élèves |
| `GET` | `/distribution` | Placement des élèves |
| `GET` | `/activites` | Gestion des activités |
| `GET` | `/positionnement` | Positionnement des étiquettes |

---

## API — Classes `/api/classes`

| Méthode | URL | Body / Paramètres | Réponse |
|---------|-----|-------------------|---------|
| `GET` | `/api/classes` | — | `[{id, nom}, …]` |
| `GET` | `/api/classes/<id>` | — | `{id, nom}` |
| `POST` | `/api/classes` | `{"nom": "…"}` | `{id, nom}` (201) |
| `PUT` | `/api/classes/<id>` | `{"nom": "…"}` | `{id, nom}` |
| `DELETE` | `/api/classes/<id>` | — | `{"message": "…"}` |

---

## API — Élèves `/api/eleves`

| Méthode | URL | Body / Paramètres | Réponse |
|---------|-----|-------------------|---------|
| `GET` | `/api/eleves` | Query: `classe_id`, `groupe_id`, `projet_id`, `present` | `[{id, nom, prenom, classe, present}, …]` |
| `GET` | `/api/eleves/<id>` | — | `{id, nom, prenom, …}` |
| `POST` | `/api/eleves` | `{"nom":"…", "prenom":"…", "classe_id":n, "present":bool}` | `{…}` (201) |
| `PUT` | `/api/eleves/<id>` | Partiel | `{…}` |
| `DELETE` | `/api/eleves/<id>` | — | `{"message": "…"}` |

---

## API — Projets `/api/projets`

| Méthode | URL | Body / Paramètres | Réponse |
|---------|-----|-------------------|---------|
| `GET` | `/api/projets` | Query: `classe_id` | `[{id, nom, classe_id}, …]` |
| `GET` | `/api/projets/<id>` | — | `{id, nom, …}` |
| `POST` | `/api/projets` | `{"nom":"…", "classe_id":n}` | `{…}` (201) |
| `PUT` | `/api/projets/<id>` | Partiel | `{…}` |
| `DELETE` | `/api/projets/<id>` | — | `{"message": "…"}` |

---

## API — Groupes `/api/groupes`

| Méthode | URL | Body / Paramètres | Réponse |
|---------|-----|-------------------|---------|
| `GET` | `/api/groupes` | Query: `projet_id` | `[{id, nom, projet_id}, …]` |
| `GET` | `/api/groupes/<id>` | — | `{id, nom, …}` |
| `POST` | `/api/groupes` | `{"nom":"…", "projet_id":n}` | `{…}` (201) |
| `PUT` | `/api/groupes/<id>` | Partiel | `{…}` |
| `DELETE` | `/api/groupes/<id>` | — | `{"message": "…"}` |

---

## API — Annotations `/api/annotations`

| Méthode | URL | Body / Paramètres | Réponse |
|---------|-----|-------------------|---------|
| `GET` | `/api/annotations` | Query: `eleve_id` ou `groupe_id` | `[{id, texte, eleve_id, groupe_id, date_saisie}, …]` |
| `POST` | `/api/annotations` | `{"texte":"…", "eleve_id":n, "groupe_id":n}` | `{…}` (201) |
| `DELETE` | `/api/annotations/<id>` | — | `{"message": "…"}` |

---

## API — Placement `/api/assign` · `/api/unassign`

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `POST` | `/api/assign` | `{"eleve_id":n, "groupe":"nom", "projet_id":n}` | `{"success":true}` |
| `POST` | `/api/unassign` | `{"eleve_id":n, "projet_id":n}` | `{"success":true}` |

---

## API — Activités `/api/activites`

### CRUD Activité

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites` | — | `[{No_Act, Name_Act, Type_Act, img_name, lien_url, chapitre_names, niveau_names}, …]` |
| `GET` | `/api/activites/<id>` | — | `{…}` |
| `POST` | `/api/activites` | `{"Name_Act":"…", "Type_Act":1|2, "No_dImg":n}` | `{…}` (201) |
| `PUT` | `/api/activites/<id>` | Partiel | `{…}` |
| `DELETE` | `/api/activites/<id>` | — | `{"message": "…"}` |

### Types

| Méthode | URL | Réponse |
|---------|-----|---------|
| `GET` | `/api/activites/types` | `[{No_Type, Name_Type}, …]` |

### Images

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/images` | — | `[{No_Img, N_Img}, …]` |
| `POST` | `/api/activites/images` | `{"N_Img":"nom"}` | `{…}` (201) |
| `PUT` | `/api/activites/images/<id>` | `{"N_Img":"…"}` | `{…}` |
| `DELETE` | `/api/activites/images/<id>` | — | `{"message": "…"}` |

### Liens

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/liens` | — | `[{No_Lien, Link, No_dAct}, …]` |
| `POST` | `/api/activites/liens` | `{"Link":"url"}` | `{…}` (201) |
| `PUT` | `/api/activites/liens/<id>` | `{"Link":"…"}` | `{…}` |
| `DELETE` | `/api/activites/liens/<id>` | — | `{"message": "…"}` |

### Chapitres

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/chapitres` | — | `[{No_chap, Name_Chap}, …]` |
| `POST` | `/api/activites/chapitres` | `{"Name_Chap":"…"}` | `{…}` (201) |
| `PUT` | `/api/activites/chapitres/<id>` | `{"Name_Chap":"…"}` | `{…}` |
| `DELETE` | `/api/activites/chapitres/<id>` | — | `{"message": "…"}` |

### Niveaux

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/niveaux` | — | `[{No_Niv, Name_Niv}, …]` |
| `POST` | `/api/activites/niveaux` | `{"Name_Niv":"…"}` | `{…}` (201) |
| `PUT` | `/api/activites/niveaux/<id>` | `{"Name_Niv":"…"}` | `{…}` |
| `DELETE` | `/api/activites/niveaux/<id>` | — | `{"message": "…"}` |

### Réponses

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/reponses` | — | `[{No_Rep, Reponse}, …]` |
| `POST` | `/api/activites/reponses` | `{"Reponse":"texte"}` | `{…}` (201) |
| `PUT` | `/api/activites/reponses/<id>` | `{"Reponse":"…"}` | `{…}` |
| `DELETE` | `/api/activites/reponses/<id>` | — | `{"message": "…"}` |

### Attribution Activité ↔ Chapitre

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/attrib/chap` | — | `[{No_Attrib, No_dChap, No_dAct, chap_name}, …]` |
| `POST` | `/api/activites/attrib/chap` | `{"activite_id":n, "chapitre_ids":[n]}` ou `{"matrix":[{activite_id, chapitre_ids}]}` | `{"message": "…"}` |

### Attribution Activité ↔ Niveau

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/attrib/niveau` | — | `[{pk, No_Niv_Attrib, No_Act_Attrib, niv_name}, …]` |
| `POST` | `/api/activites/attrib/niveau` | `{"activite_id":n, "attrib_niv_ids":[n]}` ou `{"matrix":[…]}`` | `{"message": "…"}` |

### Attribution Chapitre ↔ Niveau

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/attrib/chap-niv` | — | `[{No_Niv_Attrib, No_dChap, No_dNiv, chap_name, niv_name}, …]` |
| `POST` | `/api/activites/attrib/chap-niv` | `{"chapitre_id":n, "niveau_ids":[n]}` ou `{"matrix":[…]}`` | `{"message": "…"}` |

### Association type/image/lien

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `POST` | `/api/activites/assoc-type` | `{"No_Act":n, "Type_Act":1|2, "No_dImg":n?, "No_Lien":n?, "Link":"…"?}` | Activité enrichie |

### Positionnement

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/positionnement/activities` | — | `[{No_Act, Name_Act}, …]` |
| `GET` | `/api/activites/positionnement/<act_id>` | — | `{name, img_url, labels:[{id, text, x, y}]}` |
| `POST` | `/api/activites/positionnement` | `[{id, x, y}, …]` | `{"message": "…"}` |

### Listes (quiz)

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/activites/listes/<act_id>` | — | `{No_Act, Name_Act, lists:[{num, reponses:[…]}]}` |
| `POST` | `/api/activites/listes` | `{"act_id":n, "lists":[{reponses:[{No_Rep, nb_etiq}]}]}` | `{"message": "…"}` |
| `DELETE` | `/api/activites/listes/<act_id>` | — | `{"message": "…"}` |

---

## API — Import / Reset / Divers

| Méthode | URL | Body | Réponse |
|---------|-----|------|---------|
| `GET` | `/api/external-links` | — | `{"links":[{url, title, description, id}]}` |
| `POST` | `/api/reset` | — | `{"message": "…"}` (vide toutes les tables) |
| `POST` | `/api/import-csv` | Fichier CSV/XLSX multipart | `{"message":"Import terminé : X élève(s), Y classe(s), Z ignorée(s)"}` |

---

## Gestion des erreurs

- **422** : Erreur de validation Pydantic → `{"error": "…"}`
- **404** : Ressource introuvable → `{"error": "Not found"}`
- **401** : Non authentifié → redirection `/login`

