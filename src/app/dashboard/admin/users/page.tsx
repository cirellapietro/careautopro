"use client";
export const dynamic = 'force-dynamic';

import { useUser } from "@/firebase/auth/use-user";
import { useFirebase, useCollection, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, doc, updateDoc, query, where } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Pencil, Trash2, UserPlus, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { user: currentUser, loading: userLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const usersQuery = useMemo(() => {
    if (!firestore || currentUser?.role !== 'Amministratore') return null;
    // Mostriamo solo gli utenti che non sono stati eliminati logicamente
    return query(collection(firestore, 'users'), where('dataoraelimina', '==', null));
  }, [firestore, currentUser]);

  const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);

  useEffect(() => {
    if (!userLoading && (!currentUser || currentUser.role !== 'Amministratore')) {
        router.push('/dashboard');
    }
  }, [currentUser, userLoading, router]);

  const handleDelete = () => {
    if (!userToDelete || !firestore) return;
    
    // Impediamo all'admin di eliminare se stesso
    if (userToDelete.uid === currentUser?.uid) {
        toast({ variant: 'destructive', title: "Operazione non consentita", description: "Non puoi eliminare il tuo stesso account amministratore." });
        setUserToDelete(null);
        return;
    }

    const docRef = doc(firestore, 'users', userToDelete.uid);
    const dataToUpdate = { dataoraelimina: new Date().toISOString() };

    updateDoc(docRef, dataToUpdate)
        .then(() => {
            toast({ title: "Utente eliminato", description: `L'utente ${userToDelete.email} è stato rimosso.` });
        })
        .catch((serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: "Errore", description: "Impossibile eliminare l'utente." });
        })
        .finally(() => {
            setUserToDelete(null);
        });
  };

  if (userLoading || usersLoading) {
      return <div className="flex h-full items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">Gestione Utenti</h1>
            <p className="text-muted-foreground">Visualizza e gestisci i permessi degli utenti dell'applicazione.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/admin/users/view?id=new')}>
            <UserPlus className="mr-2 h-4 w-4" /> Aggiungi Utente
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Lista Utenti Attivi</CardTitle>
            <CardDescription>Tutti gli utenti registrati o invitati al sistema.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]"></TableHead>
                        <TableHead>Email / Nome</TableHead>
                        <TableHead>Ruolo</TableHead>
                        <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users && users.length > 0 ? users.map(u => {
                        const initial = u.displayName ? u.displayName.charAt(0).toUpperCase() : (u.email ? u.email.charAt(0).toUpperCase() : '?');
                        return (
                            <TableRow key={u.id}>
                                <TableCell>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={u.photoURL || ''} />
                                        <AvatarFallback>{initial}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{u.displayName || 'Senza nome'}</span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> {u.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={u.role === 'Amministratore' ? 'default' : 'secondary'}>
                                        {u.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/admin/users/view?id=${u.uid}`)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:text-destructive" 
                                            onClick={() => setUserToDelete(u)}
                                            disabled={u.uid === currentUser?.uid}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                Nessun utente trovato.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

       <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Questa azione contrassegnerà l'account di <span className="font-bold">{userToDelete?.email}</span> come eliminato. L'utente non potrà più accedere ai propri dati.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Elimina Utente</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
