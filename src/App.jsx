import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600 border-t-8 border-blue-600 bg-blue-50' : 'text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.15)] h-[110px] pb-[env(safe-area-inset-bottom)] flex items-stretch">
      <Link to="/" className={`flex-1 flex items-center justify-center transition-all ${active('/')}`}>
        <span className="text-[22px] font-black uppercase italic">Home</span>
      </Link>
      <Link to="/garage" className={`flex-1 flex items-center justify-center border-x border-gray-100 transition-all ${active('/garage')}`}>
        <span className="text-[22px] font-black uppercase italic">Garage</span>
      </Link>
      <Link to="/profile" className={`flex-1 flex items-center justify-center transition-all ${active('/profile')}`}>
        <span className="text-[22px] font-black uppercase italic">Profilo</span>
      </Link>
    </nav>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [v, setV] = useState([]);

  useEffect(() => { if(isAuth) supabase.from('vehicles').select('*').then(({data}) => setV(data || [])); }, [isAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={!isAuth ? (
            <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl text-white text-6xl font-black italic">C</div>
              <h1 className="text-4xl font-black mb-10 text-gray-900">CareAutoPro</h1>
              <button onClick={() => setIsAuth(true)} className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-xl uppercase">Accedi</button>
            </div>
          ) : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">Dashboard</h1>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black mb-4 uppercase text-gray-400">Statistiche</h2>
                <p className="text-gray-700 font-bold text-xl">Qui vedrai le statistiche dei tuoi veicoli.</p>
              </div>
            </div>
          ) : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-5xl font-black italic uppercase mb-8 tracking-tighter">Garage</h1>
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl mb-8 flex justify-between items-center">
                <span className="font-black text-2xl">PREMIUM</span>
                <span className="text-xs font-black bg-white text-blue-600 px-4 py-1 rounded-full uppercase">Monetizza</span>
              </div>
              {v.map(car => <div key={car.id} className="bg-white p-6 rounded-3xl mb-4 shadow-sm border font-black text-2xl italic uppercase">{car.model}</div>)}
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
