'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Wifi, Bluetooth } from 'lucide-react';

export default function ConfiguraVeicolo() {
  const [hotspotAttivo, setHotspotAttivo] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Wifi className="text-orange-600" size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Auto-Hotspot</p>
            <p className="text-[10px] text-muted-foreground uppercase">Attiva Wi-Fi al rilevamento</p>
          </div>
        </div>
        <Switch 
          checked={hotspotAttivo} 
          onCheckedChange={setHotspotAttivo} 
        />
      </div>
      <p className="text-[10px] text-center px-4 italic opacity-60">
        Se abilitato, l'App accenderà l'hotspot dello smartphone non appena il Bluetooth rileva il veicolo.
      </p>
    </div>
  );
}
