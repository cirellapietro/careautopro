"use client";
export const dynamic = 'force-dynamic';

import { useUser } from "@/firebase/auth/use-user";
import { useFirebase, useCollection, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Role } from '@/lib/types';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Loader2, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminRolesPage() {
  const { user: currentUser, loading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const rolesQuery = useMemo(() => {
    if (!firestore || currentUser?.role !== 'Amministratore') return null;
    return collection(firestore, 'roles');
  }, [firestore, currentUser]);

  const { data: rawRoles, isLoading: rolesLoading } = useCollection<Role>(rolesQuery);

  const roles = useMemo(() => {
    if (!rawRoles) return [];
    return rawRoles.filter(r => !r.dataoraelimina);
  }, [rawRoles]);

  useEffect(() => {
    if (!userLoading && (!currentUser || currentUser.role !== 'Amministratore')) {
        router.push('/dashboard');
    }
  }, [currentUser, userLoading, router]);

  const handleDelete = () => {
    if (!roleToDelete || !firestore) return;
    const docRef = doc(firestore, 'roles', roleToDelete.id);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };

    updateDoc(docRef, dataToUpdate)
        .then(() => {
            toast({ title: "Ruolo eliminato" });
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: "Errore", description: "Impossibile eliminare il ruolo." });
        })
        .finally(() => {
            setRoleToDelete(null);
        });
  };

  if (userLoading || rolesLoading) {
      return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ruoli</h1>
        <Button onClick={() => router.push('/dashboard/admin/roles/view?id=new')}><PlusCircle className="mr-2 h-4 w-4" /> Aggiungi</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table><TableBody>
          {roles?.map(role => (
            <TableRow key={role.id} onClick={() => router.push(`/dashboard/admin/roles/view?id=${role.id}`)} className="cursor-pointer">
              <TableCell className="font-medium p-4">{role.name}</TableCell>
              <TableCell className="text-right p-4">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/admin/roles/view?id=${role.id}`)}}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); setRoleToDelete(role); }}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}</TableBody></Table>
      </CardContent></Card>
       <AlertDialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Questa azione contrassegnerà il ruolo <span className="font-bold">{roleToDelete?.name}</span> come eliminato.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
