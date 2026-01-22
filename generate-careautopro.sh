#!/usr/bin/env bash
set -e

echo "🚗 CAREAUTOPRO – BOOTSTRAP & ANDROID BUILD"

echo "▶ Verifica Node e npm"
node -v
npm -v

echo "▶ Installazione dipendenze"
npm install

echo "▶ Verifica Capacitor"
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

echo "▶ Verifica capacitor.config.json"
if [ ! -f capacitor.config.json ]; then
cat <<'CFG' > capacitor.config.json
{
  "appId": "it.careautopro.app",
  "appName": "CareAutoPro",
  "webDir": "dist",
  "bundledWebRuntime": false
}
CFG
fi

echo "▶ Build web (Vite)"
npm run build

echo "▶ Inizializza Capacitor (se necessario)"
npx cap init CareAutoPro it.careautopro.app --web-dir=dist || true

echo "▶ Aggiunge piattaforma Android se mancante"
if [ ! -d android ]; then
  npx cap add android
fi

echo "▶ Sync Capacitor Android"
npx cap sync android

echo "▶ Generazione GitHub Action Android"
mkdir -p .github/workflows

cat <<'YML' > .github/workflows/android-build.yml
name: Android Build (APK)

on:
  push:
    branches: [ "main" ]

jobs:
  build-android:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build web
        run: npm run build

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Add Android platform (if missing)
        run: |
          if [ ! -d "android" ]; then
            npx cap add android
          fi

      - name: Sync Capacitor Android
        run: npx cap sync android

      - name: Build Debug APK
        run: cd android && ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: careautopro-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
YML

echo "▶ Commit e push"
git add .
git commit -m "ci: bootstrap android build careautopro" || true
git push origin main || true

echo ""
echo "✅ FATTO"
echo "📦 Ora vai su GitHub → Actions → scarica l'APK"
