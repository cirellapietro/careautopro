import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  veicoloId: string;
};

export default function Statistiche({ veicoloId }: Props) {
  const [giornalieri, setGiornalieri] = useState<any[]>([]);
  const [settimanali, setSettimanali] = useState<any[]>([]);
  const [mensili, setMensili] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const { data: g } = await supabase
        .from("vw_km_giornalieri")
        .select("*")
        .eq("veicolo_id", veicoloId);

      const { data: s } = await supabase
        .from("vw_km_settimanali")
        .select("*")
        .eq("veicolo_id", veicoloId);

      const { data: m } = await supabase
        .from("vw_km_mensili")
        .select("*")
        .eq("veicolo_id", veicoloId);

      setGiornalieri(g || []);
      setSettimanali(s || []);
      setMensili(m || []);
    }

    loadStats();
  }, [veicoloId]);

  return (
    <div>
      <h2>📊 Statistiche veicolo</h2>

      <h3>Giornaliere</h3>
      {giornalieri.map(r => (
        <div key={r.giorno}>
          {r.giorno}: {r.km_percorsi.toFixed(2)} km
        </div>
      ))}

      <h3>Settimanali</h3>
      {settimanali.map(r => (
        <div key={r.settimana}>
          {r.settimana}: {r.km_settimana.toFixed(2)} km
        </div>
      ))}

      <h3>Mensili</h3>
      {mensili.map(r => (
        <div key={r.mese}>
          {r.mese}: {r.km_mese.toFixed(2)} km
        </div>
      ))}
    </div>
  );
}