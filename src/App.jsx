import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex items-center justify-around pb-6 z-50 shadow-lg">
      <Link to="/" className={`flex flex-col items-center flex-1 ${isActive('/')}`}>
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-bold mt-1 uppercase">Home</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${isActive('/garage')}`}>
        <Car size={24} />
        <span className="text-[10px] font-bold mt-1 uppercase">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${isActive('/profile')}`}>
        <User size={24} />
        <span className="text-[10px] font-bold mt-1 uppercase">Profilo</span>
      </Link>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
        <Routes>
          <Route path="/" element={<div className="p-6"><h1 className="text-3xl font-black">Dashboard</h1><p className="mt-2 text-gray-600">Benvenuto su CareAutoPro</p></div>} />
          <Route path="/garage" element={<div className="p-6"><h1 className="text-3xl font-black">Garage</h1><p className="mt-2 text-gray-600">Le tue auto</p></div>} />
          <Route path="/profile" element={<div className="p-6"><h1 className="text-3xl font-black">Profilo</h1><p className="mt-2 text-gray-600">Impostazioni account</p></div>} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
