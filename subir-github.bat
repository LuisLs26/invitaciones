@echo off
setlocal enabledelayedexpansion

title Subir Proyecto Invitaciones a GitHub

echo =======================================================
echo          SUBIR PROYECTO A GITHUB - INVITACIONES        
echo =======================================================
echo.

REM 1. Cambiar a la carpeta del proyecto
cd /d "%~dp0"

REM 2. Preparar todos los cambios
echo [1/3] Preparando archivos (git add -A)...
git add -A
if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron preparar los archivos para Git.
    goto SALIR
)

REM 3. Crear commit
echo [2/3] Guardando cambios en Git...
git commit -m "Actualizacion de invitaciones digitales y demos"
if errorlevel 1 (
    echo [INFO] No hay cambios pendientes por guardar.
)

REM 4. Subir a GitHub
echo [3/3] Subiendo cambios a GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo subir el proyecto a GitHub.
    echo Verifica tu conexion a internet o tus permisos en GitHub.
    goto SALIR
)

echo.
echo =======================================================
echo EXITO! El proyecto se ha actualizado en GitHub.
echo Repositorio: https://github.com/LuisLs26/invitaciones.git
echo Rama: main
echo =======================================================

:SALIR
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
