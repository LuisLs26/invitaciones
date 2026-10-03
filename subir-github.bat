@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

title Subir Proyecto Invitaciones a GitHub

echo =======================================================
echo          SUBIR PROYECTO A GITHUB - INVITACIONES        
echo =======================================================
echo.

REM 1. Cambiar a la carpeta del proyecto
cd /d "%~dp0"

REM 2. Verificar estado de Git
echo [1/4] Verificando cambios en los archivos...
git status -s
echo.

REM 3. Preparar todos los cambios
echo [2/4] Preparando archivos para subir (git add -A)...
git add -A
if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron preparar los archivos para Git.
    goto SALIR
)

REM 4. Crear commit con fecha y hora o mensaje personalizado
set "DEFAULT_MSG=Actualizacion: Invitaciones estilo iPhone tema claro y optimizaciones moviles (%date% %time:~0,5%)"
echo [3/4] Guardando cambios en Git...
git commit -m "%DEFAULT_MSG%"
if errorlevel 1 (
    echo [INFO] No habia cambios nuevos por guardar.
)

REM 5. Traer ultimos cambios remotos para evitar rechazos (pull rebase)
echo.
echo [4/4] Sincronizando y subiendo a GitHub (git push origin main)...
git pull --rebase origin main > nul 2>&1

git push origin main
if errorlevel 1 (
    echo.
    echo =======================================================
    echo ERROR AL SUBIR A GITHUB:
    echo 1. Verifica tu conexion a internet.
    echo 2. Verifica que tengas sesion iniciada con tu cuenta de GitHub.
    echo 3. Si el repositorio cambio, intenta ejecutar 'git push -u origin main --force' solo si es necesario.
    echo =======================================================
    goto SALIR
)

echo.
echo =======================================================
echo EXITO TOTAL! El proyecto se ha actualizado en GitHub.
echo Repositorio: https://github.com/LuisLs26/invitaciones.git
echo Rama: main
echo Tus enlaces de Cloudflare Pages / web se actualizaran en breve.
echo =======================================================

:SALIR
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
