import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] h-[100px] pb-[env(safe-area-inset-bottom)] flex items-center">
      <div className="flex w-full h-full justify-around items-center px-4">
        <Link to="/" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/')}`}>
          <span className="text-[18px] font-black uppercase tracking-tighter">Dashboard</span>
        </Link>
        <Link to="/garage" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/garage')}`}>
          <span className="text-[18px] font-black uppercase tracking-tighter">Garage</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${active('/profile')}`}>
          <span className="text-[18px] font-black uppercase tracking-tighter">Profilo</span>
        </Link>
      </div>
    </nav>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (isAuth) {
      supabase.from('vehicles').select('*').then(({ data }) => setVehicles(data || []));
    }
  }, [isAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 antialiased font-sans">
        <Routes>
          <Route path="/login" element={!isAuth ? (
            <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl text-white text-5xl font-black italic">C</div>
              <h1 className="text-4xl font-black mb-2 text-gray-900">CareAutoPro</h1>
              <p className="text-gray-500 mb-10 font-bold text-center">Accedi per gestire i tuoi veicoli</p>
              <button onClick={() => setIsAuth(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg uppercase">Accedi</button>
            </div>
          ) : <Navigate to="/" />} />

          <Route path="/" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">Dashboard</h1>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-black mb-4 uppercase text-gray-400">Statistiche</h2>
                <p className="text-gray-600 font-bold text-lg">Qui vedrai le statistiche dei tuoi veicoli.</p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />

          <Route path="/garage" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">Garage</h1>
              <div className="space-y-4">
                <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-lg mb-6 flex justify-between items-center">
                   <span className="font-black italic text-xl">UPGRADE PREMIUM</span>
                   <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-black">MONETIZZA</span>
                </div>
                {vehicles.map(v => (
                  <div key={v.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 font-black text-2xl uppercase italic">{v.model}</div>
                ))}
                {vehicles.length === 0 && <div className="p-10 border-2 border-dashed border-gray-200 rounded-[2rem] text-center text-gray-400 font-black italic uppercase">Garage Vuoto</div>}
              </div>
            </div>
          ) : <Navigate to="/login" />} />

          <Route path="/profile" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">Profilo</h1>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center font-black text-xl uppercase italic text-blue-600">Gestione Abbonamento</div>
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
