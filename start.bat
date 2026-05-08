@echo off
REM Démarrer le serveur de l'école Saint Joseph

echo.
echo === Démarrage du serveur École Saint Joseph ===
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js n'est pas installé ou non trouvé dans PATH
    echo.
    echo Installez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier les dépendances
if not exist "node_modules" (
    echo Installation des dépendances manquantes...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Installation échouée
        pause
        exit /b 1
    )
)

echo.
echo Démarrage du serveur...
echo.
echo 🚀 Le serveur démarre sur http://localhost:3000
echo 📚 Accédez au site dans votre navigateur
echo.
echo Pour arrêter le serveur, appuyez sur Ctrl+C
echo.

call npm start

pause
