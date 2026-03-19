'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch'; 
import { Wifi, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SetupHotspot({ params }: { params: { id: string } }) {
  const [enableHotspot, setEnableHotspot] = useState(false);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="text-orange-600" />
            <div>
              <h3 className="font-black text-orange-900 uppercase text-xs">Automazione Hotspot</h3>
              <p className="text-[10px] text-orange-700">Attiva Wi-Fi quando rilevi il Bluetooth</p>
            </div>
          </div>
          <Switch 
            checked={enableHotspot} 
            onCheckedChange={setEnableHotspot} 
          />
        </div>
        
        {enableHotspot && (
          <p className="mt-4 text-[9px] text-orange-800 italic leading-tight">
            Nota: L'attivazione automatica richiede i permessi di sistema dello smartphone.
          </p>
        )}
      </div>

      <Button className="w-full bg-blue-700 h-14 rounded-2xl font-bold flex gap-2">
        <Save size={18} /> Salva Preferenze Veicolo
      </Button>
    </div>
  );
}
