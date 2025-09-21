import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Vehicle {
  veicolo_id: string;
  nomeveicolo: string;
  targa: string;
  kmattuali: number;
  dataimmatricolazione: string;
  tipoveicolo_id: string;
  utente_id: string;
  kmanno: number;
  cilindrata: number;
  kw: number;
  dataora: string;
  dataoraelimina: string | null;
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVehicles = async () => {
    if (!user) {
      console.log('🔄 Nessun utente autenticato, skip caricamento veicoli');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 Caricamento veicoli per utente:', user.id);
      
      // Prova prima con configurazione esplicita dello schema
      let data, queryError;
      
      try {
        // Prova con query SQL diretta per bypassare il problema dello schema
        const response = await supabase.rpc('get_user_vehicles', { 
          user_id: user.id 
        });
        
        data = response.data;
        queryError = response.error;
      } catch (schemaError) {
        console.error('❌ Errore di schema:', schemaError);
        // Se c'è un errore di schema, impostiamo un messaggio di errore appropriato
        throw new Error('Configurazione database non corretta. Contattare il supporto.');
      }

      console.log('📊 Risultato query veicoli:', { 
        data, 
        error: queryError, 
        userId: user.id,
        numeroVeicoli: data?.length || 0
      });

      if (queryError) {
        console.error('❌ Errore nella query Supabase:', queryError);
        throw queryError;
      }

      console.log('✅ Veicoli caricati con successo:', data?.length || 0);
      setVehicles(data || []);
    } catch (err: any) {
      console.error('❌ Errore nel caricamento veicoli:', err);
      setError(err.message || 'Errore nel caricamento dei veicoli');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (!user) {
      console.log('❌ Nessun utente autenticato per aggiungere veicolo');
      return;
    }

    try {
      console.log('➕ Aggiunta nuovo veicolo:', vehicleData);
      
      // Prima dobbiamo ottenere un tipo di veicolo valido se non è specificato
      let tipoveicolo_id = vehicleData.tipoveicolo_id;
      
      if (!tipoveicolo_id) {
        const { data: tipoVeicoli } = await supabase
          .from('TipoVeicoli')
          .select('tipoveicolo_id')
          .is('dataoraelimina', null)
          .limit(1)
          .single();
        
        tipoveicolo_id = tipoVeicoli?.tipoveicolo_id;
      }
      
      // Inserimento nel database usando il nome corretto della tabella
      const { data, error } = await supabase
        .from('Veicoli')
        .insert([{
          ...vehicleData,
          utente_id: user.id,
          tipoveicolo_id: tipoveicolo_id,
          dataora: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore nell\'inserimento veicolo:', error);
        throw error;
      }

      console.log('✅ Veicolo aggiunto con successo:', data);
      setVehicles(prev => [data, ...prev]);
      return { success: true, data };
    } catch (err: any) {
      console.error('❌ Errore nell\'aggiunta veicolo:', err);
      return { success: false, error: err.message };
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>) => {
    try {
      // Aggiornamento del veicolo nel database
      const { data, error } = await supabase
        .from('Veicoli')
        .update({
          ...updates,
          dataora: new Date().toISOString()
        })
        .eq('veicolo_id', vehicleId)
        .select()
        .single();

      if (error) throw error;

      setVehicles(prev => 
        prev.map(v => v.veicolo_id === vehicleId ? data : v)
      );
      return { success: true, data };
    } catch (err: any) {
      console.error('Error updating vehicle:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    try {
      // Eliminazione logica del veicolo
      const { error } = await supabase
        .from('Veicoli')
        .update({ 
          dataoraelimina: new Date().toISOString() 
        })
        .eq('veicolo_id', vehicleId);

      if (error) throw error;

      setVehicles(prev => prev.filter(v => v.veicolo_id !== vehicleId));
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles
  };
};