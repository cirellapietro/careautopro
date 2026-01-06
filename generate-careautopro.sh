#!/usr/bin/env bash
set -e

echo "⚠️  Pulizia totale repository..."

# Cancella tutto tranne .git e questo script
find . -mindepth 1 \
  ! -path "./.git*" \
  ! -name "generate-careautopro.sh" \
  -exec rm -rf {} +

echo "📁 Creazione struttura directory..."
mkdir -p src public

echo "📦 package.json"
cat > package.json <<'EOF'
{
  "name": "careautopro-pwa",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
}
EOF

echo "⚙️ vite.config.ts"
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  }
})
EOF

echo "📄 index.html"
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CareAutoPro</title>
  <link rel="manifest" href="/manifest.json" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
EOF

echo "📄 public/manifest.json"
cat > public/manifest.json <<'EOF'
{
  "name": "CareAutoPro",
  "short_name": "CareAutoPro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": []
}
EOF

echo "🔐 src/supabase.ts"
cat > src/supabase.ts <<'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
EOF

echo "🛰️ src/gps.ts"
cat > src/gps.ts <<'EOF'
let watchId: number | null = null
let lastPosition: GeolocationPosition | null = null
let totalKm = 0

function distanceKm(a: GeolocationPosition, b: GeolocationPosition) {
  const R = 6371
  const dLat = (b.coords.latitude - a.coords.latitude) * Math.PI / 180
  const dLon = (b.coords.longitude - a.coords.longitude) * Math.PI / 180
  const lat1 = a.coords.latitude * Math.PI / 180
  const lat2 = b.coords.latitude * Math.PI / 180

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return 2 * R * Math.asin(Math.sqrt(x))
}

export function startAutoTracking(onUpdate: (km: number) => void) {
  if (!navigator.geolocation) {
    alert("GPS non supportato")
    return
  }

  watchId = navigator.geolocation.watchPosition(
    pos => {
      if (lastPosition) {
        totalKm += distanceKm(lastPosition, pos)
        onUpdate(Number(totalKm.toFixed(3)))
      }
      lastPosition = pos
    },
    err => alert(err.message),
    { enableHighAccuracy: true }
  )
}

export function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
    lastPosition = null
    totalKm = 0
  }
}
EOF

echo "🎨 src/styles.css"
cat > src/styles.css <<'EOF'
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
}

header {
  background: #1976d2;
  color: white;
  padding: 1rem;
  text-align: center;
}

main {
  padding: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  font-size: 1rem;
}
EOF

echo "🧠 src/App.tsx"
cat > src/App.tsx <<'EOF'
import { useState } from 'react'
import { supabase } from './supabase'
import { startAutoTracking, stopTracking } from './gps'
import './styles.css'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [km, setKm] = useState(0)
  const [tracking, setTracking] = useState(false)

  async function login() {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (data) setUser(data.user)
  }

  function start() {
    startAutoTracking(setKm)
    setTracking(true)
  }

  function stop() {
    stopTracking()
    setTracking(false)
    setKm(0)
  }

  return (
    <>
      <header>CareAutoPro</header>
      <main>
        {!user && <button onClick={login}>Accedi</button>}

        {user && (
          <>
            <p>Km percorsi: {km}</p>
            {!tracking && <button onClick={start}>Avvia Tracking Automatico</button>}
            {tracking && <button onClick={stop}>Ferma Tracking</button>}
          </>
        )}
      </main>
    </>
  )
}
EOF

echo "🚀 src/main.tsx"
cat > src/main.tsx <<'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOF

echo "🙈 .gitignore"
cat > .gitignore <<'EOF'
node_modules
dist
.env
EOF

echo "✅ Generazione completata"
echo "Ora esegui:"
echo "  npm install"
echo "  npm run dev"
