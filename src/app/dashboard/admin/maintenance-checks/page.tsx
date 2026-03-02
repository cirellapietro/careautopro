'use client';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, getDocs, updateDoc, query } from 'firebase/firestore';
import type { VehicleType, MaintenanceCheck } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

type CheckWithVehicleType = MaintenanceCheck & { vehicleTypeName: string };

export default function AllMaintenanceChecksPage() {
  const { user: currentUser, loading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [allChecks, setAllChecks] = useState<CheckWithVehicleType[]>([]);
  const [checkToDelete, setCheckToDelete] = useState<CheckWithVehicleType | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [selectedVehicleTypeForNewCheck, setSelectedVehicleTypeForNewCheck] = useState<string>("");

  useEffect(() => {
    if (!userLoading && (!currentUser || currentUser.role !== 'Amministratore')) {
      router.push('/dashboard');
      return;
    }
  }, [currentUser, userLoading, router]);

  useEffect(() => {
    if (!firestore || !currentUser || currentUser.role !== 'Amministratore') return;

    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Recuperiamo tutti i tipi veicolo senza filtri iniziali
        const vtSnap = await getDocs(collection(firestore, 'vehicleTypes'));
        const fetchedVehicleTypes = vtSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as VehicleType))
            .filter(vt => !vt.dataoraelimina); // Filtraggio client-side
        
        setVehicleTypes(fetchedVehicleTypes);

        const checksPromises = fetchedVehicleTypes.map(async (vt) => {
          const checksSnap = await getDocs(collection(firestore, `vehicleTypes/${vt.id}/maintenanceChecks`));
          return checksSnap.docs
            .map(doc => ({
                id: doc.id,
                ...(doc.data() as MaintenanceCheck),
                vehicleTypeName: vt.name
            }))
            .filter(c => !c.dataoraelimina); // Filtraggio client-side
        });

        const checksByVehicleType = await Promise.all(checksPromises);
        const flattenedChecks = checksByVehicleType.flat();
        setAllChecks(flattenedChecks);

      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Errore', description: 'Impossibile caricare i controlli periodici.' });
        const permissionError = new FirestorePermissionError({ path: 'vehicleTypes', operation: 'list', requestResourceData: { context: 'Fetching all maintenance checks for admin view.' } });
        errorEmitter.emit('permission-error', permissionError);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [firestore, currentUser, toast]);

  const handleDelete = () => {
    if (!checkToDelete || !firestore) return;
    const docRef = doc(firestore, `vehicleTypes/${checkToDelete.vehicleTypeId}/maintenanceChecks`, checkToDelete.id);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };

    updateDoc(docRef, dataToUpdate)
      .then(() => {
        toast({ title: "Controllo eliminato" });
        setAllChecks(prev => prev.filter(c => c.id !== checkToDelete.id));
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: dataToUpdate });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: "Errore di Permesso", description: "Non disponi dei permessi per eliminare questo controllo." });
      })
      .finally(() => {
        setCheckToDelete(null);
      });
  };

  const handleAddCheck = () => {
      if (!selectedVehicleTypeForNewCheck) {
          toast({ variant: 'destructive', title: 'Errore', description: 'Seleziona un tipo di veicolo.' });
          return;
      }
      router.push(`/dashboard/admin/vehicle-types/maintenance-checks/view?vehicleTypeId=${selectedVehicleTypeForNewCheck}&checkId=new`);
      setIsAddDialogOpen(false);
  }

  if (userLoading || loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">Controlli Periodici</h1>
            <p className="text-muted-foreground">Gestisci tutti i controlli di manutenzione standard per ogni tipo di veicolo.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Controllo
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Elenco Controlli</CardTitle>
            <CardDescription>
              Visualizza, modifica o elimina i controlli di manutenzione standard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Tipo Veicolo</TableHead>
                  <TableHead>Intervallo Km</TableHead>
                  <TableHead>Intervallo Mesi</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allChecks.length > 0 ? allChecks.map(check => (
                  <TableRow key={check.id}>
                    <TableCell className="font-medium">{check.description}</TableCell>
                    <TableCell><Badge variant="secondary">{check.vehicleTypeName}</Badge></TableCell>
                    <TableCell>{check.intervalMileage ? `${check.intervalMileage.toLocaleString('it-IT')} km` : 'N/A'}</TableCell>
                    <TableCell>{check.intervalTime ? `${check.intervalTime} mesi` : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/admin/vehicle-types/maintenance-checks/view?vehicleTypeId=${check.vehicleTypeId}&checkId=${check.id}`)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setCheckToDelete(check)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">Nessun controllo trovato.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!checkToDelete} onOpenChange={() => setCheckToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione contrassegnerà il controllo <span className="font-bold">{checkToDelete?.description}</span> come eliminato.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Aggiungi Nuovo Controllo</DialogTitle>
                <DialogDescription>
                    Seleziona il tipo di veicolo a cui vuoi aggiungere un nuovo controllo di manutenzione standard.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSelectedVehicleTypeForNewCheck} value={selectedVehicleTypeForNewCheck}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleziona un tipo di veicolo" />
                    </SelectTrigger>
                    <SelectContent>
                        {vehicleTypes.map(vt => <SelectItem key={vt.id} value={vt.id}>{vt.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annulla</Button>
                <Button onClick={handleAddCheck}>Continua</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
