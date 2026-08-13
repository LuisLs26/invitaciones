@echo off
setlocal

title Invitaciones - Editor
cd /d "%~dp0"

set "PUERTO=8080"
set "URL=http://127.0.0.1:%PUERTO%/editor/?id=demo&v=20260812-4"

echo.
echo  Iniciando Invitaciones...
echo  Editor: %URL%
echo.

where py.exe >nul 2>&1
if %errorlevel%==0 goto iniciar_py

where python.exe >nul 2>&1
if %errorlevel%==0 goto iniciar_python

echo No se encontro Python en este equipo.
echo Instala Python y vuelve a ejecutar este archivo.
pause
exit /b 1

:iniciar_py
start "Servidor Invitaciones" /min "%ComSpec%" /c "py -m http.server %PUERTO%"
goto abrir_editor

:iniciar_python
start "Servidor Invitaciones" /min "%ComSpec%" /c "python -m http.server %PUERTO%"

:abrir_editor
timeout /t 2 /nobreak >nul
start "" "%URL%"

echo El editor se abrio en tu navegador.
echo Puedes cerrar esta ventana; el servidor seguira activo en segundo plano.
echo Para detener el servidor, cierra la ventana minimizada "Servidor Invitaciones".
timeout /t 3 /nobreak >nul
exit /b 0
