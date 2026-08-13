@echo off
setlocal enabledelayedexpansion

echo =======================================================
echo          SUBIR PROYECTO A GITHUB - INVITACIONES        
echo =======================================================
echo.

REM 1. Asegurar que estamos en la carpeta del proyecto
cd /d "%~dp0"

REM 2. Comprobar si existen cambios pendientes
set HAS_CHANGES=0
git status --porcelain > temp_status.txt 2>&1
for /f "usebackq tokens=*" %%a in ("temp_status.txt") do (
    set HAS_CHANGES=1
)
if exist temp_status.txt del /f /q temp_status.txt > nul 2>&1

if !HAS_CHANGES!==0 (
    echo [INFO] No hay cambios nuevos para subir.
    echo.
    goto END
)

REM 3. Anadir archivos al staging
echo [1/3] Preparando archivos modificados (git add .)...
git add .
if errorlevel 1 (
    echo.
    echo =======================================================
    echo ERROR: No se pudieron preparar los archivos para Git.
    echo =======================================================
    goto END
)

REM 4. Crear commit con fecha y hora actual
echo [2/3] Creando commit automatico...
git commit -m "Actualizacion automatica: %date% %time%"
if errorlevel 1 (
    echo.
    echo [INFO] No se requirio commit adicional.
)

REM 5. Subir cambios a GitHub (git push origin main)
echo [3/3] Subiendo cambios a GitHub (git push origin main)...
git push origin main
if errorlevel 1 (
    echo.
    echo =======================================================
    echo ERROR: No se pudo subir el proyecto a GitHub.
    echo =======================================================
    goto END
)

echo.
echo =======================================================
echo EXITO! El proyecto se ha actualizado en GitHub.
echo Repositorio: https://github.com/LuisLs26/invitaciones.git
echo Rama: main
echo =======================================================

:END
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
