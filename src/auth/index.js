import { createClient } from '@supabase/supabase-js';
import { GoogleAuthProvider, FacebookAuthProvider, AppleAuthProvider } from 'firebase/auth';
const supabase = createClient('https://jamttxwhexlvbkjccrqm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs');
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new AppleAuthProvider();
