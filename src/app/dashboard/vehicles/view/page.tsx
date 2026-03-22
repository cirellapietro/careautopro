
'use client';

import { useMemo, Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, useDoc, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { Vehicle, MaintenanceIntervention } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Plus, Pencil, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import { MaintenanceAdvisorForm } from '@/components/dashboard/maintenance-advisor-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { InterventionDialog } from '@/components/dashboard/intervention-dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

function InterventionsList({ vehicleId }: { vehicleId: string }) {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const [selectedIntervention, setSelectedIntervention] = useState<MaintenanceIntervention | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interventionToDelete, setInterventionToDelete] = useState<MaintenanceIntervention | null>(null);

  const interventionsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/vehicles/${vehicleId}/maintenanceInterventions`),
      where('dataoraelimina', '==', null)
    );
  }, [user, firestore, vehicleId]);

  const { data: interventions, isLoading } = useCollection<MaintenanceIntervention>(interventionsQuery);

  const handleDelete = () => {
    if (!user || !firestore || !interventionToDelete) return;
    const docRef = doc(firestore, `users/${user.uid}/vehicles/${vehicleId}/maintenanceInterventions`, interventionToDelete.id);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };
    
    updateDoc(docRef, dataToUpdate).then(() => {
        toast({ title: 'Intervento eliminato' });
    }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    }).finally(() => {
        setIsDeleteDialogOpen(false);
        setInterventionToDelete(null);
    });
  };

  const handleComplete = (intervention: MaintenanceIntervention) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, `users/${user.uid}/vehicles/${vehicleId}/maintenanceInterventions`, intervention.id);
    const dataToUpdate = { 
        status: 'Completato', 
        completionDate: new Date().toISOString().split('T')[0] 
    };
    
    updateDoc(docRef, dataToUpdate).then(() => {
        toast({ title: 'Intervento completato!' });
    }).catch(serverError => {
        const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToUpdate,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Caricamento interventi...</div>;
  }
  
  const sortedInterventions = interventions?.sort((a, b) => {
      const dateA = new Date(a.scheduledDate || 0).getTime();
      const dateB = new Date(b.scheduledDate || 0).getTime();
      return dateB - dateA;
  });

  const getUrgencyColor = (urgency: string) => {
      switch (urgency) {
          case 'Alta': return 'bg-destructive';
          case 'Media': return 'bg-yellow-500';
          case 'Bassa': return 'bg-green-500';
          default: return 'bg-gray-400';
      }
  }

  return (
    <>
      <div className="flex justify-end p-4">
          <Button size="sm" onClick={() => { setSelectedIntervention(null); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Nuovo Intervento
          </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrizione</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Urgenza</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!sortedInterventions || sortedInterventions.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nessun intervento trovato.</TableCell></TableRow>
          ) : sortedInterventions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                  {item.description}
                  {item.notes && <p className="text-xs text-muted-foreground line-clamp-1">{item.notes}</p>}
              </TableCell>
              <TableCell>
                <Badge variant={item.status === 'Completato' ? 'secondary' : (item.status === 'Richiesto' ? 'destructive' : 'default')}>
                    {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                  <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getUrgencyColor(item.urgency || '')}`}></span>
                      {item.urgency}
                  </div>
              </TableCell>
              <TableCell>
                {item.status === 'Completato' 
                    ? (item.completionDate ? format(new Date(item.completionDate), 'dd MMM yyyy', { locale: it }) : 'N/D')
                    : (item.scheduledDate ? format(new Date(item.scheduledDate), 'dd MMM yyyy', { locale: it }) : 'N/D')
                }
              </TableCell>
              <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                      {item.status !== 'Completato' && (
                          <Button variant="ghost" size="icon" title="Completa" onClick={() => handleComplete(item)}>
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedIntervention(item); setIsDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setInterventionToDelete(item); setIsDeleteDialogOpen(true); }}>
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InterventionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        vehicleId={vehicleId} 
        intervention={selectedIntervention} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Questa azione eliminerà l'intervento "{interventionToDelete?.description}". Non potrai annullare questa operazione.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function VehicleDetailContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('id');

  const { user } = useUser();
  const { firestore } = useFirebase();

  const vehicleRef = useMemo(() => {
    if (!user || !firestore || !vehicleId) return null;
    return doc(firestore, `users/${user.uid}/vehicles`, vehicleId);
  }, [user, firestore, vehicleId]);

  const { data: vehicle, isLoading } = useDoc<Vehicle>(vehicleRef);

  if (isLoading || !user || !vehicleId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Caricamento dati veicolo...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/vehicles"><ArrowLeft className="mr-2 h-4 w-4" /> Indietro</Link>
        </Button>
        <h1 className="text-2xl font-bold">Veicolo non trovato</h1>
        <p className="text-muted-foreground">Il veicolo che stai cercando non esiste o non hai i permessi per vederlo.</p>
      </div>
    );
  }
  
  const registrationYear = vehicle.registrationDate && !isNaN(new Date(vehicle.registrationDate).getTime())
    ? new Date(vehicle.registrationDate).getFullYear()
    : 'N/D';

  const registrationDateFormatted = vehicle.registrationDate && !isNaN(new Date(vehicle.registrationDate).getTime()) 
    ? format(new Date(vehicle.registrationDate), 'dd MMMM yyyy', { locale: it }) 
    : 'N/D';
    
  const lastMaintenanceDateFormatted = vehicle.lastMaintenanceDate && !isNaN(new Date(vehicle.lastMaintenanceDate).getTime())
    ? format(new Date(vehicle.lastMaintenanceDate), 'dd MMMM yyyy', { locale: it })
    : 'N/D';
    
  // Arrotondiamo il chilometraggio all'intero anche nella vista di dettaglio
  const currentMileageFormatted = Math.round(typeof vehicle.currentMileage === 'number' ? vehicle.currentMileage : 0).toLocaleString('it-IT');

  const scrollToAdvisor = () => {
    const element = document.getElementById('ai-advisor');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/vehicles"><ArrowLeft className="mr-2 h-4 w-4" /> I Miei Veicoli</Link>
        </Button>
        <Button variant="secondary" onClick={scrollToAdvisor} className="gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          Chiedi all'IA
        </Button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.make} {vehicle.model} - {registrationYear}</p>
          </div>
          <div className="flex items-center gap-4 bg-card border rounded-lg p-4 shadow-sm">
              <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Chilometraggio Attuale</p>
                  <p className="text-2xl font-black text-primary">{currentMileageFormatted} <span className="text-sm font-normal text-muted-foreground">km</span></p>
              </div>
          </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dettagli Veicolo</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Targa</dt>
            <dd className="font-semibold">{vehicle.licensePlate}</dd>
            <dt className="text-muted-foreground">Tipo</dt>
            <dd>{vehicle.type}</dd>
            <dt className="text-muted-foreground">Immatricolazione</dt>
            <dd>{registrationDateFormatted}</dd>
            <dt className="text-muted-foreground">Ultima Manutenzione</dt>
            <dd>{lastMaintenanceDateFormatted}</dd>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Piano di Manutenzione</CardTitle>
            <CardDescription>Elenco degli interventi di manutenzione pianificati e completati.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <InterventionsList vehicleId={vehicle.id} />
          </CardContent>
      </Card>

      <div id="ai-advisor">
        <MaintenanceAdvisorForm vehicle={vehicle} />
      </div>
    </div>
  );
}


export default function VehicleDetailPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <VehicleDetailContent />
    </Suspense>
  )
}
