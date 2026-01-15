import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

const TrackingContext = createContext();
export const useTracking = () => useContext(TrackingContext);

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function TrackingProvider({ profiloutente_id, children }) {
  const [veicoloAttivo, setVeicoloAttivo] = useState(null);
  const [km, setKm] = useState(0);
  const [minuti, setMinuti] = useState(0);

  const lastPos = useRef(null);
  const watchId = useRef(null);
  const startTime = useRef(null);

  // 🔄 recupero veicolo attivo
  useEffect(() => {
    supabase
      .from("veicoli")
      .select("*")
      .eq("profiloutente_id", profiloutente_id)
      .eq("tracking_attivo", true)
      .maybeSingle()
      .then(({ data }) => setVeicoloAttivo(data));
  }, [profiloutente_id]);

  // 📍 tracking GPS
  useEffect(() => {
    if (!veicoloAttivo) return;

    startTime.current = Date.now();

    watchId.current = navigator.geolocation.watchPosition(
      async pos => {
        const { latitude, longitude, speed } = pos.coords;

        if (lastPos.current) {
          const deltaKm = haversine(
            lastPos.current.lat,
            lastPos.current.lng,
            latitude,
            longitude
          );
          setKm(k => k + deltaKm);
        }

        lastPos.current = { lat: latitude, lng: longitude };

        await supabase.from("trackinggps").insert({
          veicolo_id: veicoloAttivo.veicolo_id,
          latitude,
          longitude,
          velocita: speed ?? 0
        });
      },
      console.error,
      { enableHighAccuracy: true }
    );

    const timer = setInterval(() => {
      setMinuti(Math.floor((Date.now() - startTime.current) / 60000));
    }, 60000);

    return () => {
      navigator.geolocation.clearWatch(watchId.current);
      clearInterval(timer);
    };
  }, [veicoloAttivo]);

  return (
    <TrackingContext.Provider
      value={{ veicoloAttivo, km, minuti, setVeicoloAttivo }}
    >
      {children}
    </TrackingContext.Provider>
  );
      }
