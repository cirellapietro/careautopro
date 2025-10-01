//src/components/Dashboard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const stats = [
    { name: 'Veicoli Totali', value: '12', href: '/veicoli', icon: '🚗' },
    { name: 'Manutenzioni in Corso', value: '3', href: '/manutenzioni', icon: '🔧' },
    { name: 'Scadenze Prossime', value: '2', href: '/manutenzioni', icon: '⏰' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Statistiche */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-2xl">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Azioni Rapide */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Azioni Rapide</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/veicoli"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-shrink-0 text-2xl">🚗</div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Gestisci Veicoli</p>
              <p className="truncate text-sm text-gray-500">Aggiungi o modifica veicoli</p>
            </div>
          </Link>
          
          <Link
            to="/manutenzioni"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
          >
            <div className="flex-shrink-0 text-2xl">🔧</div>
            <div className="min-w-0 flex-1">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Gestisci Manutenzioni</p>
              <p className="truncate text-sm text-gray-500">Programma interventi</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
