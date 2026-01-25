import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Car, User, LogOut, Plus, AlertTriangle } from 'lucide-react';

// Gestore errori globale per vedere i crash su schermo
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fff5f5', color: '#c53030', height: '100vh' }}>
          <AlertTriangle size={48} />
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Errore di Caricamento</h1>
          <pre style={{ fontSize: '12px', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px', background: '#c53030', color: '#fff', border: 'none', borderRadius: '5px' }}>
            Ricarica App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL || '', import.meta.env.VITE_SUPABASE_ANON_KEY || '');

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
    </nav>
  );
};

const Dashboard = () => (
  <div className="p-4 bg-gray-50 min-h-screen">
    <h1 className="text-xl font-bold mb-4">CareAutoPro - Pronto</h1>
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <p className="text-blue-600">Se vedi questo, l'app funziona correttamente!</p>
    </div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="max-w-md mx-auto min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<><Dashboard /><BottomNav /></>} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}
