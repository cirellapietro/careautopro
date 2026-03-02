'use client';
import { useUser } from "@/firebase/auth/use-user";
import { useFirebase, useCollection, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { VehicleType } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AdminVehicleTypesPage() {
  const { user: currentUser, loading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const [vehicleTypeToDelete, setVehicleTypeToDelete] = useState<VehicleType | null>(null);

  const vehicleTypesQuery = useMemo(() => {
    if (!firestore || currentUser?.role !== 'Amministratore') return null;
    return collection(firestore, 'vehicleTypes');
  }, [firestore, currentUser]);

  const { data: rawVehicleTypes, isLoading: vehicleTypesLoading } = useCollection<VehicleType>(vehicleTypesQuery);

  const vehicleTypes = useMemo(() => {
    if (!rawVehicleTypes) return [];
    return rawVehicleTypes.filter(vt => !vt.dataoraelimina);
  }, [rawVehicleTypes]);

  useEffect(() => {
    if (!userLoading && (!currentUser || currentUser.role !== 'Amministratore')) {
      router.push('/dashboard');
    }
  }, [currentUser, userLoading, router]);

  const handleDelete = () => {
    if (!vehicleTypeToDelete || !firestore) return;
    const docRef = doc(firestore, 'vehicleTypes', vehicleTypeToDelete.id);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };

    updateDoc(docRef, dataToUpdate)
        .then(() => {
            toast({ title: "Tipo veicolo eliminato", description: "Il tipo di veicolo è stato contrassegnato come eliminato." });
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: "Errore di Permesso", description: "Non disponi dei permessi per eliminare questo tipo veicolo." });
        })
        .finally(() => {
            setVehicleTypeToDelete(null);
        });
  };

  if (userLoading || vehicleTypesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
          <div className="flex items-center justify-between">
              <div>
                  <h1 className="font-headline text-3xl font-bold">Gestione Tipi Veicolo</h1>
                  <p className="text-muted-foreground">Gestisci i tipi di veicolo e i relativi piani di manutenzione.</p>
              </div>
              <Button onClick={() => router.push('/dashboard/admin/vehicle-types/view?id=new')}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Tipo
              </Button>
          </div>
        <Card>
          <CardHeader>
            <CardTitle>Elenco Tipi Veicolo</CardTitle>
            <CardDescription>
              Visualizza e gestisci i tipi di veicolo disponibili nell'applicazione.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vehicleTypesLoading && !vehicleTypes ? (
              <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Chilometraggio Medio Annuo</TableHead>
                    <TableHead className="text-right">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleTypes && vehicleTypes.length > 0 ? vehicleTypes.map(vt => (
                    <TableRow 
                      key={vt.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/admin/vehicle-types/view?id=${vt.id}`)}
                    >
                      <TableCell className="font-medium">{vt.name}</TableCell>
                      <TableCell>{vt.averageAnnualMileage.toLocaleString('it-IT')} km</TableCell>
                      <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/admin/vehicle-types/view?id=${vt.id}`)}}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setVehicleTypeToDelete(vt); }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                            Nessun tipo veicolo trovato.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!vehicleTypeToDelete} onOpenChange={() => setVehicleTypeToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Questa azione contrassegnerà il tipo veicolo <span className="font-bold">{vehicleTypeToDelete?.name}</span> come eliminato.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
