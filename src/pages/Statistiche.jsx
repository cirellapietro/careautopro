import { supabase } from "../services/supabase";

export default function Statistiche({ veicolo_id }) {

  const exportCSV = async () => {
    const { data } = await supabase
      .from("trackinggps")
      .select("sessione_inizio,sessione_fine,km_sessione,durata_minuti")
      .eq("veicolo_id", veicolo_id)
      .eq("is_sessione", true);

    const csv = [
      "inizio,fine,km,minuti",
      ...data.map(r =>
        `${r.sessione_inizio},${r.sessione_fine},${r.km_sessione},${r.durata_minuti}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "statistiche.csv";
    a.click();
  };

  return <button onClick={exportCSV}>Esporta CSV</button>;
}