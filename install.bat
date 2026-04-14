@echo off
REM Installation du projet École Saint Joseph de Saaba
echo.
echo === Installation du site de l'école Saint Joseph ===
echo.
echo Vérification de Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js n'est pas installé!
    echo.
    echo Veuillez installer Node.js depuis: https://nodejs.org/
    echo - Téléchargez la version LTS
    echo - Acceptez les options par défaut
    echo - Redémarrez votre terminal après installation
    echo.
    pause
    exit /b 1
)

echo Node.js trouvé!
echo.
echo Installation des dépendances...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Installation des dépendances échouée
    pause
    exit /b 1
)

echo.
echo Installation réussie!
echo.
echo Pour démarrer le serveur, exécutez:
echo npm start
echo.
echo Puis ouvrez http://localhost:3000 dans votre navigateur
pause
