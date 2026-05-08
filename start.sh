#!/bin/bash

# Démarrer le serveur de l'école Saint Joseph

echo ""
echo "=== Démarrage du serveur École Saint Joseph ==="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js n'est pas installé ou non trouvé dans PATH"
    echo ""
    echo "Installez Node.js depuis: https://nodejs.org/"
    exit 1
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances manquantes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Installation échouée"
        exit 1
    fi
fi

echo ""
echo "Démarrage du serveur..."
echo ""
echo "🚀 Le serveur démarre sur http://localhost:3000"
echo "📚 Accédez au site dans votre navigateur"
echo ""
echo "Pour arrêter le serveur, appuyez sur Ctrl+C"
echo ""

npm start
