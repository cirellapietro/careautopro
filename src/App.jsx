import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, User } from 'lucide-react';

const Login = ({ onLogin }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 className="text-4xl font-black mb-2 text-blue-600 italic">CareAutoPro</h1>
    <p className="text-gray-400 mb-8 font-medium">Gestione flotta intelligente</p>
    <button onClick={onLogin} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Entra nell'App</button>
  </div>
);

const PageLayout = ({ title, children }) => (
  <div className="p-6 pt-10 min-h-screen bg-gray-50 pb-32">
    <h1 className="text-4xl font-black italic text-gray-900 mb-2 uppercase tracking-tighter">{title}</h1>
    <div className="h-1 w-20 bg-blue-600 mb-8 rounded-full"></div>
    {children}
  </div>
);

const BottomNav = () => {
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? 'text-blue-600 scale-110' : 'text-gray-400';
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 h-24 flex items-center justify-around pb-8 px-4 z-50 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center transition-all ${active('/')}`}>
        <LayoutDashboard size={32} strokeWidth={2.5} />
        <span className="text-[11px] font-black mt-1 uppercase">Home</span>
      </Link>
      <Link to="/garage" className={`flex flex-col items-center transition-all ${active('/garage')}`}>
        <Car size={32} strokeWidth={2.5} />
        <span className="text-[11px] font-black mt-1 uppercase">Garage</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center transition-all ${active('/profile')}`}>
        <User size={32} strokeWidth={2.5} />
        <span className="text-[11px] font-black mt-1 uppercase">Profilo</span>
      </Link>
    </nav>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 selection:bg-blue-100">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? <PageLayout title="Dashboard"><div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"><p className="text-gray-500 font-bold">Nessuna attività recente</p></div></PageLayout> : <Navigate to="/login" />} />
          <Route path="/garage" element={isAuth ? <PageLayout title="Garage"><div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"><p className="text-gray-500 font-bold">Il tuo garage è vuoto</p></div></PageLayout> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? <PageLayout title="Profilo"><div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"><p className="text-gray-500 font-bold">Impostazioni account</p></div></PageLayout> : <Navigate to="/login" />} />
        </Routes>
        {isAuth && <BottomNav />}
      </div>
    </Router>
  );
}
