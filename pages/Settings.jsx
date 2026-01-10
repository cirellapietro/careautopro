import React from 'react'
import { Bell, Shield, Globe } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-4 pt-20 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Impostazioni</h1>
      
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-3">
            <Bell className="h-5 w-5 text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold">Notifiche</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Notifiche push</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-3">
            <Shield className="h-5 w-5 text-green-600 mr-3" />
            <h2 className="text-lg font-semibold">Privacy GPS</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Consenso tracking GPS</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center mb-3">
            <Globe className="h-5 w-5 text-purple-600 mr-3" />
            <h2 className="text-lg font-semibold">Lingua</h2>
          </div>
          <select className="w-full p-3 border border-gray-300 rounded-lg">
            <option>Italiano</option>
            <option>English</option>
            <option>Español</option>
          </select>
        </div>
      </div>
    </div>
  )
}
