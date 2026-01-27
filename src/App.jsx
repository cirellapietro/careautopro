import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, Zap } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const Login = ({ onLogin }) => (
  <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl">
      <span className="text-white text-6xl font-black">C</span>
    </div>
    <h1 className="text-4xl font-black mb-2 text-gray-900">CareAutoPro</h1>
    <p className="text-gray-500 mb-10 font-bold">Accedi per gestire i tuoi veicoli</p>
    <button onClick={onLogin} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-xl uppercase tracking-widest">Accedi</button>
  </div>
);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600 scale-110' : 'text-gray-300';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white h-36 flex items-center justify-around pb-12 px-4 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t-2 border-gray-50">
      <Link to="/" className={`flex flex-col items-center flex-1 ${active('/')}`}>
        <LayoutDashboard size={50} strokeWidth={3} />
        <span className="text-[14px] font-black mt-2 uppercase">Dashboard</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${active('/garage')}`}>
        <Car size={50} strokeWidth={3} />
        <span className="text-[14px] font-black mt-2 uppercase">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${active('/profile')}`}>
        <User size={50} strokeWidth={3} />
        <span className="text-[14px] font-black mt-2 uppercase">Profilo</span>
      </Link>
    </nav>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 antialiased">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Dashboard</h1>
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-4 text-gray-400 uppercase">Statistiche</h2>
                <p className="text-gray-600 text-lg font-bold">Qui vedrai le statistiche dei tuoi veicoli.</p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black text-gray-900 mb-8 italic uppercase tracking-tighter">Garage</h1>
              <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl mb-6">
                <p className="font-black text-xs uppercase tracking-widest opacity-80">Premium Plan</p>
                <p className="text-2xl font-black italic">MONETIZZAZIONE ATTIVA</p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
