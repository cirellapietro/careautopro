// src/context/TrackingContext.js
import { createContext, useContext, useRef, useState } from "react";
import { supabase } from "../services/supabase";
import { stimaKm, stimaTempo } from "../services/trackingEstimator";

const TrackingContext = createContext(null);

export function TrackingProvider({ children, profiloutente_id }) {
  const [trackingAttivo, setTrackingAttivo] = useState(false);
  const [sessioneId, setSessioneId] = useState(null);

  // riferimento per tracking stimato
  const startTimeRef = useRef(null);

  // velocità media usata se GPS NON autorizzato
  const VELOCITA_MEDIA_KMH = 30;

  /**
   * AVVIO TRACKING
   * @param {Object} params
   * @param {string} params.veicolo_id
   * @param {boolean} params.gpsAutorizzato
   */
  async function startTracking({ veicolo_id, gpsAutorizzato }) {
    if (!profiloutente_id || !veicolo_id) {
      throw new Error("profiloutente_id o veicolo_id mancanti");
    }

    startTimeRef.current = Date.now();

    const { data, error } = await supabase
      .from("tracking_sessions")
      .insert({
        profiloutente_id,
        veicolo_id,
        start_time: new Date().toISOString(),
        tracking_mode: gpsAutorizzato ? "gps" : "stimato"
      })
      .select()
      .single();

    if (error) {
      console.error("Errore startTracking:", error);
      throw error;
    }

    setSessioneId(data.id);
    setTrackingAttivo(true);

    if (!gpsAutorizzato) {
      console.log("Tracking STIMATO avviato");
    } else {
      console.log("Tracking GPS avviato (Capacitor)");
    }
  }

  /**
   * STOP TRACKING
   */
  async function stopTracking() {
    if (!sessioneId) return;

    const tempoSecondi = stimaTempo(startTimeRef.current);
    const kmStimati = stimaKm(tempoSecondi, VELOCITA_MEDIA_KMH);

    // chiusura sessione
    const { error: errSessione } = await supabase
      .from("tracking_sessions")
      .update({
        end_time: new Date().toISOString()
      })
      .eq("id", sessioneId);

    if (errSessione) {
      console.error("Errore chiusura sessione:", errSessione);
      throw errSessione;
    }

    // riepilogo (per GPS reale verrà sovrascritto lato backend)
    const { error: errSummary } = await supabase
      .from("tracking_summary")
      .insert({
        session_id: sessioneId,
        km_totali: kmStimati,
        tempo_totale: tempoSecondi
      });

    if (errSummary) {
      console.error("Errore inserimento summary:", errSummary);
      throw errSummary;
    }

    setTrackingAttivo(false);
    setSessioneId(null);
    startTimeRef.current = null;
  }

  return (
    <TrackingContext.Provider
      value={{
        trackingAttivo,
        startTracking,
        stopTracking
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) {
    throw new Error("useTracking deve essere usato dentro TrackingProvider");
  }
  return ctx;
}
