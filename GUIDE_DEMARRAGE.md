# Guide de Démarrage Rapide - École Saint Joseph de Saaba

## 🚀 Démarrage Rapide

### Étape 1: Installer Node.js

1. Téléchargez Node.js depuis: https://nodejs.org/
2. Choisissez la version **LTS (Long Term Support)**
3. Installez-le en acceptant les options par défaut
4. Redémarrez votre ordinateur ou votre terminal

### Étape 2: Installer les dépendances
 
**Sur Windows:**
```bash
Double-cliquez sur install.bat
```

**Sur Mac/Linux:**
```bash
bash install.sh
```

**Ou manuellement:**
```bash
cd chemin/vers/ecole
npm install
```

### Étape 3: Démarrer le serveur

**Sur Windows:**
```bash
Double-cliquez sur start.bat
```

**Sur Mac/Linux:**
```bash
bash start.sh
```

**Ou manuellement:**
```bash
npm start
```

### Étape 4: Accéder au site

Ouvrez votre navigateur web et allez à:
```
http://localhost:3000
```

## 📝 Comptes de Test

### Compte Admin (pour tester)
- **Email:** admin@ecole.com
- **Mot de passe:** admin

⚠️ **Changez ce mot de passe en production!**

### Créer un Nouveau Compte

1. Cliquez sur "Connexion"
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire avec vos informations
4. Validez pour créer le compte
5. Vous serez automatiquement connecté

## 🧭 Navigation du Site

### Pages Publiques (accessibles à tous)
- **Accueil** - Présentation de l'école
- **À Propos** - Historique, mission, valeurs
- **Cours** - Liste de tous les cours disponibles
- **Interactions** - Forum public (lecture seule sans connexion)
- **Inscription** - Formulaire d'inscription pour nouveaux étudiants

### Pages pour Utilisateurs Connectés
- **Mon Compte** - Voir votre profil
- **Dépôt de Dossier** - Envoyer des documents
- **Déconnexion** - Se déconnecter

## 💾 Structure des Données

Toutes les données sont stockées dans `backend/database.json`:
- **Users** - Comptes utilisateurs
- **Courses** - Cours disponibles
- **Registrations** - Inscriptions reçues
- **Interactions** - Messages du forum
- **Submissions** - Documents soumis

## 🎨 Personnaliser le Site

### Ajouter des Cours

Modifiez `backend/database.json` - section `courses`:

```json
{
    "id": 5,
    "title": "Histoire",
    "description": "Cours d'histoire générale",
    "level": "Collège",
    "teacher": "Nom du professeur",
    "content": "Contenu du cours",
    "image": "/assets/history.jpg"
}
```

### Changer les Couleurs

Modifiez `frontend/css/styles.css` au début du fichier:

```css
:root {
    --primary-color: #2c3e50;        /* Couleur principale */
    --secondary-color: #3498db;      /* Couleur secondaire */
    --success-color: #27ae60;        /* Couleur succès */
    --danger-color: #e74c3c;         /* Couleur erreur */
}
```

### Ajouter des Images

Créez un dossier `frontend/assets/` et mettez-y vos images:
- `math.jpg` - Cours de math
- `french.jpg` - Cours de français
- `science.jpg` - Sciences
- `english.jpg` - Anglais
- `default-course.jpg` - Par défaut

## 🔒 Comptes Utilisateurs

### Rôles Disponibles
- **admin** - Administrateur du site
- **student** - Étudiant (rôle par défaut pour les nouveaux comptes)

### Sécurité
- Les mots de passe sont chiffrés avec bcryptjs
- Les sessions utilisent JWT (JSON Web Tokens)
- Authentification requise pour certaines fonctionnalités

## 🐛 Dépannage

### Le serveur ne démarre pas
1. Vérifiez que Node.js est installé: `node --version`
2. Vérifiez que le port 3000 est libre
3. Supprimez `node_modules` et réinstallez: `npm install`

### Le site charge mais rien n'apparaît
1. Ouvrez la console du navigateur (F12)
2. Vérifiez s'il y a des erreurs
3. Vérifiez que le serveur backend répond: `http://localhost:3000/api/courses`

### Les cours ne s'affichent pas
1. Vérifiez que `backend/database.json` existe
2. Vérifiez que le JSON est valide
3. Redémarrez le serveur

### Impossible de créer un compte
1. Vérifiez que l'email n'existe pas déjà
2. Remplissez tous les champs
3. Vérifiez la console du serveur pour les erreurs

## 📧 Email de Contact

Pour ajouter un formulaire de contact qui envoie des emails:
1. Inscrivez-vous sur SendGrid (https://sendgrid.com/)
2. Obtenez votre API key
3. Intégrez dans le backend (voir documentation advanced)

## 🔄 Mise en Production

**IMPORTANT:** Avant de mettre le site en ligne:

1. **Changez le JWT_SECRET** dans `.env`:
   ```
   JWT_SECRET=votre_clé_secrète_très_longue_et_complexe
   ```

2. **Changez le mot de passe admin**:
   - Supprimez le compte admin dans `database.json`
   - Créez un nouveau compte admin

3. **Configurez une base de données** (MongoDB, PostgreSQL, etc.)

4. **Utilisez HTTPS** pour le site

5. **Sauvegardez régulièrement** la base de données

## 📚 Ressources Complémentaires

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## 📞 Support et Problèmes

Si vous rencontrez des problèmes:
1. Consultez la section "Dépannage" ci-dessus
2. Vérifiez le fichier README.md
3. Consultez les logs du serveur
4. Contactez l'administrateur technique

---

**Version:** 1.0.0  
**Date:** Avril 2026  
**École:** Saint Joseph de Saaba
