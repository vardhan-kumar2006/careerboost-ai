@echo off
title CareerBoost AI - Local Server
color 0A
echo.
echo  ================================================
echo    CareerBoost AI - Starting Local Server
echo  ================================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%i
    goto :found
)
:found
set IP=%IP: =%

echo  Your app will be available at:
echo.
echo    On THIS computer:   http://localhost:8080
echo    On MOBILE / others: http://%IP%:8080
echo.
echo  ------------------------------------------------
echo  HOW TO OPEN ON MOBILE:
echo    1. Connect your phone to the SAME WiFi
echo    2. Open Chrome on phone
echo    3. Type:  http://%IP%:8080
echo    4. Bookmark it!
echo  ------------------------------------------------
echo.
echo  Press Ctrl+C to stop the server
echo.

REM Try Python 3 first, then Python 2
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Starting Python server...
    python -m http.server 8080
) else (
    python3 --version >nul 2>&1
    if %errorlevel% == 0 (
        python3 -m http.server 8080
    ) else (
        echo  Python not found! Trying Node.js...
        npx serve -p 8080 .
    )
)

pause
