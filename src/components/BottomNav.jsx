import { NavLink } from "react-router-dom";
import { Home, Car, BarChart, LogOut } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard">
        <Home size={24} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/vehicles">
        <Car size={24} />
        <span>Veicoli</span>
      </NavLink>

      <NavLink to="/stats">
        <BarChart size={24} />
        <span>Statistiche</span>
      </NavLink>

      <button onClick={() => window.location.href = '/logout'}>
        <LogOut size={24} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
