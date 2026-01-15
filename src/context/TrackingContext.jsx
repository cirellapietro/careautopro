// src/context/TrackingContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase";

const TrackingContext = createContext();
export const useTracking = () => useContext(TrackingContext);

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function TrackingProvider({ children }) {
  const [veicoloAttivo, setVeicoloAttivo] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [km, setKm] = useState(0);
  const [inizio, setInizio] = useState(null);

  const lastPos = useRef(null);
  const watchId = useRef(null);

  const startTracking = async (veicolo) => {
    if (isTracking) return;

    setVeicoloAttivo(veicolo);
    setKm(0);
    setInizio(new Date());
    setIsTracking(true);

    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        if (lastPos.current) {
          const dist = haversine(
            lastPos.current.lat,
            lastPos.current.lng,
            latitude,
            longitude
          );
          setKm((k) => k + dist);
        }

        lastPos.current = { lat: latitude, lng: longitude };

        await supabase.from("trackinggps").insert({
          veicolo_id: veicolo.veicolo_id,
          latitude,
          longitude,
          is_sessione: false,
        });
      },
      console.error,
      { enableHighAccuracy: true }
    );
  };

  const stopTracking = async () => {
    if (!isTracking) return;

    navigator.geolocation.clearWatch(watchId.current);

    const fine = new Date();
    const durataMin =
      (fine.getTime() - inizio.getTime()) / 1000 / 60;

    await supabase.from("trackinggps").insert({
      veicolo_id: veicoloAttivo.veicolo_id,
      sessione_inizio: inizio,
      sessione_fine: fine,
      km_sessione: km,
      durata_minuti: Math.round(durataMin),
      is_sessione: true,
    });

    setIsTracking(false);
    setVeicoloAttivo(null);
    lastPos.current = null;
  };

  return (
    <TrackingContext.Provider
      value={{
        veicoloAttivo,
        isTracking,
        km,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
                     }
