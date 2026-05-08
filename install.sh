#!/bin/bash

# Installation du projet École Saint Joseph de Saaba

echo ""
echo "=== Installation du site de l'école Saint Joseph ==="
echo ""
echo "Vérification de Node.js..."

if ! command -v node &> /dev/null; then
    echo ""
    echo "ERROR: Node.js n'est pas installé!"
    echo ""
    echo "Veuillez installer Node.js depuis: https://nodejs.org/"
    echo "- Téléchargez la version LTS"
    echo "- Acceptez les options par défaut"
    echo "- Redémarrez votre terminal après installation"
    echo ""
    exit 1
fi

echo "Node.js trouvé!"
echo ""
echo "Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Installation des dépendances échouée"
    exit 1
fi

echo ""
echo "Installation réussie!"
echo ""
echo "Pour démarrer le serveur, exécutez:"
echo "npm start"
echo ""
echo "Puis ouvrez http://localhost:3000 dans votre navigateur"
