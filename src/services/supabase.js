import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  if (error) throw error
}

export const signInWithFacebook = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  })
  if (error) throw error
}

// Apple login rimosso per ora (richiede account developer a pagamento)
// export const signInWithApple = async () => {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: 'apple',
//     options: {
//       redirectTo: `${window.location.origin}/dashboard`
//     }
//   })
//   if (error) throw error
// }

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
