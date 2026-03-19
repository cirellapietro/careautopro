'use client';

import { useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { salvaPreferenzeAuto } from '@/lib/driverService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AdsBanner } from '@/components/AdsBanner';
import { Bluetooth, Wifi, Users } from 'lucide-react';

export default function ConfiguraVeicolo({ params }: { params: { id: string } }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [btName, setBtName] = useState('');
  const [hotspot, setHotspot] = useState(false);

  const salvaConfig = async () => {
    if (!user) return;
    try {
      await salvaPreferenzeAuto(user.uid, params.id, btName, hotspot);
      toast({ title: "Configurazione salvata", description: "L'automazione è ora attiva per questa auto." });
    } catch (e) {
      toast({ title: "Errore", description: "Verifica la connessione.", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <AdsBanner />
      
      <h1 className="text-2xl font-bold border-b pb-2">Impostazioni Veicolo</h1>
      
      <section className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 font-bold">
          <Bluetooth size={20} />
          <h2>Automazione Bluetooth</h2>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground">Nome Dispositivo Auto</label>
          <Input 
            placeholder="Es: Tesla Model 3" 
            value={btName} 
            onChange={(e) => setBtName(e.target.value)} 
          />
        </div>
        
        <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Wifi size={18} className="text-orange-500" />
            <span className="text-sm font-medium">Attiva Hotspot all'ingresso</span>
          </div>
          <Switch checked={hotspot} onCheckedChange={setHotspot} />
        </div>
        
        <Button onClick={salvaConfig} className="w-full bg-blue-600 hover:bg-blue-700">
          Salva Preferenze
        </Button>
      </section>

      <AdsBanner />
    </div>
  );
}
