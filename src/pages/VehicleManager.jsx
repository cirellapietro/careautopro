import React, { useState } from 'react'
import { Plus, Car, Edit2, Trash2 } from 'lucide-react'

export default function VehicleManager() {
  const [vehicles] = useState([
    { id: 1, name: 'Fiat Panda', plate: 'AB123CD', km: 125430 },
    { id: 2, name: 'Ford Focus', plate: 'EF456GH', km: 89210 },
  ])

  return (
    <div className="p-4 pt-20 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">I tuoi veicoli</h1>
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">Targa: {vehicle.plate}</p>
                <p className="text-sm text-gray-600">KM: {vehicle.km.toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aggiungi nuovo veicolo</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome veicolo"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Targa"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="number"
            placeholder="KM attuali"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg">
            Salva veicolo
          </button>
        </div>
      </div>
    </div>
  )
}