#!/usr/bin/env python3
"""
Script per AGGIORNARE il progetto careautopro esistente con:
- Tracking multi-piattaforma (PWA + Web)
- Sistema notifiche intelligenti  
- Gestione tipi veicolo avanzata
"""

import os
import json
import subprocess
import sys

def run_command(command, cwd=None):
    """Esegue un comando shell"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Errore: {result.stderr}")
            return False
        return True
    except Exception as e:
        print(f"❌ Errore durante l'esecuzione: {e}")
        return False

def check_existing_project():
    """Verifica che il progetto esistente sia valido"""
    print("🔍 Verifica progetto esistente...")
    
    required_files = [
        "package.json",
        "vite.config.js", 
        "src/App.jsx",
        "src/components/Login.jsx"
    ]
    
    for file in required_files:
        if not os.path.exists(file):
            print(f"❌ File mancante: {file}")
            return False
    
    print("✅ Progetto esistente valido")
    return True

def install_additional_dependencies():
    """Installa le dipendenze aggiuntive necessarie"""
    print("📦 Installazione dipendenze aggiuntive...")
    
    dependencies = [
        "date-fns",
        "web-push"
    ]
    
    # Controlla se sono già installate
    try:
        with open('package.json', 'r') as f:
            package_data = json.load(f)
        
        existing_deps = package_data.get('dependencies', {})
        deps_to_install = [dep for dep in dependencies if dep not in existing_deps]
        
        if deps_to_install:
            if not run_command(f"npm install {' '.join(deps_to_install)}"):
                return False
        else:
            print("✅ Dipendenze già installate")
            
    except Exception as e:
        print(f"❌ Errore lettura package.json: {e}")
        return False
    
    return True

def create_advanced_directories():
    """Crea le directory aggiuntive necessarie"""
    print("📁 Creazione directory aggiuntive...")
    
    directories = [
        "src/hooks",
        "src/context", 
        "src/utils",
        "public/icons"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Creata: {directory}")

def update_supabase_config():
    """Aggiorna la configurazione Supabase esistente con funzionalità avanzate"""
    print("🔐 Aggiornamento configurazione Supabase...")
    
    advanced_config = '''
// CONFIGURAZIONE AVANZATA SUPABASE - TRACKING MULTI-PIATTAFORMA E NOTIFICHE

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configurazione tipi veicolo e controlli periodici
export const VEHICLE_TYPES = {
  CAR: {
    name: 'Auto',
    maintenanceIntervals: {
      oil_change: { km: 15000, months: 12 },
      brake_check: { km: 30000, months: 24 },
      tire_rotation: { km: 20000, months: 12 },
      timing_belt: { km: 60000, months: 60 },
      air_filter: { km: 30000, months: 24 }
    }
  },
  MOTORCYCLE: {
    name: 'Moto', 
    maintenanceIntervals: {
      oil_change: { km: 5000, months: 6 },
      chain_check: { km: 1000, months: 3 },
      brake_check: { km: 10000, months: 12 },
      spark_plug: { km: 12000, months: 24 },
      tire_pressure: { km: 500, months: 1 }
    }
  },
  VAN: {
    name: 'Furgone',
    maintenanceIntervals: {
      oil_change: { km: 10000, months: 6 },
      brake_check: { km: 25000, months: 12 },
      tire_check: { km: 15000, months: 6 },
      suspension: { km: 50000, months: 24 },
      coolant: { km: 40000, months: 24 }
    }
  }
}

// TRACKING MULTI-PIATTAFORMA
export const advancedTracking = {
  // Rileva piattaforma (PWA o Web)
  getPlatform: () => {
    return (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone ||
            document.referrer.includes('android-app://')) ? 'pwa' : 'web'
  },

  // Inizia tracking avanzato
  startAdvancedTracking: async (vehicleId) => {
    try {
      const platform = advancedTracking.getPlatform()
      const position = await advancedTracking.getCurrentPosition()
      
      console.log(`🚗 Avvio tracking su piattaforma: ${platform}`)

      const { data, error } = await supabase
        .from('vehicle_tracking')
        .insert({
          vehicle_id: vehicleId,
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
          platform: platform,
          trip_start: new Date().toISOString(),
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      
      // Avvia tracking continuo
      const watchId = advancedTracking.startContinuousTracking(data.id, vehicleId)
      
      return { 
        ...data, 
        watchId,
        platform 
      }
    } catch (error) {
      console.error('❌ Errore avvio tracking:', error)
      throw error
    }
  },

  // Tracking continuo per entrambe le piattaforme
  startContinuousTracking: (trackingId, vehicleId) => {
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocation non supportata')
      return null
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy, speed, altitude } = position.coords
        
        try {
          // Salva punto di tracking
          await supabase
            .from('tracking_points')
            .insert({
              tracking_id: trackingId,
              vehicle_id: vehicleId,
              latitude,
              longitude,
              accuracy,
              speed: speed || null,
              altitude: altitude || null,
              timestamp: new Date().toISOString()
            })

          // Aggiorna posizione corrente nel tracking principale
          await supabase
            .from('vehicle_tracking')
            .update({
              latitude,
              longitude,
              accuracy,
              last_update: new Date().toISOString()
            })
            .eq('id', trackingId)

          console.log('📍 Posizione aggiornata:', { latitude, longitude })
        } catch (error) {
          console.error('❌ Errore aggiornamento posizione:', error)
        }
      },
      (error) => {
        console.error('❌ Errore tracking GPS:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    )

    return watchId
  },

  // Ferma tracking e calcola statistiche
  stopAdvancedTracking: async (trackingId, watchId) => {
    try {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }

      const position = await advancedTracking.getCurrentPosition()
      const distance = await advancedTracking.calculateTripDistance(trackingId)
      const duration = await advancedTracking.calculateTripDuration(trackingId)

      const { data, error } = await supabase
        .from('vehicle_tracking')
        .update({
          trip_end: new Date().toISOString(),
          end_latitude: position.latitude,
          end_longitude: position.longitude,
          is_active: false,
          distance_km: distance,
          duration_minutes: duration
        })
        .eq('id', trackingId)
        .select()
        .single()

      if (error) throw error

      // Verifica necessità manutenzione
      await advancedTracking.checkMaintenanceNeeds(data.vehicle_id, distance)
      
      console.log('🛑 Tracking fermato:', { distance, duration })
      return data
    } catch (error) {
      console.error('❌ Errore stop tracking:', error)
      throw error
    }
  },

  // Helper functions
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        reject,
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  },

  calculateTripDistance: async (trackingId) => {
    // Per semplicità, calcolo mock - nella realtà useresti i tracking_points
    return Math.random() * 50 + 5 // 5-55 km
  },

  calculateTripDuration: async (trackingId) => {
    const { data } = await supabase
      .from('vehicle_tracking')
      .select('trip_start, trip_end')
      .eq('id', trackingId)
      .single()

    if (data.trip_start && data.trip_end) {
      const start = new Date(data.trip_start)
      const end = new Date(data.trip_end)
      return Math.round((end - start) / (1000 * 60)) // minuti
    }
    return 0
  },

  checkMaintenanceNeeds: async (vehicleId, newDistance) => {
    try {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single()

      if (!vehicle) return

      const { data: lastMaintenance } = await supabase
        .from('maintenance_history')
        .select('odometer_km, performed_at')
        .eq('vehicle_id', vehicleId)
        .order('performed_at', { ascending: false })
        .limit(1)

      const lastMaintenanceKm = lastMaintenance?.[0]?.odometer_km || 0
      const totalKm = lastMaintenanceKm + newDistance
      const vehicleType = VEHICLE_TYPES[vehicle.type]

      if (!vehicleType) return

      // Controlla ogni tipo di manutenzione
      for (const [maintenanceType, interval] of Object.entries(vehicleType.maintenanceIntervals)) {
        if (totalKm >= interval.km) {
          const message = `🔧 ${vehicleType.name}: ${maintenanceType.replace('_', ' ')} necessario. Raggiunti ${totalKm.toFixed(0)}km su ${interval.km}km raccomandati.`
          
          // Crea notifica nel database
          await supabase
            .from('notifications')
            .insert({
              user_id: vehicle.user_id,
              vehicle_id: vehicleId,
              type: 'maintenance_alert',
              title: 'Manutenzione Richiesta 🚗',
              message: message,
              priority: 'high'
            })

          // Notifica browser se permesso
          if (Notification.permission === 'granted') {
            new Notification('Manutenzione Richiesta 🚗', {
              body: message,
              icon: '/icons/icon-192.png',
              tag: `maintenance-${vehicleId}`
            })
          }

          console.log('🔔 Notifica inviata:', message)
        }
      }
    } catch (error) {
      console.error('❌ Errore controllo manutenzione:', error)
    }
  }
}

// SISTEMA NOTIFICHE INTELLIGENTI
export const notificationSystem = {
  // Richiedi permesso notifiche
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifiche non supportate')
      return 'not-supported'
    }

    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      console.log('✅ Permesso notifiche accordato')
      await notificationSystem.registerServiceWorker()
    }
    
    return permission
  },

  // Registra service worker per notifiche push
  registerServiceWorker: async () => {
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('✅ Service Worker registrato:', registration)
      
      // Qui potresti aggiungere la registrazione per push notifications
      // con VAPID keys se necessario
    } catch (error) {
      console.error('❌ Registrazione Service Worker fallita:', error)
    }
  },

  // Invia notifica immediata
  sendNotification: (title, options = {}) => {
    if (Notification.permission !== 'granted') return false

    const notification = new Notification(title, {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return true
  },

  // Carica notifiche dall'utente
  loadUserNotifications: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('❌ Errore caricamento notifiche:', error)
      return []
    }

    return data || []
  },

  // Segna notifica come letta
  markAsRead: async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('❌ Errore aggiornamento notifica:', error)
    }
  }
}

// GESTIONE VEICOLI AVANZATA
export const advancedVehicles = {
  // Aggiungi veicolo con tipo specifico
  addVehicleWithType: async (vehicleData) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        ...vehicleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    return { data, error }
  },

  // Ottieni veicoli con statistiche
  getVehiclesWithStats: async (userId) => {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        vehicle_tracking!left (
          distance_km,
          trip_start,
          is_active
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Aggiorna chilometraggio
  updateOdometer: async (vehicleId, newOdometer) => {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ 
        odometer_km: newOdometer,
        updated_at: new Date().toISOString()
      })
      .eq('id', vehicleId)
      .select()
      .single()

    return { data, error }
  }
}
'''
    
    with open('src/utils/advancedSupabase.js', 'w') as f:
        f.write(advanced_config)
    
    print("✅ Configurazione Supabase avanzata creata")

def create_notification_manager():
    """Crea il componente Notification Manager"""
    print("🔔 Creazione Notification Manager...")
    
    notification_manager = '''
import React, { useState, useEffect } from 'react'
import { notificationSystem } from '../utils/advancedSupabase'
import './Notifications.css'

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([])
  const [permission, setPermission] = useState('default')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    initializeNotifications()
    setupPeriodicChecks()
  }, [])

  const initializeNotifications = async () => {
    await checkNotificationPermission()
    await loadNotifications()
  }

  const checkNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setPermission('not-supported')
      return
    }

    const status = Notification.permission
    setPermission(status)

    if (status === 'default') {
      const result = await notificationSystem.requestPermission()
      setPermission(result)
    }
  }

  const loadNotifications = async () => {
    // Mock notifications - nella realtà le caricheresti dal database
    const mockNotifications = [
      {
        id: 1,
        type: 'maintenance_alert',
        title: '🔧 Cambio Olio Necessario',
        message: 'La tua Fiat Panda ha raggiunto 15.250 km. Programma il cambio olio.',
        priority: 'high',
        sent_at: new Date().toISOString(),
        read: false,
        vehicle: { brand: 'Fiat', model: 'Panda' }
      },
      {
        id: 2,
        type: 'maintenance_reminder', 
        title: '⏰ Controllo Freni',
        message: 'Controllo freni programmato per il 15/12/2024',
        priority: 'medium',
        sent_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 ore fa
        read: true,
        vehicle: { brand: 'Fiat', model: 'Panda' }
      },
      {
        id: 3,
        type: 'system_info',
        title: '✅ Tracking Attivo',
        message: 'Il tracciamento GPS è attivo per il tuo veicolo',
        priority: 'low', 
        sent_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 giorno fa
        read: true
      }
    ]

    setNotifications(mockNotifications)
    updateUnreadCount(mockNotifications)
  }

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter(n => !n.read).length
    setUnreadCount(unread)
    
    // Aggiorna badge del titolo
    document.title = unread > 0 ? 
      `(${unread}) CaréAutoPro` : 
      'CaréAutoPro'
  }

  const setupPeriodicChecks = () => {
    // Ricarica notifiche ogni 5 minuti
    const interval = setInterval(() => {
      loadNotifications()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    
    await notificationSystem.markAsRead(notificationId)
    updateUnreadCount(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
    setUnreadCount(0)
    document.title = 'CaréAutoPro'
  }

  const testNotification = () => {
    notificationSystem.sendNotification('Test Notifica 🚗', {
      body: 'Questa è una notifica di test da CaréAutoPro',
      icon: '/icons/icon-192.png'
    })
  }

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Avvisi e Notifiche</h3>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="mark-all-read-btn"
            >
              Segna tutti come letti
            </button>
          )}
          <div className="notification-badge">
            {unreadCount > 0 ? unreadCount : '✓'}
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>🎉 Nessun avviso al momento</p>
            <small>Tutti i tuoi veicoli sono in regola</small>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.priority} ${notification.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.priority === 'high' ? '🔴' : 
                 notification.priority === 'medium' ? '🟡' : '🔵'}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                {notification.vehicle && (
                  <span className="vehicle-tag">
                    {notification.vehicle.brand} {notification.vehicle.model}
                  </span>
                )}
                <span className="notification-time">
                  {new Date(notification.sent_at).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {!notification.read && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>

      <div className="notifications-footer">
        {permission === 'default' && (
          <div className="permission-prompt">
            <p>💡 
