# 📖 Documentation Technique - École Saint Joseph de Saaba

## Table des Matières

1. [Architecture Générale](#architecture-générale)
2. [Configuration](#configuration)
3. [API REST](#api-rest)
4. [Authentification](#authentification)
5. [Gestion des Données](#gestion-des-données)
6. [Déploiement](#déploiement)
7. [Dépannage](#dépannage)

## Architecture Générale

### Stack Technologique

- **Frontend:**
  - HTML5
  - CSS3 (avec variables CSS)
  - JavaScript (ES6+)
  - SPA (Single Page Application)

- **Backend:**
  - Node.js
  - Express.js
  - JWT (JSON Web Tokens)
  - bcryptjs (chiffrement des mots de passe)

- **Base de Données:**
  - JSON (fichier `database.json`)
  - Production: MongoDB recommandé

### Structure des Dossiers

```
ecole/
├── backend/
│   ├── server.js                    # Point d'entrée du serveur
│   ├── database.json                # Données persistantes
│   ├── models/
│   │   └── Database.js              # Classe de gestion DB
│   ├── middleware/
│   │   └── auth.js                  # Middleware d'authentification
│   └── routes/
│       ├── auth.js                  # Routes d'authentification
│       ├── courses.js               # Routes des cours
│       ├── registrations.js         # Routes des inscriptions
│       ├── interactions.js          # Routes des interactions
│       └── submissions.js           # Routes des soumissions
├── frontend/
│   ├── index.html                   # Page HTML unique
│   ├── css/
│   │   └── styles.css               # Styles globaux
│   ├── js/
│   │   └── app.js                   # Logique JavaScript
│   └── assets/                      # Images et ressources
├── package.json                     # Configuration npm
├── .env                             # Variables d'environnement
└── .gitignore                       # Fichiers à ignorer

```

## Configuration

### Variables d'Environnement (.env)

```ini
PORT=3000                           # Port du serveur
JWT_SECRET=your_secret_key_here    # Clé secrète JWT
NODE_ENV=development               # Environnement (development/production)
```

### Configuration Express (server.js)

```javascript
// Middleware
app.use(cors());                    // CORS activé
app.use(express.json());            // Parse JSON
app.use(express.static(...));       # Servir fichiers statiques

// Routes
app.use('/api/auth', ...);
app.use('/api/courses', ...);
// etc.
```

## API REST

### Base URL
```
http://localhost:3000/api
```

### Authentification

#### POST /auth/register
Créer un nouveau compte utilisateur.

**Request:**
```json
{
  "username": "utilisateur",
  "email": "user@example.com",
  "password": "motdepasse",
  "fullName": "Nom Complet"
}
```

**Response (201):**
```json
{
  "message": "Compte créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "utilisateur",
    "email": "user@example.com",
    "fullName": "Nom Complet"
  }
}
```

**Erreurs:**
- 400: Champs manquants ou email déjà utilisé
- 500: Erreur serveur

#### POST /auth/login
Connexion d'un utilisateur existant.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "motdepasse"
}
```

**Response (200):**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "utilisateur",
    "email": "user@example.com",
    "fullName": "Nom Complet",
    "role": "student"
  }
}
```

**Erreurs:**
- 400: Email ou mot de passe manquant
- 401: Identifiants incorrects
- 500: Erreur serveur

### Cours

#### GET /courses
Récupérer tous les cours.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Mathématiques",
    "description": "Cours de mathématiques",
    "level": "Collège",
    "teacher": "M. Diallo",
    "content": "Algèbre, Géométrie",
    "image": "/assets/math.jpg"
  },
  ...
]
```

#### GET /courses/:id
Récupérer un cours spécifique.

**Response (200):**
```json
{
  "id": 1,
  "title": "Mathématiques",
  ...
}
```

**Erreurs:**
- 404: Cours non trouvé

### Inscriptions

#### GET /registrations
Récupérer toutes les inscriptions.

**Response (200):**
```json
[
  {
    "id": 1,
    "firstName": "Moussa",
    "lastName": "Diallo",
    "email": "moussa@example.com",
    "phone": "+223 12345678",
    "class": "6ème A",
    "parentName": "Ousmane Diallo",
    "parentPhone": "+223 87654321",
    "registrationDate": "2024-01-15T10:30:00Z",
    "status": "pending"
  },
  ...
]
```

#### POST /registrations
Créer une nouvelle inscription.

**Request:**
```json
{
  "firstName": "Moussa",
  "lastName": "Diallo",
  "email": "moussa@example.com",
  "phone": "+223 12345678",
  "class": "6ème A",
  "parentName": "Ousmane Diallo",
  "parentPhone": "+223 87654321"
}
```

**Response (201):**
```json
{
  "message": "Inscription créée avec succès",
  "registration": { ... }
}
```

**Erreurs:**
- 400: Champs manquants
- 500: Erreur serveur

### Interactions

#### GET /interactions
Récupérer toutes les interactions (messages, annonces).

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "author": "user@example.com",
    "title": "Titre du message",
    "message": "Contenu du message",
    "category": "question|announcement|discussion|help",
    "createdAt": "2024-01-10T08:00:00Z",
    "replies": [
      {
        "userId": 2,
        "author": "other@example.com",
        "message": "Réponse",
        "createdAt": "2024-01-10T09:00:00Z"
      }
    ]
  },
  ...
]
```

#### POST /interactions
Créer un nouveau message (authentifiée).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "Ma question",
  "message": "Voici ma question...",
  "category": "question"
}
```

**Response (201):**
```json
{
  "message": "Message posté avec succès",
  "interaction": { ... }
}
```

**Erreurs:**
- 400: Champs manquants
- 401: Non authentifiée
- 500: Erreur serveur

#### POST /interactions/:id/replies
Répondre à une interaction (authentifiée).

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "message": "Voici ma réponse..."
}
```

**Response (201):**
```json
{
  "message": "Réponse postée avec succès",
  "reply": { ... }
}
```

### Soumissions de Dossiers

#### GET /submissions
Récupérer les soumissions de l'utilisateur (authentifiée).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "userEmail": "user@example.com",
    "documentType": "inscription",
    "description": "Demande d'inscription",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "status": "pending|accepted|rejected",
    "submittedAt": "2024-01-15T14:30:00Z"
  },
  ...
]
```

#### POST /submissions
Soumettre un dossier (authentifiée).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "documentType": "inscription",
  "description": "Demande d'inscription",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf"
}
```

**Response (201):**
```json
{
  "message": "Document envoyé avec succès",
  "submission": { ... }
}
```

**Erreurs:**
- 400: Champs manquants
- 401: Non authentifiée
- 500: Erreur serveur

## Authentification

### JWT (JSON Web Tokens)

#### Structure du Token

```
Header.Payload.Signature
```

#### Payload

```json
{
  "id": 1,
  "email": "user@example.com",
  "iat": 1704009600,
  "exp": 1704614400
}
```

#### Utilisation

1. L'utilisateur se connecte → Reçoit un token
2. Le token est stocké dans `localStorage`
3. Pour chaque requête authentifiée, inclure:
   ```
   Authorization: Bearer {token}
   ```

#### Expiration

- Token valide pendant: 7 jours
- Après expiration: Re-connexion requise

### Chiffrement des Mots de Passe

Utilisation de bcryptjs:
- Pas de stockage en clair
- 10 rounds de salting
- Comparaison sécurisée lors de la connexion

## Gestion des Données

### Structure de database.json

```json
{
  "users": [ ... ],
  "courses": [ ... ],
  "registrations": [ ... ],
  "interactions": [ ... ],
  "submissions": [ ... ]
}
```

### Schéma User

```json
{
  "id": 1,
  "username": "utilisateur",
  "email": "user@example.com",
  "password": "$2a$10$...",
  "fullName": "Nom Complet",
  "role": "student|admin",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Schéma Course

```json
{
  "id": 1,
  "title": "Titre du cours",
  "description": "Description",
  "level": "Collège|Lycée",
  "teacher": "Nom du professeur",
  "content": "Contenu du cours",
  "image": "/assets/image.jpg"
}
```

### Schéma Registration

```json
{
  "id": 1,
  "firstName": "Prénom",
  "lastName": "Nom",
  "email": "email@example.com",
  "phone": "+223 ...",
  "class": "6ème A",
  "parentName": "Nom du tuteur",
  "parentPhone": "+223 ...",
  "registrationDate": "2024-01-15T10:30:00Z",
  "status": "pending|approved|rejected"
}
```

### Schéma Interaction

```json
{
  "id": 1,
  "userId": 1,
  "author": "user@example.com",
  "title": "Titre",
  "message": "Contenu",
  "category": "question|announcement|discussion|help",
  "createdAt": "2024-01-10T08:00:00Z",
  "replies": [ ... ]
}
```

### Schéma Submission

```json
{
  "id": 1,
  "userId": 1,
  "userEmail": "user@example.com",
  "documentType": "inscription|certificat|justificatif|autre",
  "description": "Description",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "status": "pending|accepted|rejected",
  "submittedAt": "2024-01-15T14:30:00Z"
}
```

## Déploiement

### Sur Heroku

1. Installer Heroku CLI
2. Créer un compte Heroku
3. Login: `heroku login`
4. Créer app: `heroku create nom-app`
5. Configurer env: `heroku config:set JWT_SECRET=...`
6. Deploy: `git push heroku main`

### Sur un VPS

1. Installer Node.js
2. Cloner le repo
3. Installer dépendances: `npm install`
4. Configurer .env
5. Utiliser PM2 pour gérer le serveur:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js
   pm2 save
   ```

### Sur un Serveur d'Entreprise

1. Sauvegarder les données
2. Configurer HTTPS (certificat SSL)
3. Configurer reverse proxy (Nginx)
4. Configurer monitoring et logs
5. Établir backup automatiques

## Dépannage

### Erreur: "Cannot find module 'express'"

**Solution:**
```bash
npm install
```

### Erreur: "EADDRINUSE: address already in use :::3000"

**Cause:** Le port 3000 est déjà utilisé

**Solution:**
- Arrêter le processus utilisant le port
- Changer le port dans .env: `PORT=3001`

### Les données ne se sauvegardent pas

**Vérifier:**
1. Que `database.json` existe et est accessible
2. Les permissions du fichier
3. L'espace disque disponible

### Les utilisateurs ne peuvent pas créer de compte

**Vérifier:**
1. Le formulaire d'inscription
2. Les validations serveur
3. Les logs du serveur

### Token invalide après redémarrage

**Normal** - Les tokens expirent après 7 jours. Connexion requise.

## Maintenance

### Sauvegardes Régulières

```bash
# Copier la base de données
cp backend/database.json backup/database-$(date +%Y%m%d).json
```

### Monitoring

Vérifier:
- Logs du serveur (erreurs)
- Utilisation du disque
- Nombre de requêtes
- Performance

### Mise à Jour

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour les dépendances
npm update
```

---

**Version:** 1.0.0  
**Dernière mise à jour:** Avril 2026
