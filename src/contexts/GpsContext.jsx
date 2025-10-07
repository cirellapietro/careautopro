import React, { createContext, useState, useContext, useEffect } from 'react'
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
      alert('Errore nell\'avvio del tracking')
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
