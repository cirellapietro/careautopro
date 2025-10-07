import os
import shutil
import requests

class RepositoryCleaner:
    def __init__(self, repo_path):
        self.repo_path = repo_path
        self.adsense_id = "ca-pub-5545202856432487"
        
    def cleanup_structure(self):
        """Pulisce tutta la struttura del progetto"""
        print("🧹 Iniziando pulizia repository...")
        
        # === FILE DA ELIMINARE ===
        files_to_delete = [
            # File duplicati/obsoleti
            'src/App.tsx',
            'src/main.tsx', 
            'src/App.css',
            'src/vite-env.d.ts',
            
            # File di configurazione obsoleti
            'vite.config.ts',
            'tsconfig.json',
            'tsconfig.node.json',
            
            # File di test/development
            'eslint.config.js',
            'postcss.config.js',
            'tailwind.config.ts',
            
            # File temporanei/log
            '.eslintrc.cjs',
            'jest.config.js',
            'playwright.config.ts'
        ]
        
        # === CARTELLE DA ELIMINARE ===
        folders_to_delete = [
            'src/component',           # Vuota/nome sbagliato
            'src/integrations',        # Vecchia struttura
            'src/hooks',               # Vuota
            'src/pages',               # Vecchia struttura
            '.angular',                # Cache Angular
            'dist-ssr',                # Build obsoleta
            '.vscode',                 # Config editor
            'coverage',                # Test coverage
            'playwright-report',       # Test reports
            'test-results'             # Test results
        ]
        
        # Elimina file
        for file_path in files_to_delete:
            self.safe_delete(file_path)
            
        # Elimina cartelle
        for folder_path in folders_to_delete:
            self.safe_delete_folder(folder_path)
            
        print("✅ Pulizia file e cartelle completata!")
        
    def safe_delete(self, file_path):
        """Elimina file in modo sicuro"""
        full_path = os.path.join(self.repo_path, file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
            print(f"🗑️ Eliminato: {file_path}")
            
    def safe_delete_folder(self, folder_path):
        """Elimina cartella in modo sicuro"""
        full_path = os.path.join(self.repo_path, folder_path)
        if os.path.exists(full_path):
            shutil.rmtree(full_path)
            print(f"🗑️ Eliminata cartella: {folder_path}")
    
    def create_essential_files(self):
        """Crea i file essenziali mancanti"""
        print("📁 Creando file essenziali...")
        
        # === INDEX.CSS ===
        index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

/* Stili AdMob/AdSense */
.ad-container {
  margin: 1rem 0;
  text-align: center;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.ad-banner {
  width: 100%;
  max-width: 728px;
  margin: 0 auto;
}

.ad-responsive {
  width: 100%;
  height: auto;
}

/* Stili GPS Tracking */
.gps-active {
  background: #dcfce7 !important;
  border-color: #22c55e !important;
}

.gps-stats {
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.gps-distance {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0369a1;
}

.gps-time {
  color: #64748b;
  font-size: 0.9rem;
}
"""
        self.write_file('src/index.css', index_css)
        
        # === VITE.CONFIG.JS (aggiornato) ===
        vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CareAutoPro',
        short_name: 'CareAutoPro',
        description: 'Gestione veicoli e manutenzioni con tracking GPS',
        theme_color: '#2563eb',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Configurazione per app mobile
        runtimeCaching: [
          {
            urlPattern: /^https:\\/\\/pagead2\\.googlesyndication\\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ads-cache'
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  },
  build: {
    // Configurazione per AdSense compatibilità
    target: 'es2015'
  }
})
"""
        self.write_file('vite.config.js', vite_config)
        
        # === TAILWIND.CONFIG.JS ===
        tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        success: '#22c55e',
      }
    },
  },
  plugins: [],
}
"""
        self.write_file('tailwind.config.js', tailwind_config)
        
        print("✅ File essenziali creati!")

    def write_file(self, file_path, content):
        """Scrive un file"""
        full_path = os.path.join(self.repo_path, file_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"📄 Creato: {file_path}")

    def update_package_json(self):
        """Aggiorna package.json per AdMob/AdSense"""
        print("📦 Aggiornando package.json...")
        
        package_path = os.path.join(self.repo_path, 'package.json')
        if os.path.exists(package_path):
            with open(package_path, 'r', encoding='utf-8') as f:
                package_data = f.read()
            
            # Rimuove dipendenze TypeScript non necessarie
            package_data = package_data.replace('"typescript":', '"//typescript":')
            package_data = package_data.replace('"@types/react":', '"//@types/react":')
            package_data = package_data.replace('"@types/react-dom":', '"//@types/react-dom":')
            
            with open(package_path, 'w', encoding='utf-8') as f:
                f.write(package_data)
            print("✅ package.json aggiornato!")

    def add_ad_components(self):
        """Aggiunge componenti per AdMob/AdSense"""
        print("🤑 Aggiungendo componenti ads...")
        
        # === COMPONENTE ADSENSE ===
        adsense_component = f"""import React, {{ useEffect }} from 'react'

const AdSenseBanner = ({{ slot, format = 'auto', responsive = true }}) => {{
  useEffect(() => {{
    // Carica AdSense script
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={self.adsense_id}'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    // Inizializza ads
    try {{
      if (window.adsbygoogle) {{
        window.adsbygoogle.push({{}})
      }}
    }} catch (error) {{
      console.log('AdSense init error:', error)
    }}

    return () => {{
      // Cleanup
      document.head.removeChild(script)
    }}
  }}, [])

  return (
    <div className="ad-container">
      <ins 
        className="adsbygoogle ad-banner"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="{self.adsense_id}"
        data-ad-slot={{slot}}
        data-ad-format={{format}}
        data-full-width-responsive={{responsive.toString()}}
      />
    </div>
  )
}}

export default AdSenseBanner
"""
        self.write_file('src/components/AdSenseBanner.jsx', adsense_component)
        
        # === COMPONENTE ADMOB (per PWA) ===
        admob_component = """import React, { useEffect } from 'react'

const AdMobBanner = ({ adUnitId, size = 'BANNER' }) => {
  useEffect(() => {
    // Inizializza AdMob (per versione mobile/PWA)
    const initializeAds = async () => {
      if (window.admob) {
        try {
          await window.admob.start()
          const banner = new window.admob.BannerAd({
            adUnitId: adUnitId,
          })
          await banner.show()
        } catch (error) {
          console.log('AdMob error:', error)
        }
      }
    }

    initializeAds()
  }, [adUnitId])

  return (
    <div className="ad-container">
      <div id="admob-banner" className="ad-responsive"></div>
    </div>
  )
}

export default AdMobBanner
"""
        self.write_file('src/components/AdMobBanner.jsx', admob_component)
        
        print("✅ Componenti ads aggiunti!")

    def add_gps_tracking(self):
        """Aggiunge il sistema di tracking GPS"""
        print("📍 Aggiungendo tracking GPS...")
        
        # === CONTESTO GPS ===
        gps_context = """import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const GpsContext = createContext({})

export const useGps = () => useContext(GpsContext)

export const GpsProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTrip, setCurrentTrip] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [distance, setDistance] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [positions, setPositions] = useState([])

  // Calcola distanza tra due coordinate (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c // Distanza in km
  }

  const startTracking = async (vehicleId) => {
    if (!vehicleId) {
      alert('Seleziona un veicolo prima di iniziare il tracking')
      return
    }

    if (!navigator.geolocation) {
      alert('GPS non supportato dal tuo dispositivo')
      return
    }

    try {
      setIsTracking(true)
      setSelectedVehicle(vehicleId)
      setStartTime(new Date())
      setDistance(0)
      setPositions([])

      // Crea nuovo viaggio nel database
      const { data: trip, error } = await supabase
        .from('trips')
        .insert([
          { 
            vehicle_id: vehicleId,
            start_time: new Date().toISOString(),
            status: 'active'
          }
        ])
        .select()
        .single()

      if (error) throw error
      setCurrentTrip(trip)

      // Inizia tracking posizione
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newPosition = { latitude, longitude, timestamp: new Date() }
          
          setPositions(prev => {
            const newPositions = [...prev, newPosition]
            
            // Calcola distanza totale
            if (newPositions.length > 1) {
              const lastPos = newPositions[newPositions.length - 2]
              const segmentDistance = calculateDistance(
                lastPos.latitude, lastPos.longitude,
                latitude, longitude
              )
              setDistance(prev => prev + segmentDistance)
            }
            
            return newPositions
          })

          // Salva posizione nel database
          savePosition(trip.id, latitude, longitude)
        },
        (error) => {
          console.error('GPS error:', error)
          alert('Errore nel tracking GPS: ' + error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)

    } catch (error) {
      console.error('Start tracking error:', error)
      alert('Errore nell\\'avvio del tracking')
      setIsTracking(false)
    }
  }

  const stopTracking = async () => {
    if (!currentTrip) return

    try {
      setIsTracking(false)
      const endTime = new Date()
      const duration = Math.round((endTime - startTime) / 1000 / 60) // minuti

      // Aggiorna viaggio nel database
      const { error } = await supabase
        .from('trips')
        .update({
          end_time: endTime.toISOString(),
          duration_minutes: duration,
          distance_km: Math.round(distance * 100) / 100,
          status: 'completed'
        })
        .eq('id', currentTrip.id)

      if (error) throw error

      // Reset stato
      setCurrentTrip(null)
      setStartTime(null)
      setDistance(0)
      setPositions([])

      alert(`Viaggio completato! Distanza: ${distance.toFixed(2)} km, Durata: ${duration} min`)

    } catch (error) {
      console.error('Stop tracking error:', error)
      alert('Errore nella chiusura del tracking')
    }
  }

  const savePosition = async (tripId, lat, lng) => {
    try {
      await supabase
        .from('trip_positions')
        .insert([
          {
            trip_id: tripId,
            latitude: lat,
            longitude: lng,
            recorded_at: new Date().toISOString()
          }
        ])
    } catch (error) {
      console.error('Save position error:', error)
    }
  }

  const getTripTime = () => {
    if (!startTime) return '00:00:00'
    const now = new Date()
    const diff = Math.floor((now - startTime) / 1000)
    const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
    const seconds = (diff % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const value = {
    isTracking,
    currentTrip,
    selectedVehicle,
    distance,
    tripTime: getTripTime(),
    startTracking,
    stopTracking,
    setSelectedVehicle
  }

  return (
    <GpsContext.Provider value={value}>
      {children}
    </GpsContext.Provider>
  )
}
"""
        self.write_file('src/contexts/GpsContext.jsx', gps_context)
        
        # === COMPONENTE GPS TRACKING ===
        gps_component = """import React from 'react'
import { useGps } from '../contexts/GpsContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const GpsTracking = () => {
  const { 
    isTracking, 
    distance, 
    tripTime, 
    selectedVehicle, 
    setSelectedVehicle,
    startTracking, 
    stopTracking 
  } = useGps()
  
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [user])

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('veicoli')
        .select('*')
        .order('marca')

      if (error) throw error
      setVehicles(data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const handleStartTracking = async () => {
    setLoading(true)
    await startTracking(selectedVehicle)
    setLoading(false)
  }

  return (
    <div className="section">
      <h2 className="text-xl font-semibold mb-4">📍 Tracking GPS</h2>
      
      <div className={`p-4 rounded-lg mb-4 ${isTracking ? 'gps-active' : 'bg-gray-50'}`}>
        {!isTracking ? (
          <div>
            <label className="block text-sm font-medium mb-2">
              Seleziona Veicolo:
            </label>
            <select 
              value={selectedVehicle || ''}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            >
              <option value="">Scegli un veicolo</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.marca} {vehicle.modello} - {vehicle.targa}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleStartTracking}
              disabled={!selectedVehicle || loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Avvio...' : '🎯 Inizia Tracking'}
            </button>
          </div>
        ) : (
          <div className="gps-stats">
            <div className="text-center">
              <div className="gps-distance">{distance.toFixed(2)} km</div>
              <div className="gps-time">Tempo: {tripTime}</div>
              <div className="gps-time">Tracking attivo</div>
              
              <button
                onClick={stopTracking}
                className="mt-3 bg-red-600 text-white py-2 px-4 rounded"
              >
                ⏹️ Ferma Tracking
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AdSense Banner */}
      <AdSenseBanner slot="1234567890" />
    </div>
  )
}

export default GpsTracking
"""
        self.write_file('src/components/GpsTracking.jsx', gps_component)
        
        print("✅ Sistema GPS aggiunto!")

def main():
    # Configura il percorso del repository
    repo_path = input("Inserisci il percorso del repository locale: ").strip()
    
    if not os.path.exists(repo_path):
        print("❌ Percorso non valido!")
        return
    
    cleaner = RepositoryCleaner(repo_path)
    
    # Esegue la pulizia
    cleaner.cleanup_structure()
    cleaner.create_essential_files()
    cleaner.update_package_json()
    cleaner.add_ad_components()
    cleaner.add_gps_tracking()
    
    print("\\n🎉 PULIZIA E AGGIUNTE COMPLETATE!")
    print("📋 Cosa fare ora:")
    print("1. Configura le tabelle Supabase per i viaggi (vedi README)")
    print("2. git add . && git commit -m 'feat: add GPS tracking and ads'")
    print("3. git push origin stable")

if __name__ == "__main__":
    main()
