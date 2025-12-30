@echo off
echo 🚀 Starting FlowFi setup...

echo 📦 Updating icons and splash screen...
call node update-assets.js
if %errorlevel% neq 0 (
    echo ❌ Failed to update assets
    pause
    exit /b %errorlevel%
)

echo 🔄 Building web app and syncing with Android...
call npm run android:sync
if %errorlevel% neq 0 (
    echo ❌ Failed to sync
    pause
    exit /b %errorlevel%
)

echo 📱 Launching on Android device/emulator...
call npm run android:run
if %errorlevel% neq 0 (
    echo ❌ Failed to run on Android
    pause
    exit /b %errorlevel%
)

echo ✅ Done!
pause
