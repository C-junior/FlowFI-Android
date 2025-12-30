import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, 'public', 'FlowFi.png');

if (!fs.existsSync(source)) {
    console.error(`Source file not found: ${source}`);
    process.exit(1);
}

const destinations = [
    // Splash screen
    'android/app/src/main/res/drawable/splash.png',
    
    // MDPI
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
    'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png',

    // HDPI
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
    'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png',

    // XHDPI
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png',

    // XXHDPI
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png',

    // XXXHDPI
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png',
];

console.log('Updating Android assets with FlowFi.png...');

destinations.forEach(dest => {
    const destPath = path.join(__dirname, dest);
    const destDir = path.dirname(destPath);
    
    if (fs.existsSync(destDir)) {
        try {
            fs.copyFileSync(source, destPath);
            console.log(`✅ Updated: ${dest}`);
        } catch (e) {
            console.error(`❌ Error updating ${dest}:`, e.message);
        }
    } else {
        console.warn(`⚠️ Directory does not exist, skipping: ${destDir}`);
    }
});

console.log('\nAssets update complete.');
