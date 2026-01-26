import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, Bluetooth, Play } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// --- COMPONENTI PAGINA ---

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-black italic text-blue-900">DASHBOARD</h1>
    <div className="mt-6 bg-blue-100 p-4 rounded-2xl border-2 border-blue-200">
      <div className="flex items-center gap-3 text-blue-800 font-bold">
        <Bluetooth size={20} /> 
        <span>Scansione Bluetooth attiva...</span>
      </div>
    </div>
  </div>
);

const Garage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error) setVehicles(data);
      setLoading(false);
    };
    fetchCars();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black italic text-gray-800">IL TUO GARAGE</h1>
      {loading ? <p className="mt-4 animate-pulse">Caricamento veicoli...</p> : (
        <div className="mt-6 grid gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-600 flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg uppercase">{v.model}</h3>
                <p className="text-gray-500 font-mono">{v.plate}</p>
              </div>
              <button className="bg-blue-600 p-3 rounded-full text-white shadow-lg"><Play size={20} /></button>
            </div>
          ))}
          {vehicles.length === 0 && <p className="text-gray-400">Nessun veicolo registrato.</p>}
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="p-6 text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 border-4 border-white shadow-lg flex items-center justify-center">
        <User size={50} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-black uppercase">{user?.email || 'Utente'}</h1>
      <p className="text-gray-500 mb-6">Membro CareAutoPro</p>
      <button className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl border-2 border-red-100 uppercase tracking-widest">Disconnetti</button>
    </div>
  );
};

// --- NAVIGAZIONE E APP ---

const BottomNav = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? 'text-blue-600 scale-110' : 'text-gray-400';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 flex items-center justify-around pb-6 z-50 shadow-2xl">
      <Link to="/" className={`flex flex-col items-center transition-all ${active('/')}`}><LayoutDashboard size={28} /><span className="text-[10px] font-black mt-1 uppercase">Home</span></Link>
      <Link to="/garage" className={`flex flex-col items-center transition-all ${active('/garage')}`}><Car size={28} /><span className="text-[10px] font-black mt-1 uppercase">Garage</span></Link>
      <Link to="/profile" className={`flex flex-col items-center transition-all ${active('/profile')}`}><User size={28} /><span className="text-[10px] font-black mt-1 uppercase">Profilo</span></Link>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-24 font-sans antialiased">
        <Routes>
          <Route path="/" element={<><Dashboard /><BottomNav /></>} />
          <Route path="/garage" element={<><Garage /><BottomNav /></>} />
          <Route path="/profile" element={<><Profile /><BottomNav /></>} />
        </Routes>
      </div>
    </Router>
  );
}
