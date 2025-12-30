import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, 'public', 'FlowFi.png');
const backgroundColor = '#1a1a2e'; // Matches capacitor.config.ts

if (!fs.existsSync(source)) {
    console.error(`Source file not found: ${source}`);
    process.exit(1);
}

console.log('Updating Android assets with FlowFi.png...');

// 1. Handle Splash Screen
const drawableDir = path.join(__dirname, 'android/app/src/main/res/drawable');
const splashPng = path.join(drawableDir, 'splash.png');
const splashLogo = path.join(drawableDir, 'splash_logo.png');
const splashXml = path.join(drawableDir, 'splash.xml');

// Ensure drawable dir exists
if (!fs.existsSync(drawableDir)) fs.mkdirSync(drawableDir, { recursive: true });

// Copy logo for splash
try {
    fs.copyFileSync(source, splashLogo);
    console.log(`✅ Created: ${splashLogo}`);
} catch (e) {
    console.error(`❌ Error creating splash logo: ${e.message}`);
}

// Create splash.xml
const splashXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="${backgroundColor}" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo" />
    </item>
</layer-list>`;

try {
    fs.writeFileSync(splashXml, splashXmlContent);
    console.log(`✅ Created: ${splashXml}`);
} catch (e) {
    console.error(`❌ Error creating splash xml: ${e.message}`);
}

// Remove old splash.png if it exists to avoid conflict
if (fs.existsSync(splashPng)) {
    try {
        fs.unlinkSync(splashPng);
        console.log(`🗑️ Removed old: ${splashPng}`);
    } catch (e) {
        console.error(`❌ Error removing old splash.png: ${e.message}`);
    }
}

// 2. Handle Icons
const iconDestinations = [
    'android/app/src/main/res/mipmap-mdpi',
    'android/app/src/main/res/mipmap-hdpi',
    'android/app/src/main/res/mipmap-xhdpi',
    'android/app/src/main/res/mipmap-xxhdpi',
    'android/app/src/main/res/mipmap-xxxhdpi',
];

iconDestinations.forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (fs.existsSync(fullDir)) {
        try {
            // Update ic_launcher.png
            fs.copyFileSync(source, path.join(fullDir, 'ic_launcher.png'));
            // Update ic_launcher_round.png
            fs.copyFileSync(source, path.join(fullDir, 'ic_launcher_round.png'));
            // Update ic_launcher_foreground.png
            fs.copyFileSync(source, path.join(fullDir, 'ic_launcher_foreground.png'));
            console.log(`✅ Updated icons in: ${dir}`);
        } catch (e) {
            console.error(`❌ Error updating icons in ${dir}: ${e.message}`);
        }
    } else {
        console.warn(`⚠️ Directory not found: ${dir}`);
    }
});

console.log('\nAssets update complete.');
