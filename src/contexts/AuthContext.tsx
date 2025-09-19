import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    
    // Se la registrazione ha successo, inserisci l'utente nella tabella Utenti come generico
    if (!error && data.user) {
      try {
        console.log('🔄 Registrazione utente completata, creazione profilo in corso...', {
          userId: data.user.id,
          email: data.user.email
        });

        // Ottieni l'ID del profilo generico e dello stato attivo
        const [profileResult, statusResult] = await Promise.all([
          supabase.from('UtentiProfilo').select('profiloutente_id').eq('profiloutente', 'generico').single(),
          supabase.from('UtentiStato').select('utentestato_id').eq('statoutente', 'attivo').single()
        ]);

        console.log('📋 Risultati query profilo e stato:', {
          profileResult,
          statusResult
        });

        if (profileResult.data && statusResult.data) {
          // Inserisci il nuovo utente nella tabella Utenti
          const insertResult = await supabase.from('Utenti').insert({
            utente_id: data.user.id,
            nomeutente: metadata?.username || email.split('@')[0],
            email: email,
            profiloutente_id: profileResult.data.profiloutente_id,
            statoutente_id: statusResult.data.utentestato_id
          });

          console.log('✅ Utente inserito nella tabella Utenti:', insertResult);
          
          if (insertResult.error) {
            console.error('❌ Errore nell\'inserimento dell\'utente:', insertResult.error);
          }
        } else {
          console.error('❌ Profilo generico o stato attivo non trovati:', {
            profile: profileResult,
            status: statusResult
          });
        }
      } catch (insertError) {
        console.error('❌ Errore durante l\'inserimento dell\'utente:', insertError);
      }
    }
    
    setLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { error };
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    setLoading(false);
    return { error };
  };

  const signInWithFacebook = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};