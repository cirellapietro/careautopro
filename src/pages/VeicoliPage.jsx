import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicleId, setActiveVehicleId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { data: vehiclesData } = await supabase
      .from("veicoli")
      .select("*")
      .eq("utente_id", user.id);

    const { data: profilo } = await supabase
      .from("utentiprofilo")
      .select("active_vehicle_id")
      .eq("profiloutente_id", user.id)
      .single();

    setVehicles(vehiclesData || []);
    setActiveVehicleId(profilo?.active_vehicle_id ?? null);
  }

  async function toggleTracking(veicoloId) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const nuovoValore =
      activeVehicleId === veicoloId ? null : veicoloId;

    await supabase
      .from("utentiprofilo")
      .update({ active_vehicle_id: nuovoValore })
      .eq("profiloutente_id", user.id);

    setActiveVehicleId(nuovoValore);
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Veicoli</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modello</th>
            <th>Targa</th>
            <th>Anno</th>
            <th>Tracciamento</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.veicolo_id}>
              <td>{v.marca ?? "-"}</td>
              <td>{v.modello ?? "-"}</td>
              <td>{v.targa ?? "-"}</td>
              <td>{v.anno ?? "-"}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={activeVehicleId === v.veicolo_id}
                  onChange={() => toggleTracking(v.veicolo_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}