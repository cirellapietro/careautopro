import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const [activeVehicleId, setActiveVehicleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { data: profilo } = await supabase
      .from("utentiprofilo")
      .select("active_vehicle_id")
      .eq("profiloutente_id", user.id)
      .single();

    if (!profilo?.active_vehicle_id) {
      navigate("/veicoli");
    } else {
      setActiveVehicleId(profilo.active_vehicle_id);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      <div className="card">
        Veicolo attivo: {activeVehicleId}
      </div>

      <button
        className="mt-4 underline text-blue-600"
        onClick={() => navigate("/statistiche")}
      >
        Vai alle statistiche
      </button>
    </div>
  );
}