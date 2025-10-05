import React from 'react'
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
