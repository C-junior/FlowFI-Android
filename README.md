# FlowFI Android

A native Android app for FlowFI - Your Personal Finance Manager.

Built with Vue.js + Capacitor for a native mobile experience.

## Features

- 📊 **Expense Tracking** - Track your daily expenses
- 💰 **Budget Management** - Set and manage budgets
- 📷 **Camera Support** - Capture receipts and documents
- 🔥 **Firebase Integration** - Real-time data sync
- 📈 **Charts & Analytics** - Visualize your spending

## Getting Started

### Prerequisites

- Node.js 20+
- Android Studio (with Android SDK)
- A physical Android device or emulator

### Installation

```bash
# Install dependencies
npm install

# Build and sync to Android
npm run android:sync

# Open in Android Studio
npm run android:open
```

### Run on Device

```bash
# Run on connected device/emulator
npm run android:run
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web development server |
| `npm run build` | Build for production |
| `npm run android:sync` | Build & sync to Android |
| `npm run android:open` | Open in Android Studio |
| `npm run android:run` | Run on device/emulator |
| `npm run android:build` | Build debug APK |

## Project Structure

```
├── src/                    # Vue.js source code
├── android/                # Native Android project
│   ├── app/               # Android app module
│   └── gradle/            # Gradle wrapper
├── dist/                   # Built web assets
└── capacitor.config.ts     # Capacitor configuration
```

## Building APK

### Debug Build

```bash
cd android
./gradlew assembleDebug
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build

1. Generate a keystore (first time only)
2. Configure signing in `android/app/build.gradle`
3. Run `./gradlew assembleRelease`

## Using Camera

The app includes camera support via `@capacitor/camera`. Example usage in Vue:

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  
  // Use image.webPath to display the photo
};
```

## Tech Stack

- **Frontend**: Vue 3 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Pinia
- **Backend**: Firebase
- **Charts**: Chart.js
- **Native**: Capacitor

## License

MIT License
