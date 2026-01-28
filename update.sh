#!/bin/bash
cat << 'APP' > src/App.jsx
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500';
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[110px] bg-white border-t-4 border-gray-200 flex items-stretch">
      <Link to="/" className={`flex-1 flex items-center justify-center transition-all ${active('/')}`}>
        <span className="text-[22px] font-black uppercase italic text-center">HOME</span>
      </Link>
      <Link to="/garage" className={`flex-1 flex items-center justify-center border-x-4 border-gray-200 transition-all ${active('/garage')}`}>
        <span className="text-[22px] font-black uppercase italic text-center">GARAGE</span>
      </Link>
      <Link to="/profile" className={`flex-1 flex items-center justify-center transition-all ${active('/profile')}`}>
        <span className="text-[22px] font-black uppercase italic text-center">PROFILO</span>
      </Link>
    </nav>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={!isAuth ? (
            <div className="p-10 flex flex-col items-center justify-center min-h-screen text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 text-white text-5xl font-black italic">C</div>
              <h1 className="text-4xl font-black mb-2 text-gray-900 leading-tight tracking-tighter">CareAutoPro</h1>
              <p className="text-gray-500 mb-8 font-bold uppercase text-xs">Accedi per gestire i tuoi veicoli</p>
              <button onClick={() => setIsAuth(true)} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl uppercase">Accedi</button>
            </div>
          ) : <Navigate to="/" />}
          <Route path="/" element={isAuth ? (
            <div className="p-8 pt-16 pb-48">
              <h1 className="text-6xl font-black italic uppercase mb-8 tracking-tighter">Dashboard</h1>
              <div className="border-t-8 border-blue-600 pt-8">
                <h2 className="text-2xl font-black text-gray-400 uppercase mb-2">Statistiche</h2>
                <p className="text-2xl font-bold text-gray-800">Qui vedrai le statistiche dei tuoi veicoli.</p>
              </div>
            </div>
          ) : <Navigate to="/login" />}
          <Route path="/garage" element={isAuth ? <div className="p-8 pt-16 pb-48"><h1 className="text-6xl font-black italic uppercase mb-8 tracking-tighter">Garage</h1><div className="bg-yellow-400 p-8 rounded-3xl font-black text-xl italic text-center border-4 border-black">PIANO PRO: ATTIVO</div></div> : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
APP
npm run build && npx cap sync android && git add . && git commit -m "🚀 RECOVERY: Layout PDF e Testo Gigante" && git push origin main
