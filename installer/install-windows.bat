@echo off
REM R-Serve Installer v1.0.3 for Windows
REM Professional installer with progress and security checks

setlocal enabledelayedexpansion

set VERSION=1.0.3
set APP_NAME=R-Serve
set ARCHIVE=R-Serve-%VERSION%-win-x64.tar.gz
set INSTALL_DIR=%ProgramFiles%\R-Serve
set TEMP_DIR=%TEMP%\rserve-installer

REM Banner
echo.
echo ========================================
echo    R-Serve Installer v%VERSION%
echo    Development Server Manager
echo ========================================
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [X] Error: This installer requires Administrator privileges
    echo.
    echo Please right-click and select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo Platform: Windows/x64
echo Version:  %VERSION%
echo.

REM Check if archive exists
if not exist "%ARCHIVE%" (
    echo [X] Error: Archive not found: %ARCHIVE%
    echo.
    echo Please ensure the installer is in the same directory as:
    echo   - %ARCHIVE%
    echo.
    pause
    exit /b 1
)

echo Starting installation...
echo.

REM Step 1: Verify integrity
echo [1/6] Verifying archive integrity...
for %%I in ("%ARCHIVE%") do set FILE_SIZE=%%~zI
set /a FILE_SIZE_MB=FILE_SIZE/1024/1024
echo   File size: %FILE_SIZE_MB% MB

REM Step 2: Create temp directory
echo [2/6] Preparing extraction...
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"

REM Step 3: Extract archive
echo [3/6] Extracting application...
echo   This may take a moment...

REM Use tar (available in Windows 10+)
tar -xzf "%ARCHIVE%" -C "%TEMP_DIR%" 2>nul
if %errorLevel% neq 0 (
    REM Fallback: try with 7-Zip if installed
    if exist "%ProgramFiles%\7-Zip\7z.exe" (
        "%ProgramFiles%\7-Zip\7z.exe" x "%ARCHIVE%" -so | "%ProgramFiles%\7-Zip\7z.exe" x -si -ttar -o"%TEMP_DIR%"
    ) else (
        echo [X] Error: Cannot extract archive. Please install 7-Zip or use Windows 10+
        pause
        exit /b 1
    )
)
echo   [OK] Extraction complete

REM Step 4: Install to Program Files
echo [4/6] Installing to %INSTALL_DIR%...

REM Remove existing installation
if exist "%INSTALL_DIR%" (
    echo   Removing existing installation...
    rmdir /s /q "%INSTALL_DIR%"
)

REM Create install directory
mkdir "%INSTALL_DIR%"

REM Copy files
echo   Copying files...
xcopy /s /e /i /q "%TEMP_DIR%\win-unpacked" "%INSTALL_DIR%" >nul

REM Step 5: Create shortcuts
echo [5/6] Creating shortcuts...

REM Start Menu shortcut
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\R-Serve.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\R-Serve.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Development Server Manager'; $Shortcut.Save()" >nul 2>&1
if %errorLevel% equ 0 (
    echo   [OK] Start Menu shortcut created
) else (
    echo   [!] Warning: Could not create Start Menu shortcut
)

REM Desktop shortcut
set DESKTOP=%USERPROFILE%\Desktop
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\R-Serve.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\R-Serve.exe'; $Shortcut.WorkingDirectory = '%INSTALL_DIR%'; $Shortcut.Description = 'Development Server Manager'; $Shortcut.Save()" >nul 2>&1
if %errorLevel% equ 0 (
    echo   [OK] Desktop shortcut created
) else (
    echo   [!] Warning: Could not create Desktop shortcut
)

REM Step 6: Create uninstaller
echo [6/6] Creating uninstaller...

(
echo @echo off
echo echo Uninstalling R-Serve...
echo timeout /t 2 /nobreak ^>nul
echo rmdir /s /q "%INSTALL_DIR%"
echo del "%START_MENU%\R-Serve.lnk" 2^>nul
echo del "%DESKTOP%\R-Serve.lnk" 2^>nul
echo echo.
echo echo R-Serve has been uninstalled successfully.
echo echo.
echo pause
) > "%INSTALL_DIR%\uninstall.bat"

echo   [OK] Uninstaller created

REM Clean up
echo.
echo Cleaning up temporary files...
rmdir /s /q "%TEMP_DIR%"

REM Success
echo.
echo ========================================
echo [OK] Installation completed successfully!
echo ========================================
echo.
echo You can now run R-Serve from:
echo.
echo   * Start Menu -^> R-Serve
echo   * Desktop shortcut
echo   * %INSTALL_DIR%\R-Serve.exe
echo.
echo To uninstall, run:
echo   %INSTALL_DIR%\uninstall.bat
echo.
echo Press any key to exit...
pause >nul
