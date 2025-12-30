# FlowFI Android App Guide

This guide explains how to build and run the FlowFI Android application.

## Prerequisites

Before building the Android app, make sure you have:

1. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
2. **Java Development Kit (JDK)** - Version 17 or higher (included with Android Studio)
3. **Android SDK** - Install via Android Studio SDK Manager
4. **Android Emulator** or a physical Android device

### Environment Variables (Windows)

Make sure these environment variables are set:
- `ANDROID_HOME` → Your Android SDK path (usually `C:\Users\<username>\AppData\Local\Android\Sdk`)
- Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run android:sync` | Build web app and sync to Android |
| `npm run android:build` | Build the debug APK |
| `npm run android:open` | Open project in Android Studio |
| `npm run android:run` | Run on connected device/emulator |

## Quick Start

### Option 1: Using Android Studio (Recommended)

1. **Open the project in Android Studio:**
   ```bash
   npm run android:open
   ```

2. **Wait for Gradle sync** to complete (first time takes a few minutes)

3. **Run the app:**
   - Click the green ▶️ play button
   - Select an emulator or connected device

### Option 2: Using Command Line

1. **Build and sync:**
   ```bash
   npm run android:sync
   ```

2. **Run on device/emulator:**
   ```bash
   npm run android:run
   ```

## Building a Release APK

### 1. Generate a Keystore (First time only)

```bash
cd android/app
keytool -genkey -v -keystore flowfi-release.keystore -alias flowfi -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

Edit `android/app/build.gradle` and add signing config, or update `capacitor.config.ts`:

```typescript
android: {
  buildOptions: {
    keystorePath: 'android/app/flowfi-release.keystore',
    keystorePassword: 'your-password',
    keystoreAlias: 'flowfi',
    keystoreAliasPassword: 'your-password',
  }
}
```

### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/public/     # Your Vue app (auto-synced)
│   │       ├── java/              # Native Android code
│   │       └── res/               # Android resources (icons, splash)
│   └── build.gradle               # App-level build config
├── build.gradle                   # Project-level build config
└── gradle/                        # Gradle wrapper
```

## Customizing the App

### App Icon

Replace the icons in `android/app/src/main/res/`:
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

Or use Android Studio's **Image Asset Studio** (right-click on `res` → New → Image Asset)

### Splash Screen

Update `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#1a1a2e",
    showSpinner: true,
    spinnerColor: "#ffffff"
  }
}
```

## Adding Native Features

Install Capacitor plugins for native functionality:

```bash
# Camera
npm install @capacitor/camera

# Geolocation
npm install @capacitor/geolocation

# Push Notifications
npm install @capacitor/push-notifications

# Haptics (vibration)
npm install @capacitor/haptics

# Status Bar
npm install @capacitor/status-bar
```

After installing plugins, run:
```bash
npm run android:sync
```

## Troubleshooting

### Gradle Build Fails
- Make sure Android Studio and SDK are properly installed
- Try: `cd android && ./gradlew clean`

### App Crashes on Launch
- Check `adb logcat` for errors
- Make sure all native plugins are synced

### White Screen
- Run `npm run build` and then `npx cap sync android`
- Clear app data on device

### Cannot Connect to Firebase
- Add `google-services.json` to `android/app/`
- Download from Firebase Console → Project Settings → Android app

## Development Workflow

1. Make changes to your Vue.js code
2. Run `npm run android:sync` to sync changes
3. Run `npm run android:run` or use Android Studio to test

For live reload during development, you can use:
```bash
npx cap run android --livereload --external
```

This will enable hot reload on your device (requires device and computer on same network).
