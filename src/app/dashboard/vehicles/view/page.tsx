'use client';

import { useMemo, Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, collection, query, where, updateDoc } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, useDoc, useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { Vehicle, MaintenanceIntervention } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Plus, Pencil, Trash2, CheckCircle2, Sparkles, Wifi, Bluetooth, Settings2, Activity, AlertTriangle, Gauge } from 'lucide-react';
import { MaintenanceAdvisorForm } from '@/components/dashboard/maintenance-advisor-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { InterventionDialog } from '@/components/dashboard/intervention-dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function AutomationSettings({ vehicle }: { vehicle: Vehicle }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isMockingBt, setIsMockingBt] = useState(false);

    // Form state
    const [hotspot, setHotspot] = useState(vehicle.autoHotspotEnabled || false);
    const [tracking, setTracking] = useState(vehicle.autoTrackingEnabled || false);
    const [btName, setBtName] = useState(vehicle.bluetoothDeviceName || '');

    useEffect(() => {
        setHotspot(vehicle.autoHotspotEnabled || false);
        setTracking(vehicle.autoTrackingEnabled || false);
        setBtName(vehicle.bluetoothDeviceName || '');
        
        const isCurrentlyMocked = localStorage.getItem(`simulated_bt_connected_${vehicle.id}`) === 'true';
        setIsMockingBt(isCurrentlyMocked);
    }, [vehicle]);

    const handleSave = async () => {
        if (!user || !firestore) return;
        setIsSaving(true);
        const docRef = doc(firestore, `users/${user.uid}/vehicles`, vehicle.id);
        const data = {
            autoHotspotEnabled: hotspot,
            autoTrackingEnabled: tracking,
            bluetoothDeviceName: btName,
            bluetoothMacAddress: btName ? `mac_${vehicle.id}` : null
        };

        try {
            await updateDoc(docRef, data);
            toast({ title: 'Impostazioni salvate', description: 'Le automazioni Bluetooth sono state aggiornate.' });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile salvare le automazioni.' });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleMockBluetooth = () => {
        const newState = !isMockingBt;
        setIsMockingBt(newState);
        localStorage.setItem(`simulated_bt_connected_${vehicle.id}`, newState ? 'true' : 'false');
        toast({ 
            title: newState ? 'Bluetooth Veicolo Connesso' : 'Bluetooth Veicolo Scollegato',
            description: newState ? 'L\'app ora reagirà come se fossi salito in auto.' : 'L\'automazione non si attiverà più.'
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bluetooth className="h-5 w-5 text-primary" />
                        <CardTitle>Configurazione Bluetooth</CardTitle>
                    </div>
                    <CardDescription>Collega il Bluetooth della tua auto per attivare le funzioni intelligenti.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nome Dispositivo Bluetooth</Label>
                        <div className="flex gap-2">
                            <input 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Es. My-Audi-BT"
                                value={btName}
                                onChange={(e) => setBtName(e.target.value)}
                            />
                            <Button variant="outline" size="sm" onClick={() => setBtName(`${vehicle.make} BT`)}>
                                Trova
                            </Button>
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Hotspot Wi-Fi Automatico</Label>
                                <p className="text-xs text-muted-foreground">Attiva l'Hotspot dello smartphone non appena rilevi il veicolo.</p>
                            </div>
                            <Switch checked={hotspot} onCheckedChange={setHotspot} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Tracking GPS Automatico</Label>
                                <p className="text-xs text-muted-foreground">Avvia il monitoraggio chilometri non appena rilevi il veicolo.</p>
                            </div>
                            <Switch checked={tracking} onCheckedChange={setTracking} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
                    <Button variant="ghost" size="sm" onClick={toggleMockBluetooth} className={cn(isMockingBt && "text-green-600 font-bold")}>
                        <Activity className="mr-2 h-4 w-4" />
                        {isMockingBt ? "BT Simulato: ON" : "Simula Connessione BT"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salva Automazioni
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

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
      const dateA = new Date(a.scheduledDate || a.completionDate || 0).getTime();
      const dateB = new Date(b.scheduledDate || b.completionDate || 0).getTime();
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
      <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Registro Manutenzione</h3>
          <Button size="sm" onClick={() => { setSelectedIntervention(null); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Aggiungi
          </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Intervento</TableHead>
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
                  {item.notes && <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{item.notes}</p>}
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
              <TableCell className="text-xs">
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
                      Questa azione eliminerà l'intervento "{interventionToDelete?.description}".
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
  const router = useRouter();

  const { user } = useUser();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const vehicleRef = useMemo(() => {
    if (!user || !firestore || !vehicleId) return null;
    return doc(firestore, `users/${user.uid}/vehicles`, vehicleId);
  }, [user, firestore, vehicleId]);

  const { data: vehicle, isLoading } = useDoc<Vehicle>(vehicleRef);

  const handleDeleteVehicle = async () => {
    if (!user || !firestore || !vehicleId || !vehicleRef) return;
    setIsDeleting(true);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };

    try {
        await updateDoc(vehicleRef, dataToUpdate);
        toast({ title: 'Veicolo eliminato', description: 'Il veicolo è stato rimosso dalla tua lista.' });
        router.push('/dashboard/vehicles');
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile eliminare il veicolo.' });
    } finally {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    }
  };

  if (isLoading || !user || !vehicleId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Caricamento dati veicolo...</p>
      </div>
    );
  }

  if (!vehicle || vehicle.dataoraelimina) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/vehicles"><ArrowLeft className="mr-2 h-4 w-4" /> Indietro</Link>
        </Button>
        <h1 className="text-2xl font-bold">Veicolo non trovato</h1>
      </div>
    );
  }
  
  const registrationDateFormatted = vehicle.registrationDate && !isNaN(new Date(vehicle.registrationDate).getTime()) 
    ? format(new Date(vehicle.registrationDate), 'dd MMMM yyyy', { locale: it }) 
    : 'N/D';
    
  const currentMileageFormatted = Math.round(typeof vehicle.currentMileage === 'number' ? vehicle.currentMileage : 0).toLocaleString('it-IT');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/vehicles"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <h1 className="font-headline text-2xl font-bold leading-none">{vehicle.name}</h1>
                <p className="text-xs text-muted-foreground mt-1">{vehicle.make} {vehicle.model} • {vehicle.licensePlate}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button 
                variant="destructive" 
                size="sm" 
                className="font-bold"
                onClick={() => setShowDeleteConfirm(true)}
            >
                <Trash2 className="mr-2 h-4 w-4" /> Elimina Veicolo
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                      <Gauge className="h-3 w-3" /> Chilometraggio
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-black text-primary">{currentMileageFormatted} <span className="text-xs font-normal">km</span></p>
              </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Alimentazione
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="text-lg font-bold">{vehicle.type}</p>
              </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/10">
              <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">
                      <Settings2 className="h-3 w-3" /> Automazione
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <Badge variant={vehicle.autoTrackingEnabled ? "default" : "outline"} className="text-[10px]">
                      {vehicle.autoTrackingEnabled ? "GPS Automativo Attivo" : "Nessuna automazione"}
                  </Badge>
              </CardContent>
          </Card>
      </div>

      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3">
            <TabsTrigger value="maintenance">Manutenzione</TabsTrigger>
            <TabsTrigger value="details">Dettagli</TabsTrigger>
            <TabsTrigger value="automations">Automazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance" className="space-y-6 mt-4">
            <Card>
                <CardContent className="p-0">
                    <InterventionsList vehicleId={vehicle.id} />
                </CardContent>
            </Card>
            <MaintenanceAdvisorForm vehicle={vehicle} />
        </TabsContent>

        <TabsContent value="details" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Specifiche Tecniche</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                            <dt className="text-xs font-black uppercase text-muted-foreground">Targa</dt>
                            <dd className="font-black text-lg">{vehicle.licensePlate}</dd>
                        </div>
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                            <dt className="text-xs font-black uppercase text-muted-foreground">Data Immatricolazione</dt>
                            <dd className="font-bold">{registrationDateFormatted}</dd>
                        </div>
                        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                            <dt className="text-xs font-black uppercase text-muted-foreground">Chilometri Iniziali</dt>
                            <dd className="font-bold">{currentMileageFormatted} km</dd>
                        </div>
                        {vehicle.isTaxi && (
                            <div className="space-y-1 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                                <dt className="text-xs font-black uppercase text-accent">Uso Veicolo</dt>
                                <dd className="font-bold text-accent">Taxi / Noleggio con conducente</dd>
                            </div>
                        )}
                    </dl>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="automations" className="mt-4">
            <AutomationSettings vehicle={vehicle} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Eliminare il veicolo?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Questa azione contrassegnerà <span className="font-bold text-foreground">{vehicle.name}</span> come eliminato.
                      I dati verranno conservati per fini statistici ma non appariranno più nella tua Dashboard.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteVehicle} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sì, elimina"}
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
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
