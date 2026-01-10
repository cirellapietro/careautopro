import React from 'react'
import { Home, Car, Settings, MapPin } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/vehicles', icon: Car, label: 'Veicoli' },
    { path: '/tracking', icon: MapPin, label: 'GPS' },
    { path: '/settings', icon: Settings, label: 'Impostazioni' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-500'}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
