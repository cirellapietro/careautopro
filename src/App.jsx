import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, CreditCard } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const Login = ({ onLogin }) => (
  <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white text-center">
    <h1 className="text-5xl font-black mb-2 text-blue-700 italic tracking-tighter">CareAutoPro</h1>
    <p className="text-gray-400 mb-12 font-bold uppercase text-xs tracking-widest">Premium Fleet Management</p>
    <button onClick={onLogin} className="w-full py-6 bg-blue-700 text-white rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all uppercase">Inizia Ora</button>
  </div>
);

const PageLayout = ({ title, children }) => (
  <div className="p-6 pt-12 min-h-screen bg-gray-50 pb-40">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl font-black italic text-gray-900 uppercase tracking-tighter leading-none">{title}</h1>
        <div className="h-1.5 w-16 bg-blue-600 mt-2 rounded-full"></div>
      </div>
      <CreditCard className="text-blue-200" size={32} />
    </div>
    {children}
  </div>
);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600' : 'text-gray-300';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white h-28 flex items-center justify-around pb-10 px-6 z-50 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] border-t border-gray-100">
      <Link to="/" className={`flex flex-col items-center flex-1 ${active('/')}`}>
        <LayoutDashboard size={38} strokeWidth={2.5} />
        <span className="text-[12px] font-black mt-1 uppercase tracking-wider">Home</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${active('/garage')}`}>
        <Car size={38} strokeWidth={2.5} />
        <span className="text-[12px] font-black mt-1 uppercase tracking-wider">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${active('/profile')}`}>
        <User size={38} strokeWidth={2.5} />
        <span className="text-[12px] font-black mt-1 uppercase tracking-wider">Profilo</span>
      </Link>
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
      {vehicles.length > 0 ? vehicles.map(v => (
        <div key={v.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div><h3 className="text-xl font-black">{v.model}</h3><p className="text-gray-400 font-mono text-sm uppercase">{v.plate}</p></div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl font-black text-xs">ATTIVO</div>
        </div>
      )) : <div className="p-10 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400 font-bold">Nessun veicolo nel garage</div>}
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 antialiased">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? <PageLayout title="Dashboard"><div className="bg-blue-700 p-8 rounded-[2rem] text-white shadow-xl italic font-black text-2xl">BENTORNATO!</div></PageLayout> : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? <PageLayout title="Garage"><Garage /></PageLayout> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? <PageLayout title="Profilo"><div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 font-bold text-gray-400 text-center">Versione Premium 1.0</div></PageLayout> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
