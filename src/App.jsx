// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Veicoli from './components/Veicoli'
import Manutenzioni from './components/Manutenzioni'
import Profile from './components/Profile'
import GpsTracking from './components/GpsTracking'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/veicoli" element={<Veicoli />} />
                      <Route path="/manutenzioni" element={<Manutenzioni />} />
                      <Route path="/gps-tracking" element={<GpsTracking />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
