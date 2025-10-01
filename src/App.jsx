src/App.jsx

```javascript
// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Veicoli from './components/Veicoli'
import Manutenzioni from './components/Manutenzioni'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/veicoli" 
              element={
                <ProtectedRoute>
                  <Veicoli />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manutenzioni" 
              element={
                <ProtectedRoute>
                  <Manutenzioni />
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
