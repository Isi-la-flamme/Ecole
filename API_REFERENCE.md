# API Reference Rapide - École Saint Joseph

## 🚀 Démarrage

```bash
npm install    # Installer les dépendances
npm start      # Démarrer le serveur
```

Serveur: `http://localhost:3000`  
API Base: `http://localhost:3000/api`

---

## 🔐 Authentification

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "utilisateur",
  "email": "user@example.com",
  "password": "motdepasse",
  "fullName": "Nom Complet"
}

Returns: { token, user }
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse"
}

Returns: { token, user }
```

---

## 📚 Cours

### Get All
```
GET /api/courses

Returns: [{ id, title, description, level, teacher, content, image }, ...]
```

### Get One
```
GET /api/courses/:id

Returns: { id, title, description, level, teacher, content, image }
```

---

## 📝 Inscriptions

### Get All
```
GET /api/registrations

Returns: [{ id, firstName, lastName, email, phone, class, parentName, parentPhone, registrationDate, status }, ...]
```

### Create
```
POST /api/registrations
Content-Type: application/json

{
  "firstName": "Moussa",
  "lastName": "Diallo",
  "email": "moussa@example.com",
  "phone": "+223 12345678",
  "class": "6ème A",
  "parentName": "Ousmane Diallo",
  "parentPhone": "+223 87654321"
}

Returns: { message, registration }
```

---

## 💬 Interactions

### Get All
```
GET /api/interactions

Returns: [{ id, userId, author, title, message, category, createdAt, replies }, ...]
```

### Create (Authenticated)
```
POST /api/interactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Ma question",
  "message": "Contenu du message",
  "category": "question|announcement|discussion|help"
}

Returns: { message, interaction }
```

### Reply (Authenticated)
```
POST /api/interactions/:id/replies
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "Ma réponse"
}

Returns: { message, reply }
```

---

## 📤 Dépôts de Dossiers

### Get All (Authenticated)
```
GET /api/submissions
Authorization: Bearer {token}

Returns: [{ id, userId, userEmail, documentType, description, fileName, fileSize, mimeType, status, submittedAt }, ...]
```

### Submit (Authenticated)
```
POST /api/submissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "documentType": "inscription|certificat|justificatif|autre",
  "description": "Description optionnelle",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf"
}

Returns: { message, submission }
```

---

## ✅ Utilisateurs de Test

### Admin
- Email: `admin@ecole.com`
- Password: `admin`

### Créer un nouveau compte
Via l'interface web: "Connexion" → "Créer un compte"

---

## 🔑 Utiliser le Token

Pour les routes authentifiées, inclure:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token valide pendant: **7 jours**

---

## 🗂️ Structure de Données

### User
```json
{
  "id": 1,
  "username": "utilisateur",
  "email": "user@example.com",
  "password": "hashed",
  "fullName": "Nom Complet",
  "role": "admin|student",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Course
```json
{
  "id": 1,
  "title": "Mathématiques",
  "description": "...",
  "level": "Collège",
  "teacher": "M. Diallo",
  "content": "...",
  "image": "/assets/math.jpg"
}
```

### Registration
```json
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
}
```

### Interaction
```json
{
  "id": 1,
  "userId": 1,
  "author": "user@example.com",
  "title": "Titre",
  "message": "Contenu",
  "category": "question",
  "createdAt": "2024-01-10T08:00:00Z",
  "replies": []
}
```

### Submission
```json
{
  "id": 1,
  "userId": 1,
  "userEmail": "user@example.com",
  "documentType": "inscription",
  "description": "...",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "status": "pending",
  "submittedAt": "2024-01-15T14:30:00Z"
}
```

---

## 🛠️ Variables d'Environnement

Fichier: `.env`
```
PORT=3000
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

---

## 📁 Structure

```
ecole/
├── backend/
│   ├── server.js
│   ├── database.json
│   ├── models/Database.js
│   ├── middleware/auth.js
│   └── routes/
│       ├── auth.js
│       ├── courses.js
│       ├── registrations.js
│       ├── interactions.js
│       └── submissions.js
├── frontend/
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   └── assets/
├── package.json
├── .env
└── README.md
```

---

## 🚦 HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 📞 Contact

Pour des questions sur l'API:
1. Consultez `DOCUMENTATION_TECHNIQUE.md`
2. Vérifiez les logs du serveur
3. Testez avec Postman ou cURL

---

**Version:** 1.0.0  
**Date:** Avril 2026
