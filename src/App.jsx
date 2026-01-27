import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
const Login = ({ onLogin }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-white">
    <h1 className="text-4xl font-black mb-8 text-blue-600">CareAutoPro</h1>
    <button onClick={onLogin} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase">Accedi</button>
  </div>
);
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-black uppercase italic">Dashboard</h1>
    <div className="mt-4 p-8 bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 text-center text-gray-400">Bentornato! Qui vedrai i tuoi dati.</div>
  </div>
);
export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={!isAuth ? <Login onLogin={() => setIsAuth(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
        {isAuth && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 flex items-center justify-around pb-6 shadow-2xl">
            <div className="text-blue-600 font-bold">HOME</div>
            <div className="text-gray-400 font-bold">GARAGE</div>
            <div className="text-gray-400 font-bold">PROFILO</div>
          </nav>
        )}
      </div>
    </Router>
  );
}
