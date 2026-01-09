#!/usr/bin/env bash
set -e

echo "⚠️  ATTENZIONE: questa operazione CANCELLERÀ TUTTI I FILE del repository."
echo

# BLOCCO DI SICUREZZA — NON RIMUOVERE

# Verifica che siamo in un repository git
if [ ! -d ".git" ]; then
  echo "❌ Errore: questa directory NON è un repository Git."
  exit 1
fi

# Recupera nome repository
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")

echo "📦 Repository rilevato: $REPO_NAME"
echo
echo "👉 Questa operazione è IRREVERSIBILE."
echo "👉 Tutti i file verranno eliminati (eccetto .git)."
echo
echo "Per continuare digita ESATTAMENTE il nome del repository:"
echo "➡️  $REPO_NAME"
echo

read -r CONFIRMATION

if [ "$CONFIRMATION" != "$REPO_NAME" ]; then
  echo "❌ Conferma non valida. Operazione ANNULLATA."
  exit 1
fi

echo
echo "✅ Conferma corretta. Inizio procedura di reset..."
echo

# Pulizia repository (mantenendo .git e .gitignore)
echo "🧹 Pulizia repository..."
find . -maxdepth 1 ! -name '.' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} + 2>/dev/null || true

# Inizializzazione progetto Vite + React
echo "🚀 Inizializzazione progetto Vite + React..."
npm create vite@latest . -- --template react 2>/dev/null || npm create vite@latest . --template react

# Installazione dipendenze base
echo "📦 Installazione dipendenze..."
npm install

# Installazione dipendenze aggiuntive
echo "📦 Installazione dipendenze Supabase e PWA..."
npm install @supabase/supabase-js \
  workbox-core workbox-routing workbox-strategies workbox-precaching workbox-window \
  @tailwindcss/postcss tailwindcss postcss autoprefixer \
  lucide-react

# Creazione struttura directory
echo "📁 Creazione struttura directory..."
mkdir -p src/{auth,pages,components,layout,services,tracking,ads,utils}
mkdir -p public

# Creazione package.json con configurazione PWA
cat > package.json << 'EOF'
{
  "name": "gps-tracker-pwa",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.7",
    "lucide-react": "^0.344.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "workbox-core": "^7.0.0",
    "workbox-precaching": "^7.0.0",
    "workbox-routing": "^7.0.0",
    "workbox-strategies": "^7.0.0",
    "workbox-window": "^7.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.4"
  }
}
EOF

# Creazione vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'GPS Tracker PWA',
        short_name: 'GPS Tracker',
        description: 'Privacy-first GPS Tracking Application',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
EOF

# Creazione tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Creazione postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOF

# Creazione .env.example
cat > .env.example << 'EOF'
VITE_SUPABASE_URL=https://jamttxwhexlvbkjccrqm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDBs
EOF

# Creazione public/manifest.json
cat > public/manifest.json << 'EOF'
{
  "name": "GPS Tracker PWA",
  "short_name": "GPS Tracker",
  "description": "Privacy-first GPS Tracking Application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Creazione public/service-worker.js
cat > public/service-worker.js << 'EOF'
const CACHE_NAME = 'gps-tracker-v1';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
EOF

# Creazione src/main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Creazione src/App.jsx
cat > src/App.jsx << 'EOF'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SupabaseProvider } from './services/supabase.js'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import VehicleSelect from './pages/VehicleSelect.jsx'
import MainLayout from './layout/MainLayout.jsx'

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<VehicleSelect />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </SupabaseProvider>
  )
}

export default App
EOF

# Creazione src/index.css
cat > src/index.css << 'EOF'
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF

# Creazione src/services/supabase.js
cat > src/services/supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const SupabaseContext = createContext()

export const SupabaseProvider = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  return useContext(SupabaseContext)
}
EOF

# Creazione src/auth/AuthContext.jsx
cat > src/auth/AuthContext.jsx << 'EOF'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSupabase } from '../services/supabase.js'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const supabase = useSupabase()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signInWithOAuth = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signInWithEmail,
      signInWithOAuth,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
EOF

# Creazione src/auth/ProtectedRoute.jsx
cat > src/auth/ProtectedRoute.jsx << 'EOF'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Caricamento...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
EOF

# Creazione src/pages/Login.jsx
cat > src/pages/Login.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { Car, Lock, Mail, Shield } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signInWithEmail, signUp, signInWithOAuth } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (!error) {
        alert('Controlla la tua email per confermare la registrazione')
      }
    } else {
      const { error } = await signInWithEmail(email, password)
      if (!error) {
        navigate('/dashboard')
      }
    }
  }

  const handleOAuth = async (provider) => {
    const { error } = await signInWithOAuth(provider)
    if (!error) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">GPS Tracker</h1>
          <p className="text-gray-600 mt-2">Monitora i tuoi veicoli in tempo reale</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {isSignUp ? 'Registrati' : 'Accedi'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-blue-600 hover:text-blue-800"
          >
            {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Oppure accedi con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth('google')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Shield className="w-5 h-5 mr-2" />
              Google
            </button>
            <button
              onClick={() => handleOAuth('facebook')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Shield className="w-5 h-5 mr-2" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
EOF

# Creazione src/pages/Dashboard.jsx
cat > src/pages/Dashboard.jsx << 'EOF'
import { useState, useEffect } from 'react'
import { useSupabase } from '../services/supabase.js'
import { useAuth } from '../auth/AuthContext.jsx'
import { Navigation } from '../components/Navigation.jsx'
import { MapPin, Navigation as NavIcon, AlertCircle, Battery, Wifi } from 'lucide-react'

const Dashboard = () => {
  const supabase = useSupabase()
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [trackingData, setTrackingData] = useState(null)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (user) {
      loadVehicles()
    }
  }, [user])

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from('veicoli')
      .select('*')
      .eq('utente_id', user.id)

    if (!error && data.length > 0) {
      setVehicles(data)
    }
  }

  const startTracking = async () => {
    if (!user) return

    const { data: userSettings } = await supabase
      .from('utenti')
      .select('abilitagps')
      .eq('utente_id', user.id)
      .single()

    if (!userSettings?.abilitagps) {
      alert('Abilita il GPS nelle impostazioni prima di iniziare il tracking')
      return
    }

    setIsTracking(true)
    // Simula dati GPS
    const interval = setInterval(() => {
      setTrackingData({
        latitude: 45.4642 + (Math.random() - 0.5) * 0.01,
        longitude: 9.1900 + (Math.random() - 0.5) * 0.01,
        speed: Math.random() * 120,
        accuracy: 10 + Math.random() * 20
      })
    }, 3000)

    return () => clearInterval(interval)
  }

  const stopTracking = () => {
    setIsTracking(false)
    setTrackingData(null)
  }

  return (
    <div className="p-4">
      <Navigation title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <NavIcon className="w-6 h-6 mr-2 text-blue-600" />
            Tracking Attivo
          </h2>
          
          {isTracking ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stato</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Attivo
                </span>
              </div>
              
              {trackingData && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-700">
                      {trackingData.latitude.toFixed(4)}, {trackingData.longitude.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-700">Precisione: {trackingData.accuracy.toFixed(0)}m</span>
                  </div>
                  <div className="flex items-center">
                    <Battery className="w-5 h-5 mr-2 text-gray-400" />
                    <span className="text-gray-700">Velocità: {trackingData.speed.toFixed(0)} km/h</span>
                  </div>
                </div>
              )}

              <button
                onClick={stopTracking}
                className="w-full mt-4 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Stop Tracking
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">Nessun tracking attivo</p>
              <button
                onClick={startTracking}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Avvia Tracking
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">I Tuoi Veicoli</h2>
          
          {vehicles.length > 0 ? (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.veicolo_id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{vehicle.nomeveicolo}</h3>
                      <p className="text-sm text-gray-600">{vehicle.targa}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {vehicle.kmattuali} k
