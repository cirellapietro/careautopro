'use client';

import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Gauge, AlertTriangle } from 'lucide-react';

export function SmartMileageSync({ vehicle, onConfirm }: { vehicle: any, onConfirm: (km: number) => void }) {
  const [open, setOpen] = useState(false);
  const [stima, setStima] = useState(0);

  useEffect(() => {
    if (vehicle) {
      const kmAnnui = vehicle.kmAnnuiPrevisti || 12000;
      const kmGiornalieri = kmAnnui / 365;
      const ultimaData = vehicle.updatedAt?.toDate() || new Date();
      const giorni = Math.max(1, Math.floor((new Date().getTime() - ultimaData.getTime()) / (1000 * 3600 * 24)));
      
      setStima(Math.round(vehicle.currentMileage + (kmGiornalieri * giorni)));
      setOpen(true);
    }
  }, [vehicle]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-blue-900">
            <Gauge className="text-blue-600" /> Sincronizzazione Veicolo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs">
            Basandoci sui giorni passati e sul tuo profilo, ecco la stima attuale:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2 space-y-4">
          <div className="bg-muted p-4 rounded-2xl">
            <Input 
              type="number" 
              value={stima} 
              onChange={(e) => setStima(Number(e.target.value))}
              className="text-4xl font-black h-16 text-center bg-transparent border-none focus-visible:ring-0"
            />
            <p className="text-[9px] text-center font-bold text-muted-foreground uppercase tracking-widest">Chilometri Attuali</p>
          </div>

          {/* Alert Scadenze Temporali (Bollo/Assicurazione) */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
            <p className="text-[11px] text-amber-900">
              Verifica anche le scadenze temporali. Il bollo o l'assicurazione potrebbero richiedere attenzione.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2">
          <AlertDialogAction onClick={() => onConfirm(stima)} className="w-full bg-blue-600 h-12 rounded-xl">
            Conferma e Prosegui
          </AlertDialogAction>
          <AlertDialogCancel className="w-full border-none text-xs">Aggiornerò più tardi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
