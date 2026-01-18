import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useTracking } from "../context/TrackingContext";

export default function Statistiche() {
  const { veicoloAttivoId } = useTracking();

  const [giornalieri, setGiornalieri] = useState([]);
  const [settimanali, setSettimanali] = useState([]);
  const [mensili, setMensili] = useState([]);

  useEffect(() => {
    if (!veicoloAttivoId) return;

    const caricaStatistiche = async () => {
      const { data: g } = await supabase
        .from("vw_km_giornalieri")
        .select("*")
        .eq("veicolo_id", veicoloAttivoId)
        .order("giorno", { ascending: false });

      const { data: s } = await supabase
        .from("vw_km_settimanali")
        .select("*")
        .eq("veicolo_id", veicoloAttivoId)
        .order("settimana", { ascending: false });

      const { data: m } = await supabase
        .from("vw_km_mensili")
        .select("*")
        .eq("veicolo_id", veicoloAttivoId)
        .order("mese", { ascending: false });

      setGiornalieri(g || []);
      setSettimanali(s || []);
      setMensili(m || []);
    };

    caricaStatistiche();
  }, [veicoloAttivoId]);

  if (!veicoloAttivoId) {
    return <p>Nessun veicolo selezionato</p>;
  }

  return (
    <div>
      <h2>Statistiche veicolo</h2>

      <h3>📅 Giornaliere</h3>
      {giornalieri.map(r => (
        <div key={r.giorno}>
          {r.giorno} → {r.km_totali.toFixed(2)} km
        </div>
      ))}

      <h3>🗓 Settimanali</h3>
      {settimanali.map(r => (
        <div key={r.settimana}>
          {r.settimana} → {r.km_totali.toFixed(2)} km
        </div>
      ))}

      <h3>📆 Mensili</h3>
      {mensili.map(r => (
        <div key={r.mese}>
          {r.mese} → {r.km_totali.toFixed(2)} km
        </div>
      ))}
    </div>
  );
}