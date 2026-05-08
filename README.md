# 📚 École Saint Joseph de Saaba - Site Web

Un site web moderne et complet pour l'École Saint Joseph de Saaba, offrant une plateforme centralisée pour les informations scolaires, les cours, les inscriptions et les interactions.

## ✨ Fonctionnalités

### 1. **Informations de l'École**
   - Page d'accueil attrayante
   - Historique et mission de l'école
   - Infrastructure et valeurs
   - Vue d'ensemble complète de l'établissement

### 2. **Gestion des Cours**
   - Liste des cours disponibles
   - Informations détaillées (enseignant, niveau, contenu)
   - Organisation par classe

### 3. **Système d'Authentification**
   - Création de compte utilisateur
   - Connexion sécurisée avec JWT
   - Gestion des sessions
   - Chiffrement des mots de passe (bcrypt)

### 4. **Inscriptions**
   - Formulaire d'inscription en ligne
   - Collecte des informations de l'étudiant et du tuteur
   - Suivi automatique des inscriptions

### 5. **Espace d'Interactions**
   - Forum de discussion
   - Annonces et discussions
   - Système de réponses (replies)
   - Catégorisation des messages
   - Réservé aux utilisateurs connectés

### 6. **Espace Personnel**
   - Profil utilisateur
   - Historique des inscriptions
   - Dépôt de dossiers (documents)
   - Suivi du statut des documents

### 7. **Dépôt de Dossiers**
   - Téléchargement de documents
   - Suivi du statut (en attente, accepté, rejeté)
   - Types de documents: inscription, certificat, justificatif, autre

## 📋 Architecture du Projet

```
ecole/
├── backend/
│   ├── server.js                 # Serveur Express
│   ├── database.json             # Base de données JSON
│   ├── models/
│   │   └── Database.js           # Modèle de données
│   ├── middleware/
│   │   └── auth.js               # Authentification JWT
│   └── routes/
│       ├── auth.js               # Routes d'authentification
│       ├── courses.js            # Routes des cours
│       ├── registrations.js      # Routes des inscriptions
│       ├── interactions.js       # Routes des interactions
│       └── submissions.js        # Routes des dépôts de dossiers
├── frontend/
│   ├── index.html                # Page principale
│   ├── css/
│   │   └── styles.css            # Styles CSS
│   └── js/
│       └── app.js                # Logique JavaScript
├── package.json                  # Dépendances Node.js
├── .env                          # Variables d'environnement
└── README.md                     # Cette documentation
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)

### Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   - Le fichier `.env` est déjà configuré avec les valeurs par défaut
   - Pour la production, changez `JWT_SECRET` dans `.env`

3. **Démarrer le serveur**
   ```bash
   npm start
   ```
   
   Ou en mode développement (avec rechargement automatique):
   ```bash
   npm run dev
   ```

4. **Accéder au site**
   - Ouvrez votre navigateur et allez à: `http://localhost:3000`

## 📝 Pages Disponibles

### Pour Tous
- **Accueil** - Page d'accueil avec présentation
- **À Propos** - Informations complètes sur l'école
- **Cours** - Liste de tous les cours disponibles
- **Inscription** - Formulaire d'inscription pour les nouveaux étudiants
- **Interactions** - Espace de discussion et d'annonces (lecture pour tous, écriture pour connectés)

### Connectés
- **Mon Compte** - Profil utilisateur et historique
- **Dépôt de Dossier** - Envoi de documents
- **Déconnexion** - Quitter le compte

## 🔐 Authentification

### Comptes de Démonstration

**Admin** (pour vérifier le système)
- Email: `admin@ecole.com`
- Mot de passe: `admin` (à changer en production)

### Créer un Nouveau Compte
- Cliquez sur "Connexion"
- Cliquez sur "Créer un compte"
- Remplissez le formulaire
- Votre compte sera créé et vous serez connecté automatiquement

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Connexion

### Cours
- `GET /api/courses` - Récupérer tous les cours
- `GET /api/courses/:id` - Récupérer un cours spécifique

### Inscriptions
- `GET /api/registrations` - Récupérer les inscriptions
- `POST /api/registrations` - Créer une inscription

### Interactions
- `GET /api/interactions` - Récupérer les interactions
- `POST /api/interactions` - Créer une interaction (authentifiée)
- `POST /api/interactions/:id/replies` - Répondre à une interaction (authentifiée)

### Dépôts de Dossiers
- `GET /api/submissions` - Récupérer les dépôts (authentifiée)
- `POST /api/submissions` - Envoyer un dossier (authentifiée)

## 🎨 Personnalisation

### Couleurs et Thème
Modifiez les variables CSS dans [frontend/css/styles.css](frontend/css/styles.css):

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
}
```

### Ajouter des Cours
Modifiez le tableau `courses` dans [backend/database.json](backend/database.json):

```json
{
    "id": 5,
    "title": "Histoire",
    "description": "...",
    "level": "Collège",
    "teacher": "Nom du professeur",
    "content": "...",
    "image": "/assets/history.jpg"
}
```

### Images
Créez un dossier `frontend/assets/` et ajoutez vos images:
- `math.jpg` - Image pour le cours de math
- `french.jpg` - Image pour le cours de français
- `science.jpg` - Image pour les sciences
- `english.jpg` - Image pour l'anglais
- `default-course.jpg` - Image par défaut

## 📧 Renseignements et Support

### Email de Contact
- Pour ajouter un email de contact, modifiez le formulaire de contact
- Intégrez un service de mail (SendGrid, Mailgun, etc.)

### Système de Renseignements
- Les utilisateurs peuvent poser des questions via l'espace Interactions
- Les administrateurs peuvent répondre aux questions
- Système de catégorisation: Questions, Annonces, Discussions, Aide

## 🔒 Sécurité

- Mots de passe chiffrés avec bcryptjs
- Authentification par JWT (JSON Web Tokens)
- CORS activé pour les appels API
- Validation des entrées côté serveur

## 📱 Responsive Design

Le site est complètement responsive et fonctionne sur:
- Desktop
- Tablettes
- Smartphones

## 🔮 Améliorations Futures

- [ ] Base de données MongoDB
- [ ] Système de fichiers pour uploads réels
- [ ] Email notifications
- [ ] Panneau d'administration complet
- [ ] Système de notes/résultats
- [ ] Calendrier scolaire
- [ ] Emploi du temps
- [ ] Chat en temps réel
- [ ] Application mobile
- [ ] Intégration de paiement

## 📄 Licence

Ce projet est libre d'utilisation pour l'École Saint Joseph de Saaba.

## 👥 Support

Pour toute question ou support technique, contactez l'administrateur du site.

---

**Dernière mise à jour:** Avril 2026
**Version:** 1.0.0
