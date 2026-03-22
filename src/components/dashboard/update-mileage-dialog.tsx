
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
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
import { Loader2 } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

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
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateMileageFormValues>({
    resolver: zodResolver(updateMileageSchema),
    defaultValues: {
      vehicles: [],
    },
  });

  useEffect(() => {
    if (vehicles) {
        form.reset({
            vehicles: vehicles.map(v => ({ 
                id: v.id, 
                name: v.name, 
                currentMileage: Math.round(v.currentMileage || 0) 
            }))
        })
    }
  }, [vehicles, open, form.reset]);
  
  const { fields } = useFieldArray({
    control: form.control,
    name: 'vehicles'
  });

  const onSubmit = (data: UpdateMileageFormValues) => {
    if (!user || !firestore) return;
    setIsSubmitting(true);

    const batch = writeBatch(firestore);
    data.vehicles.forEach(vehicle => {
      const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicle.id);
      // Arrotondiamo anche prima del salvataggio per pulire il database
      batch.update(vehicleRef, { currentMileage: Math.round(vehicle.currentMileage) });
    });

    batch.commit()
      .then(() => {
        toast({
          title: 'Successo!',
          description: 'Chilometraggio dei veicoli aggiornato.',
        });
        onOpenChange(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: `users/${user.uid}/vehicles`,
          operation: 'update',
          requestResourceData: data.vehicles,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Errore di Permesso',
          description: 'Impossibile aggiornare il chilometraggio.',
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiorna Chilometraggio</DialogTitle>
          <DialogDescription>
            Inserisci il chilometraggio attuale indicato sul tachimetro dei tuoi veicoli per calcolare correttamente le scadenze.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`vehicles.${index}.currentMileage`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.name}</FormLabel>
                        <FormControl>
                          <Input type="number" {...formField} value={formField.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Più Tardi
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salva
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
