import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600' : 'text-gray-400';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 flex items-center justify-around pb-6 z-50">
      <Link to="/" className={`flex flex-col items-center flex-1 ${active('/')}`}><LayoutDashboard size={24} /> <span className="text-[10px] font-bold mt-1">Home</span></Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${active('/garage')}`}><Car size={24} /> <span className="text-[10px] font-bold mt-1">Garage</span></Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${active('/profile')}`}><User size={24} /> <span className="text-[10px] font-bold mt-1">Profilo</span></Link>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Routes>
          <Route path="/" element={<div className="p-6"><h1>Dashboard</h1><p>Benvenuto.</p></div>} />
          <Route path="/garage" element={<div className="p-6"><h1>Garage</h1><p>I tuoi veicoli appariranno qui.</p></div>} />
          <Route path="/profile" element={<div className="p-6"><h1>Profilo</h1><p>I tuoi dati.</p></div>} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
