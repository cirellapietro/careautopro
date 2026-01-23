#!/usr/bin/env bash
set -e

echo "🚨 CAREAUTOPRO – FORCE RESET WHITE SCREEN"

# 1. Disabilita qualsiasi PWA / Service Worker
echo "▶ Disabilito PWA / Service Worker"
rm -f public/sw.js
rm -f public/service-worker.js
rm -f src/sw.js
rm -f src/serviceWorker.js

# 2. Forza index.html pulito
echo "▶ Ripristino index.html safe"
cat <<'HTML' > index.html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>CareAutoPro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTML

# 3. Build pulita
echo "▶ Build pulita Vite"
rm -rf dist node_modules/.vite
npm install
npm run build

# 4. Commit + push (forza Vercel)
echo "▶ Commit e push"
git add .
git commit -m "fix: force reset white screen mobile" || true
git push origin main || true

echo ""
echo "✅ RESET COMPLETATO"
echo "📱 ORA FAI QUESTO SUL TELEFONO:"
echo "1️⃣ Impostazioni browser → Cancella DATI SITO (non solo cache)"
echo "2️⃣ Chiudi browser"
echo "3️⃣ Riapri e vai su https://careautopro.vercel.app"
