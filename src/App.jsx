import { TrackingProvider } from "./TrackingContext";
import Dashboard from "./pages/Dashboard";
import VehiclesPage from "./pages/VehiclesPage";

export default function App() {
  const profiloutente_id = "RECUPERATO_DA_SUPABASE";

  return (
    <TrackingProvider profiloutente_id={profiloutente_id}>
      <Dashboard />
      <VehiclesPage profiloutente_id={profiloutente_id} />
    </TrackingProvider>
  );
}
