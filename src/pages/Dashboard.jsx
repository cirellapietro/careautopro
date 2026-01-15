// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useTracking } from "../context/TrackingContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ profiloutente_id }) {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const { veicoloAttivo, km, isTracking } = useTracking();

  useEffect(() => {
    const check = async () => {
      const { data: veicoli } = await supabase
        .from("veicoli")
        .select("veicolo_id")
        .eq("profiloutente_id", profiloutente_id);

      if (!veicoli || veicoli.length === 0) {
        navigate("/veicoli");
        return;
      }

      const { data: profilo } = await supabase
        .from("utentiprofilo")
        .select("active_vehicle_id")
        .eq("profiloutente_id", profiloutente_id)
        .single();

      if (!profilo?.active_vehicle_id) {
        navigate("/veicoli");
        return;
      }

      const oggi = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from("trackinggps")
        .select("km_sessione,durata_minuti")
        .eq("veicolo_id", profilo.active_vehicle_id)
        .eq("is_sessione", true)
        .gte("sessione_inizio", oggi);

      const kmTot = data.reduce((s, r) => s + (r.km_sessione || 0), 0);
      const minTot = data.reduce((s, r) => s + (r.durata_minuti || 0), 0);

      setStats({ kmTot, minTot });
    };

    check();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {stats && (
        <div>
          <p>Km oggi: {stats.kmTot.toFixed(2)}</p>
          <p>Minuti oggi: {stats.minTot}</p>
        </div>
      )}

      {isTracking && (
        <p>Tracking attivo – km sessione: {km.toFixed(2)}</p>
      )}

      <button onClick={() => navigate("/veicoli")}>
        Gestione veicoli
      </button>
    </div>
  );
}
