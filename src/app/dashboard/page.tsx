'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { scanAndConnectVehicle } from '@/lib/bluetoothScanner';
import { AdsBanner } from '@/components/AdsBanner';

export default function DashboardPage() {
  const { user } = useUser();

  useEffect(() => {
    // Avvia la scansione automatica all'apertura
    // In produzione, recupereremo il nome BT salvato dal database
    if (user) {
      console.log("Ricerca veicoli associati...");
      scanAndConnectVehicle("Tesla_BT", true); 
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <AdsBanner />
      <h1 className="text-2xl font-bold italic text-blue-800">CareAutoPro Dashboard</h1>
      <p className="text-sm text-muted-foreground">Sistema di monitoraggio attivo</p>
      
      {/* Qui IDX ha già inserito le tue VehicleCard e le statistiche */}
      
      <AdsBanner />
    </div>
  );
}
