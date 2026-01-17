import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase";
import { Geolocation } from "@capacitor/geolocation";

const TrackingContext = createContext();

export function TrackingProvider({ profiloutente_id, children }) {
  const [sessioneId, setSessioneId] = useState(null);
  const [trackingAttivo, setTrackingAttivo] = useState(false);
  const watchId = useRef(null);

  // Avvio tracking
  const startTracking = async () => {
    const { data, error } = await supabase
      .from("sessioni_tracking")
      .insert({ profiloutente_id })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setSessioneId(data.sessione_id);
    setTrackingAttivo(true);

    watchId.current = await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      async (pos, err) => {
        if (err || !pos) return;

        const { latitude, longitude, accuracy, heading, speed } = pos.coords;

        await supabase.from("trackinggps").insert({
          sessione_id: data.sessione_id,
          latitude,
          longitude,
          precisione: accuracy,
          direzione: heading,
          velocita: speed,
          dataora: new Date().toISOString(),
        });
      }
    );
  };

  // Stop tracking
  const stopTracking = async () => {
    if (watchId.current) {
      await Geolocation.clearWatch({ id: watchId.current });
      watchId.current = null;
    }
    setTrackingAttivo(false);
    setSessioneId(null);
  };

  return (
    <TrackingContext.Provider
      value={{
        trackingAttivo,
        sessioneId,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export const useTracking = () => useContext(TrackingContext);