import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Statistiche() {
  const [giornalieri, setGiornalieri] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("vw_km_giornalieri")
        .select("*")
        .order("giorno", { ascending: false });

      setGiornalieri(data || []);
    };

    load();
  }, []);

  return (
    <div className="page">
      <h1>Statistiche</h1>

      <ul>
        {giornalieri.map((r, i) => (
          <li key={i}>
            {r.giorno} → {r.km_totali.toFixed(2)} km
          </li>
        ))}
      </ul>
    </div>
  );
}