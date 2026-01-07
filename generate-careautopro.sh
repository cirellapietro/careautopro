#!/usr/bin/env bash
set -e

echo "🔥 Pulizia repository..."
find . -mindepth 1 \
  ! -path "./.git*" \
  ! -name "generate-careautopro.sh" \
  -exec rm -rf {} +

echo "📁 Creazione struttura..."
mkdir -p src public

# ---------------------------
# package.json
# ---------------------------
cat > package.json <<'EOF'
{
  "name": "careautopro-pwa",
  "private": true,
  "version": "1.0.0",
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

# ---------------------------
# vite.config.ts
# ---------------------------
cat > vite.config.ts <<'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true }
})
EOF

# ---------------------------
# index.html
# ---------------------------
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

# ---------------------------
# manifest.json
# ---------------------------
cat > public/manifest.json <<'EOF'
{
  "name": "CareAutoPro",
  "short_name": "CareAutoPro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2"
}
EOF

# ---------------------------
# supabase.ts
# ---------------------------
cat > src/supabase.ts <<'EOF'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)
EOF

# ---------------------------
# gps.ts
# ---------------------------
cat > src/gps.ts <<'EOF'
let watchId: number | null = null
let last: GeolocationPosition | null = null
let km = 0

function haversine(a: GeolocationPosition, b: GeolocationPosition) {
  const R = 6371
  const dLat = (b.coords.latitude - a.coords.latitude) * Math.PI / 180
  const dLon = (b.coords.longitude - a.coords.longitude) * Math.PI / 180
  const lat1 = a.coords.latitude * Math.PI / 180
  const lat2 = b.coords.latitude * Math.PI / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function startAuto(cb: (k: number) => void) {
  watchId = navigator.geolocation.watchPosition(pos => {
    if (last) {
      km += haversine(last, pos)
      cb(Number(km.toFixed(3)))
    }
    last = pos
  }, err => alert(err.message), { enableHighAccuracy: true })
}

export function stopAuto() {
  if (watchId) navigator.geolocation.clearWatch(watchId)
  watchId = null
  last = null
  km = 0
}
EOF

# ---------------------------
# styles.css
# ---------------------------
cat > src/styles.css <<'EOF'
body {
  margin:0;
  font-family: system-ui, sans-serif;
  background:#f5f5f5;
}
header {
  background:#1976d2;
  color:white;
  padding:1rem;
  text-align:center;
}
main {
  padding:1rem;
}
select, button {
  width:100%;
  padding:1rem;
  margin:0.5rem 0;
  font-size:1rem;
}
.card {
  background:white;
  padding:1rem;
  margin:0.5rem 0;
  border-radius:6px;
}
EOF

# ---------------------------
# App.tsx
# ---------------------------
cat > src/App.tsx <<'EOF'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { startAuto, stopAuto } from './gps'
import './styles.css'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [veicoli, setVeicoli] = useState<any[]>([])
  const [veicolo, setVeicolo] = useState<any>(null)
  const [km, setKm] = useState(0)
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from('veicoli')
      .select('*')
      .eq('utente_id', user.id)
      .then(r => {
        const list = r.data || []
        setVeicoli(list)
        const principale = list.find(v => v.is_principale)
        if (principale) setVeicolo(principale)
      })
  }, [user])

  async function login(provider?: 'google' | 'facebook') {
    if (provider) {
      await supabase.auth.signInWithOAuth({ provider })
    } else {
      const email = prompt("Email")
      const password = prompt("Password")
      if (email && password)
        await supabase.auth.signInWithPassword({ email, password })
    }
  }

  async function setPrincipale(v:any) {
    await supabase
      .from('veicoli')
      .update({ is_principale: false })
      .eq('utente_id', user.id)

    await supabase
      .from('veicoli')
      .update({ is_principale: true })
      .eq('veicolo_id', v.veicolo_id)

    setVeicolo({ ...v, is_principale: true })
  }

  function start() {
    startAuto(setKm)
    setTracking(true)
  }

  function stop() {
    stopAuto()
    setTracking(false)
    setKm(0)
  }

  return (
    <>
      <header>CareAutoPro</header>
      <main>
        {!user && (
          <>
            <button onClick={()=>login()}>Login Email</button>
            <button onClick={()=>login('google')}>Login Google</button>
            <button onClick={()=>login('facebook')}>Login Facebook</button>
          </>
        )}

        {user && (
          <>
            <select
              value={veicolo?.veicolo_id || ''}
              onChange={e => {
                const v = veicoli.find(x => x.veicolo_id === e.target.value)
                setVeicolo(v)
              }}
            >
              <option value="">Seleziona veicolo</option>
              {veicoli.map(v => (
                <option key={v.veicolo_id} value={v.veicolo_id}>
                  {v.nomeveicolo} {v.is_principale ? '⭐' : ''}
                </option>
              ))}
            </select>

            {veicolo && !veicolo.is_principale && (
              <button onClick={()=>setPrincipale(veicolo)}>
                Imposta come veicolo principale
              </button>
            )}

            {veicolo && (
              <div className="card">
                <p>Km da GPS: {km}</p>
                {!tracking && <button onClick={start}>Tracking Automatico</button>}
                {tracking && <button onClick={stop}>Ferma Tracking</button>}
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
EOF

# ---------------------------
# main.tsx
# ---------------------------
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

# ---------------------------
# .gitignore
# ---------------------------
cat > .gitignore <<'EOF'
node_modules
dist
.env
EOF

echo "✅ Script CareAutoPro generato correttamente"
