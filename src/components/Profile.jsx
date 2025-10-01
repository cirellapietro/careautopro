//src/components/Profile.jsx
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