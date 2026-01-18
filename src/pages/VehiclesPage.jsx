import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VehiclesPage({ utente_id }) {
  const [veicoli, setVeicoli] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    caricaVeicoli();
  }, []);

  async function caricaVeicoli() {
    const { data } = await supabase
      .from("veicoli")
      .select("veicolo_id, nomeveicolo, targa, sessione_attiva_id")
      .eq("utente_id", utente_id)
      .is("dataoraelimina", null);

    setVeicoli(data || []);
  }

  async function toggleTracking(veicolo) {
    setLoading(true);

    // 1️⃣ disattiva tutti
    await supabase
      .from("veicoli")
      .update({ sessione_attiva_id: null })
      .eq("utente_id", utente_id);

    // 2️⃣ se era spento → accendi questo
    if (!veicolo.sessione_attiva_id) {
      await supabase
        .from("veicoli")
        .update({
          sessione_attiva_id: crypto.randomUUID(),
          ultimo_aggiornamento_tracking: new Date()
        })
        .eq("veicolo_id", veicolo.veicolo_id);
    }

    await caricaVeicoli();
    setLoading(false);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Veicoli</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Targa</th>
            <th className="p-2 text-center">Tracking</th>
          </tr>
        </thead>

        <tbody>
          {veicoli.map(v => (
            <tr key={v.veicolo_id} className="border-t">
              <td className="p-2">{v.nomeveicolo}</td>
              <td className="p-2">{v.targa}</td>
              <td className="p-2 text-center">
                <button
                  disabled={loading}
                  onClick={() => toggleTracking(v)}
                  className={`px-3 py-1 rounded ${
                    v.sessione_attiva_id
                      ? "bg-green-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {v.sessione_attiva_id ? "ON" : "OFF"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}