'use client';

import { useUser } from '@/firebase/auth/use-user';
import { SmartMileageSync } from '@/components/SmartMileageSync';
import { AdsBanner } from '@/components/AdsBanner';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/auth/firebaseConfig';

export default function DashboardPage() {
  const { user } = useUser();
  // Qui assumiamo che tu abbia già la logica per recuperare il veicolo attivo
  const vehicle = { name: "Tesla Model 3", currentMileage: 20000, kmAnnuiPrevisti: 15000 }; 

  const handleSync = async (nuoviKm: number) => {
    // Aggiorna il database con i km confermati/corretti
    // const ref = doc(db, 'users', user.uid, 'vehicles', vehicle.id);
    // await updateDoc(ref, { currentMileage: nuoviKm, updatedAt: serverTimestamp() });
    console.log("KM Sincronizzati:", nuoviKm);
  };

  return (
    <div className="p-4 space-y-4">
      <AdsBanner />
      <h1 className="text-2xl font-bold italic text-blue-900">CareAutoPro</h1>
      
      {/* Il popup si attiva solo se necessario grazie alla logica interna */}
      <SmartMileageSync vehicle={vehicle} onConfirm={handleSync} />
      
      <div className="grid gap-4">
        {/* Card dei Veicoli */}
      </div>
      
      <AdsBanner />
    </div>
  );
}
