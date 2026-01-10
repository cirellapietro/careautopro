import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

/* =======================
   CONFIG SUPABASE
======================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* =======================
   TYPES
======================= */
type Veicolo = {
  id: number;
  nomeveicolo: string;
  principale: boolean;
};

/* =======================
   APP
======================= */
function App() {
  const [user, setUser] = useState<any>(null);
  const [veicoli, setVeicoli] = useState<Veicolo[]>([]);
  const [veicoloSelezionato, setVeicoloSelezionato] = useState<number | null>(null);
  const [modalita, setModalita] = useState<"manuale" | "automatico">("manuale");
  const [posizione, setPosizione] = useState<GeolocationPosition | null>(null);
  const [erroreGPS, setErroreGPS] = useState<string | null>(null);

  /* =======================
     AUTH
  ======================= */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.
