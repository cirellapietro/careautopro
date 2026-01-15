import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useTracking } from "../context/TrackingContext";

export default function Dashboard({ activeVehicleId }) {
  const { km, isTracking } = useTracking();
  const [points, setPoints] = useState([]);
  const [stats, setStats] = useState({ km: 0, min: 0 });

  useEffect(() => {
    if (!activeVehicleId) return;

    supabase.from("trackinggps")
      .select("latitude,longitude")
      .eq("veicolo_id", activeVehicleId)
      .eq("is_sessione", false)
      .then(({ data }) =>
        setPoints(data.map(p => [p.latitude, p.longitude]))
      );

    supabase.from("trackinggps")
      .select("km_sessione,durata_minuti")
      .eq("veicolo_id", activeVehicleId)
      .eq("is_sessione", true)
      .then(({ data }) => {
        setStats({
          km: data.reduce((s, r) => s + r.km_sessione, 0),
          min: data.reduce((s, r) => s + r.durata_minuti, 0)
        });
      });
  }, [activeVehicleId]);

  return (
    <>
      <h2>Statistiche oggi</h2>
      <p>Km totali: {stats.km.toFixed(2)}</p>
      <p>Minuti: {stats.min}</p>
      {isTracking && <p>Tracking attivo – sessione km: {km.toFixed(2)}</p>}

      {points.length > 1 && (
        <MapContainer center={points.at(-1)} zoom={14} style={{ height: 300 }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={points} />
        </MapContainer>
      )}
    </>
  );
}