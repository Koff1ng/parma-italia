@echo off
title Configurar CORS para Firebase Storage

echo ====================================================
echo     CONFIGURANDO CORS PARA FIREBASE STORAGE
echo ====================================================
echo.

:: Verificar gsutil instalado
echo Verificando gsutil...
where gsutil >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: gsutil NO esta instalado.
    echo Por favor instala Google Cloud SDK desde:
    echo https://cloud.google.com/sdk/docs/install
    pause
    exit /b
)

:: Obtener el bucket del proyecto
echo Detectando bucket de Firebase...
for /f "tokens=* delims=" %%a in ('firebase storage:bucket') do (
    set BUCKET=%%a
)

echo Bucket detectado: %BUCKET%
echo.

:: Verificar archivo cors.json
if not exist cors.json (
    echo ❌ ERROR: No se encontro cors.json en esta carpeta.
    echo Asegurate de que el archivo exista en la raiz del proyecto.
    pause
    exit /b
)

:: Aplicar configuracion CORS
echo Aplicando configuracion CORS...
gsutil cors set cors.json gs://%BUCKET%

echo.
echo ====================================================
echo        ✔ CORS CONFIGURADOS CORRECTAMENTE
echo ====================================================
echo.

echo CORS actuales:
gsutil cors get gs://%BUCKET%

echo.
echo Presiona una tecla para cerrar...
pause
exit
