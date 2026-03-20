#!/bin/bash

# 1. Creazione del file .env con i tuoi dati reali
cat <<'EOT' > .env
GEMINI_API_KEY=AiZaSyA8EwPnJ98V4C6d71b5faUjjOtc_dBJoQA
GOOGLE_GENAI_API_KEY=AiZaSyA8EwPnJ98V4C6d71b5faUjjOtc_dBJoQA
NEXT_PUBLIC_ADSENSE_CLIENT_ID=pub-5545202856432487

# AdMob App ID (con tilde ~)
NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-5545202856432487~6559129595
NEXT_PUBLIC_ADMOB_APP_ID_ANDROID=ca-app-pub-5545202856432487~6559129595

# AdMob Banner ID (con slash /)
NEXT_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-5545202856432487/6105304673
NEXT_PUBLIC_AD_UNIT_ID_BANNER=ca-app-pub-5545202856432487/6105304673
EOT

echo "✅ File .env generato con successo."

# 2. Assicuriamoci che Git ignori il file .env per sicurezza
if ! grep -q ".env" .gitignore; then
  echo ".env" >> .gitignore
  echo "🔒 .env aggiunto al .gitignore."
fi

# 3. Push delle modifiche (escluso il file .env)
echo "🚀 Avvio del push su GitHub..."
git add .
git commit -m "Update: Configurazione AdMob e variabili d'ambiente"
git push origin main

echo "✨ Operazione completata!"
