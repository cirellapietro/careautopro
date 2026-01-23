import { NavLink } from "react-router-dom";
import { Home, Car, BarChart3, User, LogOut } from "lucide-react";

export default function BottomNav() {
  const base =
    "flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs";
  const active = "text-blue-600";
  const inactive = "text-gray-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white border-t border-gray-200 flex">
      <NavLink to="/dashboard" className={({ isActive }) => \`\${base} \${isActive ? active : inactive}\`}>
        <Home size={28} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/vehicles" className={({ isActive }) => \`\${base} \${isActive ? active : inactive}\`}>
        <Car size={28} />
        <span>Veicoli</span>
      </NavLink>

      <NavLink to="/stats" className={({ isActive }) => \`\${base} \${isActive ? active : inactive}\`}>
        <BarChart3 size={28} />
        <span>Statistiche</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => \`\${base} \${isActive ? active : inactive}\`}>
        <User size={28} />
        <span>Profilo</span>
      </NavLink>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="\${base} text-red-500"
      >
        <LogOut size={28} />
        <span>Logout</span>
      </button>
    </nav>
  );
}
