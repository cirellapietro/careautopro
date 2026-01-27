import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, Zap, CreditCard } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600 scale-110' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] px-2 h-[96px] sm:h-[110px] md:h-[120px] pb-[env(safe-area-inset-bottom)] flex items-center">
      <div className="flex w-full h-full justify-around items-center">
        <Link to="/" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/')}`}>
          <LayoutDashboard className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" strokeWidth={2.5} />
          <span className="mt-2 text-[11px] sm:text-[13px] font-black uppercase">Dashboard</span>
        </Link>
        <Link to="/garage" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/garage')}`}>
          <Car className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" strokeWidth={2.5} />
          <span className="mt-2 text-[11px] sm:text-[13px] font-black uppercase">Garage</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/profile')}`}>
          <User className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12" strokeWidth={2.5} />
          <span className="mt-2 text-[11px] sm:text-[13px] font-black uppercase">Profilo</span>
        </Link>
      </div>
    </nav>
  );
};

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    supabase.from('vehicles').select('*').then(({ data }) => setVehicles(data || []));
  }, []);
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-[2rem] text-white shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-black text-xs uppercase opacity-80">Piano Pro</p>
            <p className="text-xl font-black">MONETIZZAZIONE</p>
          </div>
          <Zap fill="currentColor" />
        </div>
      </div>
      {vehicles.map(v => (
        <div key={v.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center">
          <div><h3 className="text-2xl font-black">{v.model}</h3><p className="text-gray-400 font-mono font-bold uppercase">{v.plate}</p></div>
        </div>
      ))}
      {vehicles.length === 0 && <div className="p-10 border-2 border-dashed border-gray-200 rounded-[2rem] text-center text-gray-400 font-black">IL TUO GARAGE È VUOTO</div>}
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 antialiased">
        <Routes>
          <Route path="/login" element={!isAuth ? (
            <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl text-white text-5xl font-black">C</div>
              <h1 className="text-4xl font-black mb-2 text-gray-900">CareAutoPro</h1>
              <p className="text-gray-500 mb-10 font-bold text-center">Accedi per gestire i tuoi veicoli </p>
              <button onClick={() => setIsAuth(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg uppercase">Accedi</button>
            </div>
          ) : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? (
            <div className="p-8 pt-16 pb-48 text-gray-900">
              <h1 className="text-5xl font-black italic uppercase mb-8">Dashboard </h1>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-black mb-4 uppercase text-gray-400">Statistiche </h2>
                <p className="text-gray-600 font-bold text-lg">Qui vedrai le statistiche dei tuoi veicoli. </p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? <div className="p-8 pt-16 pb-48"><h1 className="text-5xl font-black italic uppercase mb-8">Garage</h1><Garage /></div> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8">Profilo</h1>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
                <CreditCard size={32} className="text-blue-600" />
                <p className="font-black text-xl uppercase">Abbonamento Attivo</p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
