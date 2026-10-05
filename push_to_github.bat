@echo off
title Push to GitHub - Mrs. Cupcake
echo ========================================================
echo   Pushing code to GitHub: https://github.com/arnab0640/Cupcake.git
echo ========================================================
echo.

set "PATH=C:\Users\Arnab\AppData\Local\Programs\Git\cmd;C:\Users\Arnab\AppData\Local\Programs\Git\mingw64\bin;C:\Users\Arnab\AppData\Local\Programs\Git\usr\bin;%PATH%"

echo 1. Checking Git Status...
git status
echo.

echo 2. Staging all files...
git add .

echo.
echo 3. Committing changes...
git commit -m "Mrs. Cupcake - Birthday Tribute Website for Mrittica Didi"

echo.
echo 4. Pushing main branch to origin...
echo --------------------------------------------------------
echo NOTE: If a GitHub sign-in window appears, click 'Sign in with browser'.
echo --------------------------------------------------------
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 goto :success

echo.
echo ========================================================
echo Normal push was not authorized yet or branch differs.
echo Attempting push with force or personal token if provided:
echo ========================================================
echo.
set /p "GHTOKEN=Enter or paste your GitHub Token (or press Enter to exit): "

if "%GHTOKEN%"=="" goto :end

echo.
echo Pushing with provided token...
git push https://%GHTOKEN%@github.com/arnab0640/Cupcake.git main
if %ERRORLEVEL% EQU 0 goto :success

goto :end

:success
echo.
echo ========================================================
echo   SUCCESS! Code pushed to GitHub successfully!
echo   View online: https://github.com/arnab0640/Cupcake
echo ========================================================

:end
echo.
pause
