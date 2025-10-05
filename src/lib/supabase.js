// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Debug delle variabili d'ambiente
console.log('=== DEBUG ENV VARIABLES ===')
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE')
console.log('REACT_APP_SUPABASE_URL:', import.meta.env.REACT_APP_SUPABASE_URL)
console.log('REACT_APP_SUPABASE_ANON_KEY:', import.meta.env.REACT_APP_SUPABASE_ANON_KEY)
console.log('===========================')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Mancano le variabili d\'ambiente Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
