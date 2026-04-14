# ✅ Checklist de Mise en Place - École Saint Joseph

Utilisez cette checklist pour suivre votre progression dans la mise en place du site.

## 📋 Phase 1: Installation Initiale

### Avant de Commencer
- [ ] Vous êtes dans le dossier `c:\Users\hackf\CODEBASE\ecole\`
- [ ] Vous avez une connexion Internet
- [ ] Vous avez un navigateur Web (Chrome, Firefox, Edge, Safari)

### Installation de Node.js
- [ ] Vous avez visité https://nodejs.org/
- [ ] Vous avez téléchargé la version **LTS**
- [ ] Vous avez installé Node.js (acceptez les options par défaut)
- [ ] Vous avez redémarré votre ordinateur OU terminal
- [ ] Vérification: Exécutez `node --version` (devrait afficher une version)
- [ ] Vérification: Exécutez `npm --version` (devrait afficher une version)

### Installation des Dépendances du Projet
- [ ] Ouvrez un terminal dans le dossier `ecole`
- [ ] Exécutez: `npm install`
- [ ] L'installation s'est terminée sans erreurs
- [ ] Vérification: Le dossier `node_modules` existe
- [ ] Vérification: Le fichier `package-lock.json` existe

---

## 🚀 Phase 2: Démarrage du Serveur

### Lancer le Serveur
- [ ] Ouvrez un terminal dans le dossier `ecole`
- [ ] Exécutez: `npm start`
- [ ] Vous voyez: `🚀 Serveur démarré sur http://localhost:3000`
- [ ] Vous voyez: `📚 Site de l'école Saint Joseph de Saaba`
- [ ] Le serveur est en cours d'exécution (sans erreurs)

### Vérifier l'Accès
- [ ] Ouvrez votre navigateur
- [ ] Allez à: `http://localhost:3000`
- [ ] La page de l'accueil s'affiche
- [ ] Vous voyez: "Bienvenue à l'École Saint Joseph de Saaba"

---

## 🧪 Phase 3: Test Basique

### Navigation
- [ ] Cliquez sur "À Propos" - la page s'affiche
- [ ] Cliquez sur "Cours" - les 4 cours s'affichent
- [ ] Cliquez sur "Interactions" - les messages s'affichent
- [ ] Cliquez sur "Inscription" - le formulaire s'affiche
- [ ] Cliquez sur "Connexion" - le formulaire s'affiche

### Formulaire d'Inscription
- [ ] Cliquez sur "Inscription"
- [ ] Remplissez tous les champs
- [ ] Cliquez "Envoyer l'Inscription"
- [ ] Vous voyez le message: "Inscription envoyée avec succès"

---

## 🔐 Phase 4: Authentification

### Créer un Compte
- [ ] Cliquez sur "Connexion"
- [ ] Cliquez sur "Créer un compte"
- [ ] Remplissez: Nom d'utilisateur
- [ ] Remplissez: Email (ex: test@example.com)
- [ ] Remplissez: Mot de passe
- [ ] Remplissez: Nom complet
- [ ] Cliquez "Créer un Compte"
- [ ] Vous voyez: "Compte créé avec succès!"
- [ ] Vous êtes automatiquement connecté
- [ ] Vous voyez "Mon Compte" et "Déconnexion" dans le menu

### Tester le Compte Admin
- [ ] Cliquez "Déconnexion"
- [ ] Cliquez "Connexion"
- [ ] Email: `admin@ecole.com`
- [ ] Mot de passe: `admin`
- [ ] Cliquez "Se Connecter"
- [ ] Vous êtes connecté (vous voyez "Mon Compte")

### Tester la Déconnexion
- [ ] Cliquez "Déconnexion"
- [ ] Vous voyez: "Déconnexion réussie"
- [ ] Vous êtes déconnecté (vous voyez "Connexion" à nouveau)

---

## 💬 Phase 5: Forum et Interactions

### Créer une Interaction (connecté)
- [ ] Connectez-vous
- [ ] Allez dans "Interactions"
- [ ] Remplissez "Titre du message"
- [ ] Remplissez "Votre message"
- [ ] Sélectionnez une catégorie
- [ ] Cliquez "Poster"
- [ ] Vous voyez: "Message posté avec succès!"
- [ ] Votre message apparaît dans la liste

### Répondre à une Interaction
- [ ] Vous voyez votre message dans la liste
- [ ] Dans le textarea de réponse, tapez quelque chose
- [ ] Cliquez "Répondre"
- [ ] Vous voyez: "Réponse postée avec succès!"
- [ ] Votre réponse apparaît sous le message

### Interactions sans Connexion
- [ ] Déconnectez-vous
- [ ] Allez dans "Interactions"
- [ ] Vous voyez les messages (lecture seule)
- [ ] Pas de formulaire de création
- [ ] Pas de textarea de réponse

---

## 📤 Phase 6: Dépôt de Dossiers

### Accéder à Mon Compte
- [ ] Connectez-vous
- [ ] Cliquez "Mon Compte"
- [ ] Vous voyez vos informations de profil
- [ ] Vous voyez la section "Dépôt de Dossier"
- [ ] Vous voyez la section "Mes Dossiers Envoyés"

### Envoyer un Dossier
- [ ] Dans "Dépôt de Dossier", sélectionnez un type
- [ ] Remplissez la description (optionnel)
- [ ] Sélectionnez un fichier (optionnel pour le test)
- [ ] Cliquez "Envoyer le Dossier"
- [ ] Vous voyez: "Dossier envoyé avec succès!"
- [ ] Le dossier apparaît dans "Mes Dossiers Envoyés"

---

## 🔧 Phase 7: Configuration et Personnalisation

### Ajouter un Cours
- [ ] Ouvrez `backend/database.json`
- [ ] Trouvez la section `"courses"`
- [ ] Regardez la structure d'un cours
- [ ] (Optionnel) Ajoutez un nouveau cours
- [ ] Sauvegardez le fichier
- [ ] Redémarrez le serveur (`Ctrl+C` puis `npm start`)
- [ ] Allez sur "Cours" - le nouveau cours s'affiche

### Changer les Couleurs
- [ ] Ouvrez `frontend/css/styles.css`
- [ ] Trouvez `:root { ... }`
- [ ] Regardez les couleurs définies
- [ ] (Optionnel) Changez une couleur (ex: `--primary-color`)
- [ ] Sauvegardez le fichier
- [ ] Rafraîchissez le navigateur (F5)
- [ ] Les couleurs du site changent

### Changer le Mot de Passe Admin
- [ ] Supprimez le compte admin dans `database.json`
- [ ] Créez un nouveau compte via l'interface
- [ ] L'ancien mot de passe ne fonctionne plus
- [ ] Le nouveau fonctionne

---

## 📊 Phase 8: Tests Avancés

### Test API REST (en ligne de commande)
- [ ] Ouvrez un autre terminal
- [ ] Exécutez: `curl http://localhost:3000/api/courses`
- [ ] Vous voyez une liste JSON des cours

### Vérifier la Base de Données
- [ ] Ouvrez `backend/database.json`
- [ ] Vérifiez que les données s'accumulent:
  - [ ] Nouveaux utilisateurs dans `"users"`
  - [ ] Nouvelles inscriptions dans `"registrations"`
  - [ ] Nouveaux messages dans `"interactions"`
  - [ ] Nouveaux dossiers dans `"submissions"`

### Tester l'Erreur de Port
- [ ] Gardez le serveur démarré
- [ ] Ouvrez un autre terminal
- [ ] Exécutez: `npm start`
- [ ] Vous devriez voir une erreur `EADDRINUSE`
- [ ] C'est normal (le port 3000 est déjà utilisé)

---

## 🎨 Phase 9: Perfectionnement

### Documentation
- [ ] Lisez `README.md` - Guide complet
- [ ] Lisez `GUIDE_DEMARRAGE.md` - Démarrage rapide
- [ ] Lisez `DOCUMENTATION_TECHNIQUE.md` - Détails techniques
- [ ] Lisez `API_REFERENCE.md` - Référence API

### Sauvegardes
- [ ] Créez une sauvegarde de `backend/database.json`
- [ ] Copiez-la dans un endroit sûr (cloud, autre disque)
- [ ] Créez une routine de sauvegarde régulière

### Améliorations
- [ ] Ajoutez des images dans `frontend/assets/`
- [ ] Mettez à jour les informations de l'école
- [ ] Personnalisez les couleurs et le design
- [ ] Ajoutez plus de cours
- [ ] Ajoutez plus de classes

---

## 🔒 Phase 10: Préparation à la Production

### Avant le Déploiement
- [ ] Changez `JWT_SECRET` dans `.env`
- [ ] Changez le mot de passe admin
- [ ] Envisagez une base de données permanente (MongoDB)
- [ ] Configurez HTTPS (certificat SSL)
- [ ] Testez toutes les fonctionnalités
- [ ] Mettez en place un système de sauvegarde

### Déploiement Options
- [ ] Consultez `DOCUMENTATION_TECHNIQUE.md` pour les options
- [ ] Choisir: Heroku, VPS, Cloud Provider, etc.
- [ ] Suivre les instructions de déploiement
- [ ] Tester après déploiement

---

## 🐛 Dépannage - En cas de Problème

### Le serveur ne démarre pas
- [ ] Vérifiez: `node --version` (doit fonctionner)
- [ ] Vérifiez: `npm --version` (doit fonctionner)
- [ ] Supprimez `node_modules` et `package-lock.json`
- [ ] Exécutez: `npm install`
- [ ] Exécutez: `npm start`

### Rien n'apparaît sur le site
- [ ] Ouvrez la console du navigateur (F12)
- [ ] Vérifiez s'il y a des erreurs
- [ ] Vérifiez l'onglet Network
- [ ] Vérifiez que le serveur est en cours d'exécution

### Je ne peux pas me connecter
- [ ] Vérifiez que le compte existe
- [ ] Essayez le compte admin
- [ ] Créez un nouveau compte
- [ ] Vérifiez la console du serveur pour les erreurs

### Les données ne se sauvegardent pas
- [ ] Vérifiez que `backend/database.json` existe
- [ ] Vérifiez les permissions du fichier
- [ ] Vérifiez l'espace disque disponible
- [ ] Redémarrez le serveur

---

## 📞 Besoin d'Aide?

- [ ] Lisez la section correspondante dans la documentation
- [ ] Consultez `DOCUMENTATION_TECHNIQUE.md`
- [ ] Vérifiez les logs du serveur
- [ ] Testez avec le compte admin
- [ ] Réessayez après un redémarrage

---

## 🎉 Félicitations!

Si vous avez coché tous les points:

✅ Votre site est correctement installé  
✅ Toutes les fonctionnalités marchent  
✅ Vous êtes prêt à personnaliser et déployer  
✅ Vous pouvez commencer à l'utiliser!

---

## 📝 Notes Personnelles

Utilisez cet espace pour noter vos observations:

```
[Espace pour notes]
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
```

---

**Checklist Version:** 1.0  
**Date:** Avril 2026  
**Projet:** École Saint Joseph de Saaba
