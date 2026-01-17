import { TrackingProvider } from "./context/TrackingContext";
import Dashboard from "./pages/Dashboard";
import Statistiche from "./pages/Statistiche";

export default function App() {
  const profiloutente_id = "RECUPERATO_DA_SUPABASE";

  return (
    <TrackingProvider profiloutente_id={profiloutente_id}>
      <Dashboard />
      <Statistiche />
    </TrackingProvider>
  );
}