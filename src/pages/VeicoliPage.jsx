import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useTracking } from "../context/TrackingContext";

export default function VeicoliPage({ profiloutente_id }) {
  const [veicoli, setVeicoli] = useState([]);
  const { veicolo, startTracking, stopTracking } = useTracking();

  useEffect(() => {
    supabase
      .from("veicoli")
      .select("*")
      .eq("profiloutente_id", profiloutente_id)
      .then(({ data }) => setVeicoli(data || []));
  }, []);

  const toggle = async (v) => {
    if (veicolo?.veicolo_id === v.veicolo_id) {
      await stopTracking();
      await supabase.from("utentiprofilo")
        .update({ active_vehicle_id: null })
        .eq("profiloutente_id", profiloutente_id);
    } else {
      await supabase.from("utentiprofilo")
        .update({ active_vehicle_id: v.veicolo_id })
        .eq("profiloutente_id", profiloutente_id);
      startTracking(v);
    }
  };

  return (
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
        {veicoli.map(v => (
          <tr key={v.veicolo_id}>
            <td>{v.marca || "-"}</td>
            <td>{v.modello || "-"}</td>
            <td>{v.targa || "-"}</td>
            <td>
              <button onClick={() => toggle(v)}>
                {veicolo?.veicolo_id === v.veicolo_id ? "ON" : "OFF"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}