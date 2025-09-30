//src/components/Veicoli.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const Veicoli = () => {
  const [veicoli, setVeicoli] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    marca: '',
    modello: '',
    targa: '',
    anno_immatricolazione: '',
    chilometraggio: ''
  })

  useEffect(() => {
    fetchVeicoli()
  }, [])

  const fetchVeicoli = async () => {
    try {
      const { data, error } = await supabase
        .from('veicoli')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVeicoli(data || [])
    } catch (error) {
      console.error('Errore nel caricamento veicoli:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('veicoli')
        .insert([{ ...formData }])

      if (error) throw error

      setFormData({
        marca: '',
        modello: '',
        targa: '',
        anno_immatricolazione: '',
        chilometraggio: ''
      })
      setShowForm(false)
      fetchVeicoli()
    } catch (error) {
      console.error('Errore nell\'aggiunta veicolo:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo veicolo?')) return

    try {
      const { error } = await supabase
        .from('veicoli')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchVeicoli()
    } catch (error) {
      console.error('Errore nell\'eliminazione veicolo:', error)
    }
  }

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestione Veicoli</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Aggiungi Veicolo
        </button>
      </div>

      {/* Form Aggiunta Veicolo */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Aggiungi Nuovo Veicolo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Marca</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Modello</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.modello}
                  onChange={(e) => setFormData({ ...formData, modello: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Targa</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.targa}
                  onChange={(e) => setFormData({ ...formData, targa: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Anno Immatricolazione</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.anno_immatricolazione}
                  onChange={(e) => setFormData({ ...formData, anno_immatricolazione: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Chilometraggio</label>
                <input
                  type="number"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.chilometraggio}
                  onChange={(e) => setFormData({ ...formData, chilometraggio: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Salva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista Veicoli */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {veicoli.map((veicolo) => (
            <li key={veicolo.id}>
              <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🚗</div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {veicolo.marca} {veicolo.modello}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Targa: {veicolo.targa} | Anno: {veicolo.anno_immatricolazione} | KM: {veicolo.chilometraggio}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(veicolo.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
        {veicoli.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessun veicolo trovato. Aggiungi il primo veicolo.
          </div>
        )}
      </div>
    </div>
  )
}

export default Veicoli