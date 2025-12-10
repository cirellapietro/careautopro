q// Fallback environment configuration
export const envConfig = {
  supabase: {
    url: 'https://jamttxwhexlvbkjccrqm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs'
  },
  app: {
    name: 'CareAutoPro',
    version: '1.0.0'
  }
};

// Use this in supabase.js as fallback
export const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || envConfig.supabase.url;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || envConfig.supabase.anonKey;
  return { url, key };
};