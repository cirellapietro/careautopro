'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import {
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import type { VehicleType, MaintenanceCheck } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { fetchMaintenancePlan } from '@/ai/flows/fetch-maintenance-plan';
import { Checkbox } from '../ui/checkbox';
import { useTracking } from '@/contexts/tracking-context';
import { reverseGeocode } from '@/ai/flows/reverse-geocode';
import { fetchAverageMileage } from '@/ai/flows/fetch-average-mileage';


const addVehicleSchema = z.object({
  name: z.string().min(2, { message: 'Il nome è obbligatorio.' }),
  registrationDate: z.string({
    required_error: 'La data di immatricolazione è obbligatoria.',
  }).min(1, { message: 'La data di immatricolazione è obbligatoria.' }),
  licensePlate: z
    .string()
    .min(5, { message: 'Targa non valida.' })
    .max(10, { message: 'Targa non valida.' }),
  vehicleTypeId: z.string({ required_error: 'Seleziona un tipo.' }),
  currentMileage: z.coerce.number().optional(),
  isTaxi: z.boolean().default(false),
});

type AddVehicleFormValues = z.infer<typeof addVehicleSchema>;

type AddVehicleFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddVehicleForm({ open, onOpenChange }: AddVehicleFormProps) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const { permissionStatus } = useTracking();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newVehicleId, setNewVehicleId] = useState<string | null>(null);

  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [cityAverageMileage, setCityAverageMileage] = useState<number | null>(null);
  const [isFetchingSuggestion, setIsFetchingSuggestion] = useState(false);

  const form = useForm<AddVehicleFormValues>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      name: '',
      licensePlate: '',
      registrationDate: '',
      currentMileage: undefined,
      isTaxi: false,
    },
  });
  
  const registrationDate = form.watch('registrationDate');

  useEffect(() => {
    if (!firestore || !open) return;

    const fetchVehicleTypes = async () => {
      setLoadingTypes(true);
      try {
        const vehicleTypesQuery = query(collection(firestore, 'vehicleTypes'), where('dataoraelimina', '==', null));
        const querySnapshot = await getDocs(vehicleTypesQuery);
        const types = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as VehicleType);
        setVehicleTypes(types);
      } catch (serverError) {
        const permissionError = new FirestorePermissionError({
          path: 'vehicleTypes',
          operation: 'list',
          requestResourceData: { context: 'Fetching vehicle types for add vehicle form.' }
        });
        errorEmitter.emit('permission-error', permissionError);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchVehicleTypes();
  }, [firestore, open]);


  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        licensePlate: '',
        registrationDate: '',
        vehicleTypeId: undefined,
        currentMileage: undefined,
        isTaxi: false,
      });
      setYear('');
      setMonth('');
      setDay('');
      setCityAverageMileage(null);
    }
  }, [open, form]);

  useEffect(() => {
    if (year && month && day) {
      const combinedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      form.setValue('registrationDate', combinedDate, { shouldValidate: true });
    }
  }, [year, month, day, form]);

  useEffect(() => {
    if (open && navigator.geolocation && permissionStatus === 'granted' && !cityAverageMileage) {
        const getSuggestion = async (position: GeolocationPosition) => {
          setIsFetchingSuggestion(true);
          const { latitude, longitude } = position.coords;
          const locationResult = await reverseGeocode({ latitude, longitude });

          if (!('error' in locationResult) && locationResult.city) {
              const mileageResult = await fetchAverageMileage({ city: locationResult.city, country: locationResult.country });
              if (!('error' in mileageResult) && mileageResult.averageMileage) {
                setCityAverageMileage(mileageResult.averageMileage);
              }
          }
          setIsFetchingSuggestion(false);
        }

        navigator.geolocation.getCurrentPosition(
            getSuggestion,
            () => setIsFetchingSuggestion(false),
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 * 60 * 60 }
        );
    }
  }, [open, permissionStatus, cityAverageMileage]);

  const suggestedCurrentMileage = useMemo(() => {
    if (!cityAverageMileage || !registrationDate) return null;
    try {
        const regDate = new Date(registrationDate);
        const today = new Date();
        const daysSinceRegistration = (today.getTime() - regDate.getTime()) / (1000 * 3600 * 24);
        if (daysSinceRegistration < 0) return null;
        
        const dailyAverage = cityAverageMileage / 365;
        const estimatedMileage = Math.round(dailyAverage * daysSinceRegistration);
        return estimatedMileage > 0 ? estimatedMileage : null;
    } catch {
        return null;
    }
  }, [cityAverageMileage, registrationDate]);


  const selectedTypeId = form.watch('vehicleTypeId');
  const selectedVehicleType = vehicleTypes.find(vt => vt.id === selectedTypeId);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setNewVehicleId(null);
        setIsSubmitting(false);
    }, 300);
  };

  const onSubmit = async (values: AddVehicleFormValues) => {
    if (!user || !firestore || !selectedVehicleType) return;
    setIsSubmitting(true);

    const nameParts = values.name.split(' ');
    const make = nameParts[0] || '';
    const model = nameParts.slice(1).join(' ').trim() || '';

    try {
        const mileage = values.currentMileage ?? suggestedCurrentMileage ?? selectedVehicleType.averageAnnualMileage;
        const regDate = new Date(values.registrationDate);
        const today = new Date();
        
        const monthsPassed = (today.getFullYear() - regDate.getFullYear()) * 12 + (today.getMonth() - regDate.getMonth());

        const newVehicleRef = doc(collection(firestore, `users/${user.uid}/vehicles`));
        const newVehicleData = {
          ...values,
          id: newVehicleRef.id,
          userId: user.uid,
          make,
          model,
          type: selectedVehicleType.name,
          currentMileage: mileage,
          lastMaintenanceDate: today.toISOString().split('T')[0],
          createdAt: today.toISOString(),
          dataoraelimina: null,
        };

        const batch = writeBatch(firestore);
        batch.set(newVehicleRef, newVehicleData);

        const checksCollectionRef = collection(firestore, `vehicleTypes/${values.vehicleTypeId}/maintenanceChecks`);
        const checksQuery = query(checksCollectionRef, where('dataoraelimina', '==', null));
        const checksSnap = await getDocs(checksQuery);
        const genericChecks = checksSnap.docs.map(d => ({ ...(d.data() as MaintenanceCheck), id: d.id }));
        
        for (const check of genericChecks) {
            let pastOccurrences = 0;
            if (check.intervalMileage) {
                pastOccurrences = Math.floor(mileage / check.intervalMileage);
            }
            if (check.intervalTime) {
                const timeOccurrences = Math.floor(monthsPassed / check.intervalTime);
                pastOccurrences = Math.max(pastOccurrences, timeOccurrences);
            }

            for (let i = 1; i <= Math.min(pastOccurrences, 2); i++) {
                const pastInterventionRef = doc(collection(newVehicleRef, 'maintenanceInterventions'));
                batch.set(pastInterventionRef, {
                    id: pastInterventionRef.id,
                    vehicleId: newVehicleRef.id,
                    description: check.description,
                    status: 'Completato',
                    urgency: 'Bassa',
                    notes: `Storico generato automaticamente (occorrenza n. ${pastOccurrences - i + 1}).`,
                    completionDate: today.toISOString().split('T')[0],
                    dataoraelimina: null,
                });
            }

            const nextInterventionRef = doc(collection(newVehicleRef, 'maintenanceInterventions'));
            const isDue = pastOccurrences > 0 || (check.intervalMileage && mileage >= check.intervalMileage * 0.9);
            
            batch.set(nextInterventionRef, {
                id: nextInterventionRef.id,
                vehicleId: newVehicleRef.id,
                description: check.description,
                status: isDue ? 'Richiesto' : 'Pianificato',
                urgency: isDue ? 'Alta' : 'Media',
                notes: `Prossima scadenza calcolata automaticamente.`,
                scheduledDate: today.toISOString(),
                dataoraelimina: null,
            });

            if (isDue) {
                const alertRef = doc(collection(firestore, `users/${user.uid}/alerts`));
                batch.set(alertRef, {
                    id: alertRef.id,
                    userId: user.uid,
                    message: `Manutenzione "${check.description}" consigliata per ${values.name}.`,
                    type: 'maintenance',
                    timestamp: today.toISOString(),
                    isRead: false,
                    dataoraelimina: null,
                });
            }
        }

        await batch.commit();
        setNewVehicleId(newVehicleRef.id);
        toast({ title: 'Veicolo creato!', description: 'Piano di manutenzione generato correttamente.' });

    } catch (serverError) {
        console.error("Errore salvataggio:", serverError);
    } finally {
        setIsSubmitting(false);
    }
  };

  const { years, months, days } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('it-IT', { month: 'long' }) }));
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return { years, months, days };
  }, []);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen ? handleClose() : onOpenChange(true)}>
      <DialogContent className="sm:max-w-md">
        {newVehicleId ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-xl font-black italic uppercase">Mezzo Censito!</DialogTitle>
                  <DialogDescription className="text-base">
                    Abbiamo generato lo storico e i futuri interventi. <strong>Controlla subito la correttezza</strong> delle date e dei chilometri nella scheda del veicolo.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full flex flex-col gap-2 pt-4">
                    <Button className="w-full h-12 font-bold" onClick={() => { router.push(`/dashboard/vehicles/view?id=${newVehicleId}`); handleClose(); }}>
                        Verifica Piano Manutenzione
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={handleClose}>Chiudi</Button>
                </DialogFooter>
            </div>
        ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black italic uppercase">Nuovo Veicolo</DialogTitle>
                <DialogDescription>
                    Inserisci i dettagli per generare automaticamente il piano di cura del mezzo.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca e modello</FormLabel>
                        <FormControl><Input placeholder="Es. Audi A3" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licensePlate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Targa</FormLabel>
                            <FormControl><Input placeholder="AB123CD" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isTaxi"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 mt-8">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="text-xs uppercase font-bold cursor-pointer">Taxi / NCC</FormLabel>
                          </FormItem>
                        )}
                      />
                  </div>

                  <FormField
                    control={form.control}
                    name="registrationDate"
                    render={() => (
                      <FormItem>
                        <FormLabel>Immatricolazione</FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          <Select onValueChange={setDay} value={day}>
                            <SelectTrigger><SelectValue placeholder="GG" /></SelectTrigger>
                            <SelectContent>{days.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select onValueChange={setMonth} value={month}>
                            <SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger>
                            <SelectContent>{months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent>
                          </Select>
                          <Select onValueChange={setYear} value={year}>
                            <SelectTrigger><SelectValue placeholder="AAAA" /></SelectTrigger>
                            <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vehicleTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo di veicolo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingTypes}>
                          <FormControl><SelectTrigger><SelectValue placeholder={loadingTypes ? "..." : "Seleziona"} /></SelectTrigger></FormControl>
                          <SelectContent>{vehicleTypes.map((vt) => (<SelectItem key={vt.id} value={vt.id}>{vt.name}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentMileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            Chilometraggio Attuale
                            {isFetchingSuggestion && <Loader2 className="h-3 w-3 animate-spin text-accent" />}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                                type="number"
                                placeholder={suggestedCurrentMileage ? String(suggestedCurrentMileage) : "Es. 45000"}
                                {...field}
                                value={field.value ?? ''}
                                className={cn(suggestedCurrentMileage && !field.value && "border-accent/50 bg-accent/5")}
                            />
                            {suggestedCurrentMileage && !field.value && (
                                <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-black text-accent uppercase animate-in fade-in duration-500">
                                    <Sparkles className="h-3 w-3" /> IA Suggerito
                                </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-[10px]">
                            {suggestedCurrentMileage 
                                ? `Stima basata sulla tua zona: ~${suggestedCurrentMileage.toLocaleString('it-IT')} km.` 
                                : 'Inserisci i km reali per generare uno storico preciso.'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="pt-2">
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>Annulla</Button>
                    <Button type="submit" disabled={isSubmitting || loadingTypes} className="font-bold uppercase tracking-tight">
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Crea Veicolo"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
