import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, LogOut, Plus } from 'lucide-react';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BottomNav = () => {
  const loc = useLocation();
  const active = (p) => loc.pathname === p ? 'text-blue-600' : 'text-gray-400';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around pb-safe z-50">
      <Link to="/" className={`flex flex-col items-center ${active('/')}`}>
        <LayoutDashboard size={22} /><span className="text-[10px] mt-1 font-bold">Dashboard</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center ${active('/garage')}`}>
        <Car size={22} /><span className="text-[10px] mt-1 font-bold">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${active('/profile')}`}>
        <User size={22} /><span className="text-[10px] mt-1 font-bold">Profilo</span>
      </Link>
      <button onClick={() => supabase.auth.signOut()} className="flex flex-col items-center text-gray-400">
        <LogOut size={22} /><span className="text-[10px] mt-1 font-bold">Esci</span>
      </button>
    </nav>
  );
};

const Dashboard = ({ user }) => (
  <div className="p-4 bg-gray-50 min-h-screen">
    <h1 className="text-xl font-bold mb-4 text-gray-800">CareAutoPro</h1>
    <div className="bg-white border rounded-lg p-5 shadow-sm mb-4">
      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
      <p className="font-medium text-blue-600">Sistema Online</p>
    </div>
    <button className="fixed right-6 bottom-24 bg-blue-600 text-white p-4 rounded-full shadow-lg"><Plus size={24} /></button>
  </div>
);

const Login = () => {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const handleLogin = async (x) => {
    x.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: e, password: p });
    if (error) alert(error.message);
  };
  return (
    <div className="min-h-screen flex flex-col justify-center p-8 bg-white">
      <h2 className="text-3xl font-black mb-8 leading-tight">CareAutoPro</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-xl" onChange={v => setE(v.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 border rounded-xl" onChange={v => setP(v.target.value)} />
        <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Accedi</button>
      </form>
    </div>
  );
};

export default function App() {
  const [s, setS] = useState(null);
  const [l, setL] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setS(session); setL(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setS(session));
    return () => subscription.unsubscribe();
  }, []);
  if (l) return null;
  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen">
        <Routes>
          <Route path="/login" element={!s ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={s ? <><Dashboard user={s.user} /><BottomNav /></> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
