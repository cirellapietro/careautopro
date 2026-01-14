import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function BottomNav() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bottom-nav">
      <button onClick={() => navigate("/dashboard")}>🏠</button>
      <button onClick={() => navigate("/veicoli")}>🚗</button>
      <button onClick={() => navigate("/tracking")}>▶️</button>
      <button onClick={() => navigate("/impostazioni")}>⚙️</button>
      <button onClick={logout}>🚪</button>
    </nav>
  );
}
