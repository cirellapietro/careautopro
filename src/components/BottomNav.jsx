import React from 'react';
import { Home, Car, BarChart3, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function BottomNav() {
  const base = "flex flex-col items-center justify-center flex-1 py-2 transition-colors";
  const active = "text-primary";
  const inactive = "text-gray-500 hover:text-primary";

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Car, label: 'Veicoli', path: '/vehicles' },
    { icon: BarChart3, label: 'Stats', path: '/stats' },
    { icon: User, label: 'Profilo', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white border-t border-gray-200 flex">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `${base} ${isActive ? active : inactive}`
          }
        >
          <item.icon size={28} />
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
