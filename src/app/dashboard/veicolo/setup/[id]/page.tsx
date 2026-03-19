'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Gauge, MapPin } from 'lucide-react';

export default function SetupVeicolo({ params }: { params: { id: string } }) {
  const [kmAnnui, setKmAnnui] = useState(15000);
  const { toast } = useToast();

  return (
    <div className="p-4 space-y-8 pb-20">
      <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold italic">Configurazione Predittiva</h1>
        <p className="text-xs opacity-80">Ottimizza gli avvisi per il tuo stile di guida e zona geografica.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          <MapPin size={16} /> Percorrenza Annuale Stimata
        </h2>
        <div className="flex gap-4 items-center">
          <Input 
            type="number" 
            value={kmAnnui} 
            onChange={(e) => setKmAnnui(Number(e.target.value))} 
            className="text-2xl font-black h-14"
          />
          <span className="font-bold text-muted-foreground">KM/ANNO</span>
        </div>
        <p className="text-[10px] text-blue-600 font-bold uppercase">Suggerimento: 15.000 KM per la tua area urbana.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
          <Gauge size={16} /> Rettifica Storico (Punto Zero)
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm">
            <span className="text-sm font-medium">Ultimo Cambio Olio (KM)</span>
            <Input type="number" placeholder="KM" className="w-24 h-8" />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm">
            <span className="text-sm font-medium">Scadenza Assicurazione</span>
            <Input type="date" className="w-32 h-8" />
          </div>
        </div>
      </section>

      <Button className="w-full bg-blue-600 h-14 rounded-xl font-bold shadow-lg" onClick={() => toast({title: "Dati salvati"})}>
        Salva e Attiva Monitoraggio
      </Button>
    </div>
  );
}
