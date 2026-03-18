'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase } from '@/firebase';
import { doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Bluetooth } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { salvaInterventoRapido } from '@/lib/manutenzioneLogica';

const updateMileageSchema = z.object({
  vehicles: z.array(z.object({
    id: z.string(),
    name: z.string(),
    currentMileage: z.coerce.number().min(0, "Il chilometraggio non può essere negativo."),
  }))
});

type UpdateMileageFormValues = z.infer<typeof updateMileageSchema>;

type UpdateMileageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
};

export function UpdateMileageDialog({ open, onOpenChange, vehicles }: UpdateMileageDialogProps) {
  const { user } = useUser();
  const { db } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateMileageFormValues>({
    resolver: zodResolver(updateMileageSchema),
    defaultValues: {
      vehicles: vehicles.map(v => ({
        id: v.id,
        name: v.name,
        currentMileage: v.currentMileage || 0,
      }))
    }
  });

  const onSubmit = async (values: UpdateMileageFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const batch = writeBatch(db);

      for (const v of values.vehicles) {
        // Percorso dinamico: salva sotto l'utente proprietario
        const vehicleRef = doc(db, 'users', user.uid, 'vehicles', v.id);
        
        batch.update(vehicleRef, {
          currentMileage: v.currentMileage,
          lastUpdatedBy: user.uid,
          updatedAt: serverTimestamp(),
        });

        // Avvia ricalcolo scadenze (Olio/Freni)
        await salvaInterventoRapido(v.id, v.currentMileage, 'olio');
      }

      await batch.commit();
      toast({ title: "Successo", description: "Dati e scadenze aggiornati." });
      onOpenChange(false);
    } catch (error) {
      toast({ title: "Errore", description: "Verifica i permessi del database.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Aggiorna Chilometri
          </DialogTitle>
          <DialogDescription>
            Inserisci i km attuali. L'app ricalcolerà le scadenze.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-4">
                {form.getValues().vehicles.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`vehicles.${index}.currentMileage`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between">
                          {field.name}
                          <Bluetooth className="h-4 w-4 text-blue-500 opacity-50" />
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salva e Ricalcola Scadenze
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
