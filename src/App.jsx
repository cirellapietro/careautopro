import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, CreditCard, Zap } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const Login = ({ onLogin }) => (
  <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-white text-center">
    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
      <span className="text-white text-5xl font-black">C</span>
    </div>
    <h1 className="text-4xl font-black mb-2 text-gray-900">CareAutoPro</h1>
    <p className="text-gray-500 mb-10 font-medium">Accedi per gestire i tuoi veicoli</p>
    <div className="w-full space-y-4 mb-8">
      <input type="email" placeholder="Email" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition-all" />
      <input type="password" placeholder="Password" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition-all" />
    </div>
    <button onClick={onLogin} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all uppercase">Accedi</button>
  </div>
);

const PageLayout = ({ title, children }) => (
  <div className="p-6 pt-12 min-h-screen bg-gray-50 pb-44">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
      <div className="bg-yellow-400 p-2 rounded-xl shadow-sm"><Zap size={24} className="text-white" fill="currentColor" /></div>
    </div>
    {children}
  </div>
);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600' : 'text-gray-300';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white h-32 flex items-center justify-around pb-12 px-6 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] border-t border-gray-100">
      <Link to="/" className={`flex flex-col items-center flex-1 transition-all ${active('/')}`}>
        <LayoutDashboard size={44} strokeWidth={2.5} />
        <span className="text-[13px] font-black mt-2 uppercase tracking-tighter">Dashboard</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 transition-all ${active('/garage')}`}>
        <Car size={44} strokeWidth={2.5} />
        <span className="text-[13px] font-black mt-2 uppercase tracking-tighter">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 transition-all ${active('/profile')}`}>
        <User size={44} strokeWidth={2.5} />
        <span className="text-[13px] font-black mt-2 uppercase tracking-tighter">Profilo</span>
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
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl mb-4">
        <p className="text-blue-600 font-black text-sm uppercase">Upgrade Premium</p>
        <p className="text-blue-800 text-lg font-bold">Sblocca veicoli illimitati</p>
      </div>
      {vehicles.map(v => (
        <div key={v.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900">{v.model}</h3>
          <p className="text-gray-400 font-mono text-sm uppercase font-bold tracking-widest">{v.plate}</p>
        </div>
      ))}
      {vehicles.length === 0 && <div className="p-12 border-2 border-dashed border-gray-200 rounded-[2rem] text-center text-gray-400 font-black uppercase italic">Garage Vuoto</div>}
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 antialiased selection:bg-blue-100">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? <PageLayout title="Dashboard">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-black mb-4 uppercase text-gray-400 tracking-tighter">Statistiche</h2>
              <p className="text-gray-600 font-bold">Qui vedrai le statistiche dei tuoi veicoli.</p>
            </div>
          </PageLayout> : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? <PageLayout title="Garage"><Garage /></PageLayout> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? <PageLayout title="Profilo">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"><User size={32} /></div>
                <div><p className="font-black text-2xl uppercase tracking-tighter">Premium User</p><p className="opacity-70 font-bold">Abbonamento Attivo</p></div>
              </div>
              <button className="w-full py-4 bg-white text-blue-700 rounded-2xl font-black uppercase tracking-widest shadow-lg">Gestisci Piano</button>
            </div>
          </PageLayout> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
