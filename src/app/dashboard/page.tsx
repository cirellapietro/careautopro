'use client';

import { useUser } from '@/firebase/auth/use-user';
import { SmartMileageSync } from '@/components/SmartMileageSync';
import { AdsBanner } from '@/components/AdsBanner';

export default function DashboardPage() {
  const { user } = useUser();
  
  // Esempio dato veicolo (nella realtà lo recuperi da Firestore tramite l'UUID)
  const veicoloAttivo = { 
    marca: "Tesla", 
    modello: "Model 3", 
    targa: "AA123BB", 
    currentMileage: 25000, 
    kmAnnuiPrevisti: 18000 
  };

  const nomeIdentificativo = `${veicoloAttivo.marca} ${veicoloAttivo.modello}`;

  return (
    <div className="p-4 space-y-6">
      <AdsBanner />
      
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black italic text-blue-900 leading-none">{nomeIdentificativo}</h1>
          <p className="text-sm font-bold text-muted-foreground mt-1">Targa: {veicoloAttivo.targa}</p>
        </div>
        <div className="bg-blue-100 px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase">
          Monitoraggio Attivo
        </div>
      </header>

      {/* Popup che chiede conferma dei KM stimati dal batch */}
      <SmartMileageSync 
        vehicle={veicoloAttivo} 
        onConfirm={(km) => console.log("KM confermati dall'utente:", km)} 
      />

      <div className="grid gap-4">
        {/* Qui verranno caricate le card degli interventi in scadenza dal Batch */}
      </div>

      <AdsBanner />
    </div>
  );
}
