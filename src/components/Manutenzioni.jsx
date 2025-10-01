//src/components/Manutenzioni.jsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const Manutenzioni = () => {
  const [manutenzioni, setManutenzioni] = useState([])
  const [veicoli, setVeicoli] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    veicolo_id: '',
    tipo_manutenzione: '',
    descrizione: '',
    data_manutenzione: '',
    costo: '',
    prossima_scadenza: ''
  })

  useEffect(() => {
    fetchManutenzioni()
    fetchVeicoli()
  }, [])

  const fetchManutenzioni = async () => {
    try {
      const { data, error } = await supabase
        .from('manutenzioni')
        .select(`
          *,
          veicoli (marca, modello, targa)
        `)
        .order('data_manutenzione', { ascending: false })

      if (error) throw error
      setManutenzioni(data || [])
    } catch (error) {
      console.error('Errore nel caricamento manutenzioni:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVeicoli = async () => {
    try {
      const { data, error } = await supabase
        .from('veicoli')
        .select('*')
        .order('marca')

      if (error) throw error
      setVeicoli(data || [])
    } catch (error) {
      console.error('Errore nel caricamento veicoli:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('manutenzioni')
        .insert([{ ...formData }])

      if (error) throw error

      setFormData({
        veicolo_id: '',
        tipo_manutenzione: '',
        descrizione: '',
        data_manutenzione: '',
        costo: '',
        prossima_scadenza: ''
      })
      setShowForm(false)
      fetchManutenzioni()
    } catch (error) {
      console.error('Errore nell\'aggiunta manutenzione:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa manutenzione?')) return

    try {
      const { error } = await supabase
        .from('manutenzioni')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchManutenzioni()
    } catch (error) {
      console.error('Errore nell\'eliminazione manutenzione:', error)
    }
  }

  if (loading) return <div className="text-center py-8">Caricamento...</div>

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Gestione Manutenzioni</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Nuova Manutenzione
        </button>
      </div>

      {/* Form Aggiunta Manutenzione */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Nuova Manutenzione</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Veicolo</label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.veicolo_id}
                  onChange={(e) => setFormData({ ...formData, veicolo_id: e.target.value })}
                >
                  <option value="">Seleziona veicolo</option>
                  {veicoli.map((veicolo) => (
                    <option key={veicolo.id} value={veicolo.id}>
                      {veicolo.marca} {veicolo.modello} - {veicolo.targa}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo Manutenzione</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tipo_manutenzione}
                  onChange={(e) => setFormData({ ...formData, tipo_manutenzione: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data Manutenzione</label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.data_manutenzione}
                  onChange={(e) => setFormData({ ...formData, data_manutenzione: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Costo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prossima Scadenza</label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.prossima_scadenza}
                  onChange={(e) => setFormData({ ...formData, prossima_scadenza: e.target.value })}
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

      {/* Lista Manutenzioni */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {manutenzioni.map((manutenzione) => (
            <li key={manutenzione.id}>
              <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {manutenzione.tipo_manutenzione}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(manutenzione.data_manutenzione).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{manutenzione.descrizione}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4">🚗 {manutenzione.veicoli?.marca} {manutenzione.veicoli?.modello}</span>
                    <span className="mr-4">💰 €{manutenzione.costo}</span>
                    {manutenzione.prossima_scadenza && (
                      <span>⏰ Scade: {new Date(manutenzione.prossima_scadenza).toLocaleDateString('it-IT')}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(manutenzione.id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
        {manutenzioni.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nessuna manutenzione trovata. Aggiungi la prima manutenzione.
          </div>
        )}
      </div>
    </div>
  )
}

export default Manutenzioni
```

10. COMPONENTE: src/components/Profile.jsx

```javascript
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Profilo</h1>
      
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informazioni Account
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ID Utente</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                {user?.id}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ultimo Accesso</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.last_sign_in_at ? 
                  new Date(user.last_sign_in_at).toLocaleString('it-IT') : 
                  'Non disponibile'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">💡</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Informazioni
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Queste informazioni sono gestite tramite Supabase Authentication.
                Per modificare il tuo profilo, contatta l'amministratore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
