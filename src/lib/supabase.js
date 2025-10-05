// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Debug delle variabili d'ambiente
console.log('=== DEBUG ENV VARIABLES ===')
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENTE' : 'MANCANTE')
console.log('===========================')

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variabili d\'ambiente Supabase mancanti')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
