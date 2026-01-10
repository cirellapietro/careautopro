import React from 'react'

export default function Dashboard() {
  return (
    <div className="p-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">📊 Statistiche</h2>
        <p className="text-gray-600">Qui vedrai le statistiche dei tuoi veicoli.</p>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">🚗 Veicolo attivo</h2>
        <p className="text-gray-600">Nessun veicolo selezionato.</p>
      </div>
    </div>
  )
}