import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, Settings, AlertCircle } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const loc = useLocation();
  const isActive = (p) => loc.pathname === p ? 'text-blue-600' : 'text-gray-500';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex items-center justify-around pb-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <Link to="/" className={`flex flex-col items-center flex-1 ${isActive('/')}`}>
        <LayoutDashboard size={28} strokeWidth={2.5} />
        <span className="text-xs mt-1 font-bold uppercase tracking-tighter">Home</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center flex-1 ${isActive('/garage')}`}>
        <Car size={28} strokeWidth={2.5} />
        <span className="text-xs mt-1 font-bold uppercase tracking-tighter">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center flex-1 ${isActive('/profile')}`}>
        <User size={28} strokeWidth={2.5} />
        <span className="text-xs mt-1 font-bold uppercase tracking-tighter">Profilo</span>
      </Link>
    </nav>
  );
};

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (error) console.error("Errore DB:", error);
      else setVehicles(data || []);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-gray-800">CareAutoPro</h1>
        <p className="text-sm text-gray-500">Stato del tuo parco auto</p>
      </header>

      {loading ? (
        <div className="animate-pulse flex space-x-4 bg-white p-4 rounded-xl border">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">
          <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500 font-medium">Nessun veicolo trovato.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg">{v.model}</h3>
              <p className="text-gray-500 text-sm">{v.plate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative">
        <Routes>
          <Route path="/" element={<><Dashboard /><BottomNav /></>} />
          <Route path="/garage" element={<><div className="p-6"><h2>Garage</h2></div><BottomNav /></>} />
          <Route path="/profile" element={<><div className="p-6"><h2>Profilo</h2></div><BottomNav /></>} />
        </Routes>
      </div>
    </Router>
  );
}
