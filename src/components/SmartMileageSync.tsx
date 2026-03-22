
'use client';

import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Gauge, Activity, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { useUser } from '@/firebase/auth/use-user';
import { useToast } from '@/hooks/use-toast';

export function SmartMileageSync({ vehicle, onConfirm }: { vehicle: any, onConfirm: (km: number) => void }) {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [stima, setStima] = useState(0);
  const [incremento, setIncremento] = useState(0);
  const [isGpsBased, setIsGpsGased] = useState(false);

  useEffect(() => {
    if (vehicle) {
      const today = new Date().toISOString().split('T')[0];
      const lastPrompt = localStorage.getItem(`lastSyncPrompt_${vehicle.id}`);
      
      if (lastPrompt === today) return;

      const ultimaData = vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date();
      const orePassate = (new Date().getTime() - ultimaData.getTime()) / (1000 * 3600);
      
      let stimato = Math.round(vehicle.currentMileage);
      let inc = 0;

      // Se il veicolo ha un incremento GPS registrato di recente (nelle ultime 24 ore)
      if (vehicle.lastGpsIncrement && orePassate < 24) {
          inc = vehicle.lastGpsIncrement;
          stimato = Math.round(vehicle.currentMileage); // Il mileage è già aggiornato via GPS
          setIsGpsGased(true);
      } else {
          // Altrimenti stima temporale classica
          const kmAnnui = vehicle.kmAnnuiPrevisti || 12000;
          const kmGiornalieri = kmAnnui / 365;
          const giorni = Math.floor(orePassate / 24);
          
          if (giorni >= 1) {
              inc = kmGiornalieri * giorni;
              stimato = Math.round(vehicle.currentMileage + inc);
              setIsGpsGased(false);
          } else {
              return; // Non c'è nulla da sincronizzare
          }
      }
      
      setIncremento(inc);
      setStima(stimato);
      setOpen(true);
    }
  }, [vehicle]);

  const handleConfirm = async () => {
      if (!user || !firestore) return;
      
      try {
          const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicle.id);
          await updateDoc(vehicleRef, { 
              currentMileage: stima,
              updatedAt: new Date().toISOString(),
              lastGpsIncrement: 0 // Resettiamo l'incremento una volta confermato
          });
          
          localStorage.setItem(`lastSyncPrompt_${vehicle.id}`, new Date().toISOString().split('T')[0]);
          toast({ title: 'Chilometri sincronizzati', description: `Il tachimetro di ${vehicle.name} è ora a ${stima} km.` });
          onConfirm(stima);
          setOpen(false);
      } catch (e) {
          toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile aggiornare i chilometri.' });
      }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-black italic uppercase text-primary">
            <Gauge className="text-accent" /> Verifica Tachimetro
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Conferma i chilometri totali per <strong>{vehicle.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-6 space-y-4">
          <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border-2 border-dashed border-primary/20">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mb-1">Valore Suggerito</p>
            <Input 
                type="number" 
                value={stima} 
                onChange={(e) => setStima(Number(e.target.value))}
                className="text-4xl font-black h-20 text-center bg-transparent border-none focus-visible:ring-0 shadow-none p-0 selection:bg-accent/30"
            />
            <div className="mt-2 flex items-center gap-2">
                <Badge variant={isGpsBased ? "destructive" : "secondary"} className="gap-1 px-2 py-0.5 text-[10px] font-bold uppercase">
                    {isGpsBased ? <Activity className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                    {isGpsBased ? `+${incremento.toFixed(1)} km GPS oggi` : `+${Math.round(incremento)} km stimati`}
                </Badge>
            </div>
          </div>
          <p className="text-[10px] text-center text-muted-foreground italic px-4">
            Tocca il numero per correggerlo se non corrisponde a quello reale sulla tua auto.
          </p>
        </div>

        <AlertDialogFooter className="sm:flex-col gap-2">
          <AlertDialogAction onClick={handleConfirm} className="w-full h-12 text-base font-bold bg-primary uppercase tracking-tight">
            Conferma KM Totali
          </AlertDialogAction>
          <AlertDialogCancel className="w-full border-none text-muted-foreground hover:bg-transparent hover:text-foreground">
            Lo farò più tardi
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
