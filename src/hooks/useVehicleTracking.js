import { useEffect, useRef } from "react";
import { supabase } from "../services/supabase";

export function useVehicleTracking(activeVehicleId) {
  const watchId = useRef(null);

  useEffect(() => {
    if (!activeVehicleId) {
      stopTracking();
      return;
    }

    startTracking(activeVehicleId);

    return () => stopTracking();
  }, [activeVehicleId]);

  function startTracking(vehicleId) {
    if (!navigator.geolocation) return;

    watchId.current = navigator.geolocation.watchPosition(
      async position => {
        await supabase.from("trackinggps").insert({
          veicolo_id: vehicleId,
          latitudine: position.coords.latitude,
          longitudine: position.coords.longitude,
          rilevato_il: new Date()
        });
      },
      error => console.error(error),
      { enableHighAccuracy: true }
    );
  }

  function stopTracking() {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }
}