'use client';

import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Gauge } from 'lucide-react';

export function SmartMileageSync({ vehicle, onConfirm }: { vehicle: any, onConfirm: (km: number) => void }) {
  const [open, setOpen] = useState(false);
  const [stima, setStima] = useState(0);

  useEffect(() => {
    if (vehicle) {
      const kmAnnui = vehicle.kmAnnuiPrevisti || 12000;
      const kmGiornalieri = kmAnnui / 365;
      const ultimaData = vehicle.updatedAt?.toDate() || new Date();
      const giorni = Math.floor((new Date().getTime() - ultimaData.getTime()) / (1000 * 3600 * 24));
      
      if (giorni >= 1) { // Chiedi conferma solo se è passato almeno un giorno
        setStima(Math.round(vehicle.currentMileage + (kmGiornalieri * giorni)));
        setOpen(true);
      }
    }
  }, [vehicle]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Gauge className="text-blue-600" /> Sincronizzazione Chilometri
          </AlertDialogTitle>
          <AlertDialogDescription>
            In base alla tua media, stimiamo che la tua {vehicle.name} sia a:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Input 
            type="number" 
            value={stima} 
            onChange={(e) => setStima(Number(e.target.value))}
            className="text-3xl font-bold h-16 text-center"
          />
          <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase">Tocca per correggere se i km reali sono diversi</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Più tardi</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(stima)}>Conferma KM</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
