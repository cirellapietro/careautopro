'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { scanAndConnectVehicle } from '@/lib/bluetoothScanner';
import { AdsBanner } from '@/components/AdsBanner';

export default function DashboardPage() {
  const { user } = useUser();

  useEffect(() => {
    // Avvia la scansione automatica all'apertura se l'utente è loggato
    const initAutoScan = async () => {
      if (user) {
        console.log("Ricerca veicoli associati via Bluetooth...");
        // Inizialmente cerchiamo un placeholder, poi lo leggeremo dal DB
        await scanAndConnectVehicle("Tesla_BT", true); 
      }
    };
    
    initAutoScan();
  }, [user]);

  return (
    <div className="flex flex-col gap-6 p-4 pb-20">
      <AdsBanner />
      
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 italic">
          CareAutoPro
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Monitoraggio intelligente attivo • {new Date().toLocaleDateString()}
        </p>
      </header>

      {/* Spazio per le card dei veicoli caricate da IDX */}
      <div className="grid gap-4">
        {/* I componenti VehicleCard appariranno qui */}
      </div>

      <AdsBanner />

      <footer className="fixed bottom-4 left-4 right-4 text-[10px] text-center text-muted-foreground bg-white/80 backdrop-blur py-2 rounded-full border">
        Scanner Bluetooth in background • Protetto da Firebase Auth
      </footer>
    </div>
  );
}
