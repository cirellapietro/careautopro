import { useTracking } from "../context/TrackingContext";

export default function Dashboard() {
  const { trackingAttivo, startTracking, stopTracking } = useTracking();

  return (
    <div className="page">
      <h1>Dashboard</h1>

      {!trackingAttivo ? (
        <button onClick={startTracking}>
          ▶ Avvia tracking
        </button>
      ) : (
        <button onClick={stopTracking}>
          ⏹ Ferma tracking
        </button>
      )}
    </div>
  );
}