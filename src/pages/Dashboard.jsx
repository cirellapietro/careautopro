// src/pages/Dashboard.jsx
import { useTracking } from "../context/TrackingContext";

export default function Dashboard() {
  const { tracking, startTracking, stopTracking } = useTracking();

  async function handleStart() {
    const gpsAutorizzato = "geolocation" in navigator;

    await startTracking({
      veicolo_id: 1, // TODO: veicolo selezionato
      gpsAutorizzato
    });
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {!tracking ? (
        <button onClick={handleStart}>
          Avvia tracking
        </button>
      ) : (
        <button onClick={stopTracking}>
          Stop tracking
        </button>
      )}
    </div>
  );
}
