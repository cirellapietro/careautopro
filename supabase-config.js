// supabase-config.js
// Configurazione del client Supabase per il frontend

const SUPABASE_URL = 'https://jamttxwhexlvbkjccrqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs';

// Crea e esporta il client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Per uso nei tuoi file JS
window.supabaseClient = supabase;
console.log('Supabase client configurato con URL:', SUPABASE_URL);
