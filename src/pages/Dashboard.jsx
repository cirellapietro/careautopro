import { useTracking } from "../context/TrackingContext";

export default function Dashboard() {
  const { gpsAttivo } = useTracking();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Tracking GPS:{" "}
        <strong>{gpsAttivo ? "ATTIVO" : "STIMATO"}</strong>
      </p>
    </div>
  );
}