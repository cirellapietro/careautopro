#!/usr/bin/env bash
set -e

echo "🚗 CAREAUTOPRO – BUILD ANDROID DEBUG"

echo "▶ Node:"
node -v

echo "▶ NPM:"
npm -v

echo "▶ Install dipendenze"
npm install

echo "▶ Capacitor (verifica)"
npx cap --version || npm install -D @capacitor/cli
npm list @capacitor/core || npm install @capacitor/core @capacitor/android

echo "▶ Build Vite"
npm run build

echo "▶ Aggiunta piattaforma Android (se manca)"
if [ ! -d "android" ]; then
  npx cap add android
fi

echo "▶ Sync Capacitor Android"
npx cap sync android

echo "▶ Forza Java 17 (compatibile Gradle/Capacitor)"
export JAVA_HOME=/usr/lib/jvm/temurin-17-jdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
java -version

echo "▶ Build APK Debug"
cd android
chmod +x gradlew
./gradlew assembleDebug

echo "✅ BUILD COMPLETATA"
echo "📦 APK: android/app/build/outputs/apk/debug/app-debug.apk"
