import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex items-center justify-around pb-2 z-50">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <LayoutDashboard size={28} />
        <span className="text-[10px] font-bold mt-1">Dashboard</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center ${isActive('/garage')}`}>
        <Car size={28} />
        <span className="text-[10px] font-bold mt-1">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
        <User size={28} />
        <span className="text-[10px] font-bold mt-1">Profilo</span>
      </Link>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Routes>
          <Route path="/" element={<div className="p-4"><h1>Dashboard</h1></div>} />
          <Route path="/garage" element={<div className="p-4"><h1>Garage</h1></div>} />
          <Route path="/profile" element={<div className="p-4"><h1>Profilo</h1></div>} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
