#!/bin/bash

# 1. Creazione file .env con i tuoi dati reali
cat <<'EOT' > .env
GEMINI_API_KEY=AiZaSyA8EwPnJ98V4C6d71b5faUjjOtc_dBJoQA
GOOGLE_GENAI_API_KEY=AiZaSyA8EwPnJ98V4C6d71b5faUjjOtc_dBJoQA
NEXT_PUBLIC_ADSENSE_CLIENT_ID=pub-5545202856432487
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-5545202856432487~6559129595
NEXT_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-5545202856432487~6559129595
NEXT_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-5545202856432487/6105304673
NEXT_PUBLIC_AD_UNIT_ID_BANNER=ca-app-pub-5545202856432487/6105304673
EOT

echo "✅ .env creato."

# 2. Configurazione Git per risolvere i conflitti (Rebase)
git config pull.rebase true

# 3. Tentativo di sincronizzazione
echo "🔄 Sincronizzazione con GitHub..."
git add .
git commit -m "Fix: Allineamento AdMob e ambiente"
git pull origin main --no-edit
git push origin main

echo "✨ Termux è ora allineato con GitHub!"
