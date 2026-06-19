# Système d'Authentification

## Vue d'ensemble

Un système d'authentification complet a été implémenté pour sécuriser l'application. Toutes les routes (sauf `/login`, `/register`, et les ressources statiques) nécessitent une authentification.

## Fonctionnalités

- **Inscription** (`/register`): Permet aux utilisateurs de créer un compte
- **Connexion** (`/login`): Authentification avec identifiant/mot de passe
- **Déconnexion** (`/logout`): Déconnexion de l'utilisateur
- **Gestion des sessions**: Sessions Flask sécurisées
- **Hachage des mots de passe**: Utilisation de Werkzeug pour la sécurité

## Installation et configuration

### 1. Installer les dépendances

```bash
pip install -r requirements.txt
```

Les packages suivants ont été ajoutés:
- `Flask-Session>=0.5.0` - Gestion améliorée des sessions
- `werkzeug>=3.0` - Hachage sécurisé des mots de passe

### 2. Appliquer les migrations

```bash
PYTHONPATH=. alembic upgrade head
```

Cela crée la table `user` dans la base de données.

## Utilisation

### Créer un utilisateur (CLI)

```bash
# Via la ligne de commande
python -m src.cli create-user

# Ou avec les options
python -m src.cli create-user --username admin --email admin@example.com --password motdepasse123
```

### Lister les utilisateurs

```bash
python -m src.cli list-users
```

### Supprimer un utilisateur

```bash
python -m src.cli delete-user --username admin
```

### Activer/Désactiver un utilisateur

```bash
python -m src.cli toggle-user --username admin
```

## Flux d'authentification

1. L'utilisateur accède à une page protégée (ex: `/`)
2. S'il n'est pas connecté, il est redirigé vers `/login`
3. Il peut:
   - Se connecter s'il a un compte
   - S'inscrire pour créer un nouveau compte
4. Après la connexion, sa session est sauvegardée
5. Il peut accéder à toutes les routes protégées
6. Il peut se déconnecter via le bouton "Déconnexion" dans la navbar

## Routes

### Routes publiques (sans authentification)

- `GET /login` - Page de connexion
- `POST /login` - Traitement de la connexion
- `GET /register` - Page d'inscription
- `POST /register` - Traitement de l'inscription
- `POST /logout` - Déconnexion

### Routes protégées (authentification requise)

- `GET /` - Dashboard
- `GET /classes` - Gestion des classes
- `GET /eleves` - Gestion des élèves
- `GET /distribution` - Distribution des élèves
- `/api/*` - Toutes les routes API

## Modèle User

Le modèle `User` contient les champs suivants:

```python
- id: Integer (clé primaire)
- username: String (unique, indexé)
- email: String (unique, indexé)
- password_hash: String (mot de passe haché)
- is_active: Boolean (par défaut: True)
- created_at: DateTime (créé automatiquement)
```

## Sécurité

- Les mots de passe sont hachés avec Werkzeug (PBKDF2 par défaut)
- Les sessions sont stockées sur le disque (configurable)
- Un SECRET_KEY doit être configuré en production (voir config.py)
- Les utilisateurs inactifs ne peuvent pas se connecter

## Configuration en production

Avant de déployer:

1. Modifier le `SECRET_KEY` dans les variables d'environnement:
   ```bash
   export SECRET_KEY="une-clé-secrète-très-sécurisée"
   ```

2. Configurer le stockage des sessions (optionnel):
   ```python
   # Dans config.py
   app.config["SESSION_TYPE"] = "filesystem"  # ou "redis", "memcached"
   ```

3. Utiliser HTTPS pour sécuriser les communications

## Tests

Tous les tests passent avec le système d'authentification:

```bash
pytest -v
```

Une fixture `client` a été ajoutée au conftest.py qui crée automatiquement un utilisateur de test et le connecte pour chaque test.
