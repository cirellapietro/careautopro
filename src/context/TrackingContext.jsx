import { createContext, useContext, useRef, useState } from "react";
import { supabase } from "../services/supabase";

const TrackingContext = createContext();
export const useTracking = () => useContext(TrackingContext);

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function TrackingProvider({ children }) {
  const [isTracking, setIsTracking] = useState(false);
  const [km, setKm] = useState(0);
  const [veicolo, setVeicolo] = useState(null);
  const startTime = useRef(null);
  const lastPos = useRef(null);
  const watchId = useRef(null);

  const startTracking = (v) => {
    if (isTracking) return;
    setVeicolo(v);
    setKm(0);
    startTime.current = new Date();
    setIsTracking(true);

    watchId.current = navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;

        if (lastPos.current) {
          setKm(k => k + haversine(
            lastPos.current.lat,
            lastPos.current.lng,
            latitude,
            longitude
          ));
        }

        lastPos.current = { lat: latitude, lng: longitude };

        await supabase.from("trackinggps").insert({
          veicolo_id: v.veicolo_id,
          latitude,
          longitude,
          is_sessione: false
        });
      },
      console.error,
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = async () => {
    if (!isTracking) return;
    navigator.geolocation.clearWatch(watchId.current);

    const end = new Date();
    const minutes = (end - startTime.current) / 60000;

    await supabase.from("trackinggps").insert({
      veicolo_id: veicolo.veicolo_id,
      sessione_inizio: startTime.current,
      sessione_fine: end,
      km_sessione: km,
      durata_minuti: Math.round(minutes),
      is_sessione: true
    });

    setIsTracking(false);
    setVeicolo(null);
    lastPos.current = null;
  };

  return (
    <TrackingContext.Provider value={{
      startTracking,
      stopTracking,
      isTracking,
      km,
      veicolo
    }}>
      {children}
    </TrackingContext.Provider>
  );
}
