#!/usr/bin/env python3
"""
Script SEMPLIFICATO per aggiornare careautopro esistente
"""

import os
import subprocess
import json

print("🔧 Aggiornamento progetto careautopro...")

# 1. Crea cartelle necessarie
folders = ["src/utils", "src/hooks", "src/context", "public/icons"]
for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"✅ Creata: {folder}")

# 2. Crea advancedSupabase.js
supabase_content = '''
// CONFIGURAZIONE SUPABASE AVANZATA
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const VEHICLE_TYPES = {
  CAR: { name: 'Auto', intervals: { oil: 15000, brakes: 30000 } },
  MOTORCYCLE: { name: 'Moto', intervals: { oil: 5000, chain: 1000 } },
  VAN: { name: 'Furgone', intervals: { oil: 10000, brakes: 25000 } }
}

export const advancedTracking = {
  getPlatform: () => {
    return (window.matchMedia('(display-mode: standalone)').matches) ? 'pwa' : 'web'
  },
  
  startTracking: async (vehicleId) => {
    const platform = advancedTracking.getPlatform()
    console.log("🚗 Tracking avviato su:", platform)
    
    return { id: 'mock-id', platform, vehicleId }
  },
  
  stopTracking: async (trackingId) => {
    console.log("🛑 Tracking fermato:", trackingId)
    return { success: true }
  }
}
'''

with open('src/utils/advancedSupabase.js', 'w') as f:
    f.write(supabase_content)
print("✅ advancedSupabase.js creato")

# 3. Crea NotificationManager
notification_content = '''
import React, { useState, useEffect } from 'react'
import "./Notifications.css"

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "🔧 Manutenzione Richiesta",
      message: "Controllo olio necessario per la tua auto",
      read: false,
      priority: "high"
    }
  ])

  return (
    <div className="notifications-panel">
      <h3>Avvisi Manutenzione</h3>
      <div className="notifications-list">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.priority} ${notif.read ? 'read' : 'unread'}`}>
            <h4>{notif.title}</h4>
            <p>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationManager
'''

with open('src/components/NotificationManager.jsx', 'w') as f:
    f.write(notification_content)
print("✅ NotificationManager.jsx creato")

# 4. Crea CSS notifiche
css_content = '''
.notifications-panel {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.notification {
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  border-left: 4px solid #ccc;
}

.notification.high {
  border-left-color: #dc3545;
  background: #f8d7da;
}

.notification.medium {
  border-left-color: #ffc107;
  background: #fff3cd;
}

.notification.unread {
  font-weight: bold;
}

.notification.read {
  opacity: 0.7;
}
'''

with open('src/components/Notifications.css', 'w') as f:
    f.write(css_content)
print("✅ Notifications.css creato")

# 5. Aggiorna package.json se necessario
try:
    with open('package.json', 'r') as f:
        package = json.load(f)
    
    # Aggiungi date-fns se non presente
    if 'date-fns' not in package.get('dependencies', {}):
        print("📦 Installazione date-fns...")
        subprocess.run("npm install date-fns", shell=True, check=True)
        
except Exception as e:
    print(f"ℹ️  Nota: {e}")

print("🎉 AGGIORNAMENTO COMPLETATO!")
print("")
print("📁 File creati:")
print("   • src/utils/advancedSupabase.js")
print("   • src/components/NotificationManager.jsx") 
print("   • src/components/Notifications.css")
print("")
print("🚀 Prossimi passi:")
print("   1. Integra NotificationManager nel tuo Dashboard")
print("   2. Usa advancedTracking per il GPS multi-piattaforma")
print("   3. Esegui supabase-schema-updates.sql nel database")
'''

with open('fix-project.py', 'w') as f:
    f.write(fix_script)

print("✅ Script fix-project.py creato!")

# Esegui lo script
print("🚀 Esecuzione fix-project.py...")
os.system("python3 fix-project.py")
