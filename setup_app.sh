#!/usr/bin/env bash

# Lo script seguente è progettato per inizializzare un'app PWA con React e Vite utilizzando il database Supabase indicato.

set -e

# BLOCCO DI SICUREZZA OBBLIGATORIO
echo "⚠️  ATTENZIONE: questa operazione CANCELLERÀ TUTTI I FILE del repository."
echo

if [ ! -d ".git" ]; then
    echo "❌ Errore: questa directory NON è un repository Git."
    exit 1
fi

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

echo "✅ Conferma corretta. Inizio procedura di reset..." #

# Eliminazione di tutti i file tranne .git e .gitignore
find . -maxdepth 1 ! -name '.git' ! -name '.gitignore' ! -name '.' -exec rm -rf {} +

# Inizializzazione progetto Vite + React (JavaScript)
cat <<EOF > package.json
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
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.10",
    "vite-plugin-pwa": "^0.17.4"
  }
}
EOF

# Creazione struttura cartelle
mkdir -p src/{auth,pages,components,layout,services,tracking,ads,utils} public

# Configurazione Variabili d'Ambiente
cat <<EOF > .env.example
VITE_SUPABASE_URL=https://jamttxwhexlvbkjccrqm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs
EOF

cp .env.example .env

# Configurazione Vite con supporto PWA
cat <<EOF > vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CareAutoPro',
        short_name: 'CareAuto',
        description: 'Gestione veicoli e tracking GPS privacy-first',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
EOF

# Servizio Supabase
cat <<EOF > src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
EOF

# Layout simile ad AppSheet con Bottom Navigation
cat <<EOF > src/layout/MainLayout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Car, MapPin, Settings, LayoutDashboard } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-blue-600">
          <LayoutDashboard size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => navigate('/vehicles')} className="flex flex-col items-center text-gray-500">
          <Car size={24} />
          <span className="text-xs">Veicoli</span>
        </button>
        <button onClick={() => navigate('/tracking')} className="flex flex-col items-center text-gray-500">
          <MapPin size={24} />
          <span className="text-xs">Tracking</span>
        </button>
        <button onClick={() => navigate('/settings')} className="flex flex-col items-center text-gray-500">
          <Settings size={24} />
          <span className="text-xs">Opzioni</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;
EOF

# Logica Tracking GPS (Privacy-First)
cat <<EOF > src/tracking/GPSManager.jsx
import { supabase } from '../services/supabase';

export const startTracking = async (userId, vehicleId, config) => {
  // Verifica consenso utenti.abilitagps
  const { data: user } = await supabase.from('utenti').select('abilitagps').eq('utente_id', userId).single();
  
  if (!user?.abilitagps) {
    alert("Consenso GPS non fornito nelle impostazioni.");
    return;
  }

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(async (pos) => {
      // Salvataggio dati senza luoghi (solo metadati per km)
      await supabase.from('trackinggps').insert([{
        sessione_id: config.sessione_id,
        latitude: pos.coords.latitude, // Necessarie per calcolo ma non per visualizzazione mappa percorso
        longitude: pos.coords.longitude,
        velocita: pos.coords.speed,
        precisione: pos.coords.accuracy,
        dataora: new Date().toISOString()
      }]);
    }, (err) => console.error(err), { enableHighAccuracy: true });
  }
};
EOF

# Pagina di Login (Social + Email)
cat <<EOF > src/pages/Login.jsx
import React from 'react';
import { supabase } from '../services/supabase';

const Login = () => {
  const handleSocialLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h1 className="text-2xl font-bold">CareAutoPro Login</h1>
      <button onClick={() => handleSocialLogin('google')} className="w-full max-w-xs bg-red-500 text-white p-3 rounded">Login con Google</button>
      <button onClick={() => handleSocialLogin('facebook')} className="w-full max-w-xs bg-blue-700 text-white p-3 rounded">Login con Facebook</button>
      <button onClick={() => handleSocialLogin('apple')} className="w-full max-w-xs bg-black text-white p-3 rounded">Login con Apple</button>
    </div>
  );
};

export default Login;
EOF

# Pagina Inserimento Veicoli
cat <<EOF > src/pages/Vehicles.jsx
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const Vehicles = () => {
  const [formData, setFormData] = useState({ nomeveicolo: '', targa: '', kmattuali: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('veicoli').insert([{ ...formData, utente_id: user.id }]);
    alert("Veicolo salvato!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Aggiungi Veicolo</h2>
      <input type="text" placeholder="Nome Veicolo" className="w-full p-2 border" onChange={e => setFormData({...formData, nomeveicolo: e.target.value})} />
      <input type="text" placeholder="Targa" className="w-full p-2 border" onChange={e => setFormData({...formData, targa: e.target.value})} />
      <input type="number" placeholder="KM Attuali" className="w-full p-2 border" onChange={e => setFormData({...formData, kmattuali: parseInt(e.target.value)})} />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Salva</button>
    </form>
  );
};

export default Vehicles;
EOF

# File App principale con Rotte
cat <<EOF > src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="vehicles" element={<Vehicles />} />
          <Route index element={<div>Dashboard CareAutoPro</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
EOF

# Creazione file entry point
cat <<EOF > src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Tailwind CSS Config
cat <<EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOF

cat <<EOF > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat <<EOF > index.html
<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareAutoPro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# Messaggio finale
echo "✅ Progetto inizializzato con successo."
echo "👉 Eseguire 'npm install' per installare le dipendenze."
echo "👉 Configurare il file .env con le chiavi reali se diverse da quelle fornite."
