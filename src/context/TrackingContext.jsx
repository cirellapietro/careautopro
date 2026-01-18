import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase";
import { stimaKm } from "../utils/stimaKm";

const TrackingContext = createContext();

export function TrackingProvider({ profiloutente_id, children }) {
  const watchIdRef = useRef(null);
  const lastPositionRef = useRef(null);
  const startTimeRef = useRef(null);

  const [sessioneId, setSessioneId] = useState(null);
  const [gpsAttivo, setGpsAttivo] = useState(false);

  // 🔹 recupera veicolo attivo
  useEffect(() => {
    async function caricaVeicoloAttivo() {
      const { data } = await supabase
        .from("veicoli")
        .select("sessione_attiva_id")
        .eq("utente_id", profiloutente_id)
        .not("sessione_attiva_id", "is", null)
        .single();

      if (data?.sessione_attiva_id) {
        setSessioneId(data.sessione_attiva_id);
        avviaTracking(data.sessione_attiva_id);
      }
    }

    caricaVeicoloAttivo();
    return stopTracking;
  }, [profiloutente_id]);

  // 🔹 Avvio tracking
  function avviaTracking(sessione_id) {
    if (!navigator.geolocation) {
      setGpsAttivo(false);
      avviaTrackingStimato(sessione_id);
      return;
    }

    startTimeRef.current = Date.now();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsAttivo(true);
        salvaPuntoGPS(sessione_id, pos);
      },
      () => {
        setGpsAttivo(false);
        avviaTrackingStimato(sessione_id);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  }

  // 🔹 Stop tracking
  function stopTracking() {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  // 🔹 Salvataggio GPS reale
  async function salvaPuntoGPS(sessione_id, position) {
    const { latitude, longitude, accuracy, speed, heading } = position.coords;

    if (lastPositionRef.current) {
      const km = stimaKm(lastPositionRef.current, position.coords);
      await supabase.rpc("incrementa_km_sessione", {
        p_sessione_id: sessione_id,
        p_km: km,
      });
    }

    lastPositionRef.current = position.coords;

    await supabase.from("trackinggps").insert({
      sessione_id,
      latitude,
      longitude,
      velocita: speed,
      direzione: heading,
      precisione: accuracy,
      dataora: new Date().toISOString(),
    });
  }

  // 🔹 Tracking stimato
  async function avviaTrackingStimato(sessione_id) {
    const intervallo = setInterval(async () => {
      const tempo = (Date.now() - startTimeRef.current) / 3600000;
      const kmStimati = tempo * 40; // media urbana

      await supabase.rpc("incrementa_km_sessione", {
        p_sessione_id: sessione_id,
        p_km: kmStimati,
      });
    }, 60000);

    return () => clearInterval(intervallo);
  }

  return (
    <TrackingContext.Provider value={{ gpsAttivo }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  return useContext(TrackingContext);
}