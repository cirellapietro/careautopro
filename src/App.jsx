import { TrackingProvider } from "./context/TrackingContext";
import Dashboard from "./pages/Dashboard";

import VeicoliPage from "./pages/VeicoliPage";

export default function App() {
  const profiloutente_id = "RECUPERATO_DA_SUPABASE";

  return (
    <TrackingProvider profiloutente_id={profiloutente_id}>
      <Dashboard />
      <VehiclesPage profiloutente_id={profiloutente_id} />
    </TrackingProvider>
  );
}