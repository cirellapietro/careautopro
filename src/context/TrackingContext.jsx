// src/context/TrackingContext.js
import { createContext, useContext, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import { stimaKm, stimaTempo } from "../services/trackingEstimator";

const TrackingContext = createContext();

export function TrackingProvider({ children, profiloutente_id }) {
  const [tracking, setTracking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const startTimeRef = useRef(null);
  const velocitaMedia = 30; // km/h (configurabile)

  // === AVVIO TRACKING ===
  async function startTracking({ veicolo_id, gpsAutorizzato }) {
    startTimeRef.current = Date.now();

    const { data, error } = await supabase
      .from("tracking_sessions")
      .insert({
        user_id: profiloutente_id,
        veicolo_id,
        start_time: new Date().toISOString(),
        tracking_mode: gpsAutorizzato ? "gps" : "stimato"
      })
      .select()
      .single();

    if (error) throw error;

    setSessionId(data.id);
    setTracking(true);

    if (!gpsAutorizzato) {
      console.log("Tracking stimato avviato");
    }
  }

  // === STOP TRACKING ===
  async function stopTracking() {
    if (!sessionId) return;

    const tempoSecondi = stimaTempo(startTimeRef.current);
    const kmStimati = stimaKm(tempoSecondi, velocitaMedia);

    await supabase.from("tracking_sessions")
      .update({ end_time: new Date().toISOString() })
      .eq("id", sessionId);

    await supabase.from("tracking_summary").insert({
      session_id: sessionId,
      km_totali: kmStimati,
      tempo_totale: tempoSecondi
    });

    setTracking(false);
    setSessionId(null);
  }

  return (
    <TrackingContext.Provider
      value={{
        tracking,
        startTracking,
        stopTracking
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  return useContext(TrackingContext);
}
