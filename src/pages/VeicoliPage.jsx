// src/pages/VeicoliPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useTracking } from "../context/TrackingContext";

export default function VeicoliPage({ profiloutente_id }) {
  const [veicoli, setVeicoli] = useState([]);
  const { startTracking, stopTracking, veicoloAttivo } = useTracking();

  const load = async () => {
    const { data } = await supabase
      .from("veicoli")
      .select("*")
      .eq("profiloutente_id", profiloutente_id);
    setVeicoli(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (v) => {
    if (veicoloAttivo?.veicolo_id === v.veicolo_id) {
      await stopTracking();
      await supabase
        .from("utentiprofilo")
        .update({ active_vehicle_id: null })
        .eq("profiloutente_id", profiloutente_id);
    } else {
      await supabase
        .from("utentiprofilo")
        .update({ active_vehicle_id: v.veicolo_id })
        .eq("profiloutente_id", profiloutente_id);
      startTracking(v);
    }
  };

  return (
    <div>
      <h2>I miei veicoli</h2>
      <table>
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modello</th>
            <th>Targa</th>
            <th>Tracking</th>
          </tr>
        </thead>
        <tbody>
          {veicoli.map((v) => (
            <tr key={v.veicolo_id}>
              <td>{v.marca || "-"}</td>
              <td>{v.modello || "-"}</td>
              <td>{v.targa || "-"}</td>
              <td>
                <button onClick={() => toggle(v)}>
                  {veicoloAttivo?.veicolo_id === v.veicolo_id
                    ? "ON"
                    : "OFF"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
