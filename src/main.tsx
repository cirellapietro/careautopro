import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient, Session } from "@supabase/supabase-js";

/* =========================
   SUPABASE
========================= */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/* =========================
   TYPES
========================= */
type Veicolo = {
  veicolo_id: string;
  nomeveicolo: string;
};

type Posizione = {
  lat: number;
  lng: number;
  time: string;
};

/* =========================
   APP
========================= */
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState<"veicoli" | "gps">("veicoli");

  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [veicoloAttivo, setVeicoloAttivo] = useState<string | null>(
    localStorage.getItem("veicolo_attivo")
  );

  const [veicoloTracking, setVeicoloTracking] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);
  const [posizioni, setPosizioni] = useState<Posizione[]>([]);
  const [errore, setErrore] = useState<string | null>(null);

  /* =========================
     SESSIONE
  ========================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* =========================
     VEICOLI
  ========================= */
  useEffect(() => {
    if (session) caricaVeicoli();
  }, [session]);

  async function caricaVeicoli() {
    const { data, error } = await supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo")
      .eq("utente_id", session!.user.id)
      .order("nomeveicolo");

    if (error) setErrore(error.message);
    else setVeicoli(data || []);
  }

  function selezionaVeicoloAttivo(id: string) {
    setVeicoloAttivo(id);
    localStorage.setItem("veicolo_attivo", id);
  }

  /* =========================
     GPS
  ========================= */
  function avviaTracking() {
    if (!veicoloTracking) {
      alert("Seleziona un veicolo per il tracciamento");
      return;
    }

    if (!navigator.geolocation) {
      alert("GPS non supportato");
      return;
    }

    setTracking(true);

    navigator.geolocation.watchPosition(
      (pos) => {
        setPosizioni((p) => [
          ...p,
          {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            time: new Date().toISOString(),
          },
        ]);
      },
      (err) => {
        alert("Errore GPS: " + err.message);
        setTracking(false);
      },
      { enableHighAccuracy: true }
    );
  }

  function stopTracking() {
    setTracking(false);
  }

  /* =========================
     LOGOUT
  ========================= */
  async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
  }

  if (loading) return <p>Caricamento...</p>;
  if (!session) return <Login />;

  return (
