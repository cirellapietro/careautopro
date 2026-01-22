// src/context/TrackingContext.js
import { createContext, useContext, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import { stimaKm } from "../services/stimaKm";

const TrackingContext = createContext();

export function TrackingProvider({ children }) {
  const gpsWatchId = useRef(null);
  const timerStimato = useRef(null);

  const canUseGPS = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(false);
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  };

  const startTracking = async (veicolo_id, sessioneAttivaId) => {
    const gpsDisponibile = await canUseGPS();
    if (gpsDisponibile) startGPSTracking(veicolo_id, sessioneAttivaId);
    else startStimato(veicolo_id, sessioneAttivaId);
  };

  const startGPSTracking = (veicolo_id, sessioneAttivaId) => {
    gpsWatchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        await supabase.from("trackinggps").insert({
          sessione_id: sessioneAttivaId,
          latitude,
          longitude,
          velocita: speed,
          dataora: new Date()
        });
      },
      () => startStimato(veicolo_id, sessioneAttivaId),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startStimato = (veicolo_id, sessioneAttivaId) => {
    let secondi = 0;
    timerStimato.current = setInterval(async () => {
      secondi += 10;
      const km = stimaKm(10);
      await supabase.from("tracking_stimato").insert({
        sessione_id: sessioneAttivaId,
        km,
        secondi,
        dataora: new Date()
      });
    }, 10000);
  };

  const stopTracking = () => {
    if (gpsWatchId.current) navigator.geolocation.clearWatch(gpsWatchId.current);
    if (timerStimato.current) clearInterval(timerStimato.current);
    gpsWatchId.current = null;
    timerStimato.current = null;
  };

  return (
    <TrackingContext.Provider value={{ startTracking, stopTracking }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  return useContext(TrackingContext);
}
