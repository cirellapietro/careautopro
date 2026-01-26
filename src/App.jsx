import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, Bluetooth } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600' : 'text-gray-400';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 flex items-center justify-around pb-6 z-[100] shadow-2xl">
      <Link to="/" className={`flex flex-col items-center flex-1 ${active('/')}`}>
        <LayoutDashboard size={26} /><span className="text-[10px] font-black mt-1 uppercase">Home</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${active('/garage')}`}>
        <Car size={26} /><span className="text-[10px] font-black mt-1 uppercase">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${active('/profile')}`}>
        <User size={26} /><span className="text-[10px] font-black mt-1 uppercase">Profilo</span>
      </Link>
    </nav>
  );
};

const PageWrapper = ({ children, title }) => (
  <div className="p-6 pb-32">
    <h1 className="text-3xl font-black italic text-gray-800 uppercase mb-6">{title}</h1>
    {children}
  </div>
);

const Dashboard = () => (
  <PageWrapper title="Dashboard">
    <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl">
      <div className="flex items-center gap-3 font-bold mb-2">
        <Bluetooth className="animate-pulse" />
        <span>RICERCA BLUETOOTH...</span>
      </div>
      <p className="text-sm opacity-80">L'app cercherà il veicolo associato per avviare il tracciamento.</p>
    </div>
  </PageWrapper>
);

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    supabase.from('vehicles').select('*').then(({ data }) => setVehicles(data || []));
  }, []);

  return (
    <PageWrapper title="Garage">
      <div className="grid gap-4">
        {vehicles.length > 0 ? vehicles.map(v => (
          <div key={v.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-black text-xl">{v.model}</h3>
            <p className="text-gray-400 font-mono">{v.plate}</p>
          </div>
        )) : <div className="text-gray-400 border-2 border-dashed p-10 rounded-2xl text-center">Nessun veicolo configurato</div>}
      </div>
    </PageWrapper>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 relative">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/profile" element={<PageWrapper title="Profilo"><p>Dati utente...</p></PageWrapper>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
