import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://jamttxwhexlvbkjccrqm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbXR0eHdoZXhsdmJramNjcnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTE5MDIsImV4cCI6MjA2OTIyNzkwMn0.MkQarY2dOUuwhFnOdaLHqb6idFocTGSfZKjqVoeDYBs');
const Tracking = () => {
  const [utente, setUtente] = useState(null);
  const [veicolo, setVeicolo] = useState(null);
  const [tracking, setTracking] = useState(false);
  useEffect(() => {
    const fetchUtente = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUtente(data.user);
      }
    };
    fetchUtente();
  }, []);
  const handleTracking = async () => {
    if (tracking) {
      // Stop tracking
      setTracking(false);
    } else {
      // Start tracking
      setTracking(true);
    }
  };
  return (
    <div>
      <h1>Tracking</h1>
      <button onClick={handleTracking}>{tracking ? 'Stop tracking' : 'Start tracking'}</button>
    </div>
  );
};
export default Tracking;
