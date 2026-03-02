'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { doc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { User } from '@/lib/types';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save, UserPlus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido.'),
  displayName: z.string().min(2, 'Il nome deve contenere almeno 2 caratteri.'),
  role: z.string().min(1, 'Il ruolo è obbligatorio.'),
});

type UserFormValues = z.infer<typeof userSchema>;

function UserDetailContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const isNew = userId === 'new';

  const { user: adminUser, loading: adminUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRef = useMemo(() => {
    if (!firestore || !userId || isNew) return null;
    return doc(firestore, 'users', userId);
  }, [firestore, userId, isNew]);

  const { data: user, isLoading: userLoading } = useDoc<User>(userRef);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      displayName: '',
      role: 'Utente',
    },
  });

  useEffect(() => {
    if (user && !isNew) {
      form.reset({ 
        email: user.email || '',
        displayName: user.displayName || '',
        role: user.role || 'Utente' 
      });
    }
  }, [user, form.reset, isNew]);

  const onSubmit = (values: UserFormValues) => {
    if (!firestore) return;
    setIsSubmitting(true);

    if (isNew) {
        // Creazione di un nuovo utente (placeholder nel database)
        // Usiamo l'email come parte dell'ID temporaneo o generiamo un ID
        const newUserRef = doc(collection(firestore, 'users'));
        const dataToCreate = {
            uid: newUserRef.id,
            id: newUserRef.id,
            ...values,
            notificationChannels: ['app', 'email'],
            notificationReminderTime: 3,
            dataoraelimina: null,
        };

        setDoc(newUserRef, dataToCreate)
            .then(() => {
                toast({ title: 'Successo', description: 'Utente creato correttamente. L\'utente potrà ora registrarsi con questa email.' });
                router.push('/dashboard/admin/users');
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: 'users',
                    operation: 'create',
                    requestResourceData: dataToCreate,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Errore', description: "Impossibile creare l'utente." });
            })
            .finally(() => setIsSubmitting(false));
    } else if (userRef) {
        // Aggiornamento utente esistente
        const dataToUpdate = { 
            role: values.role,
            displayName: values.displayName,
            email: values.email
        };

        updateDoc(userRef, dataToUpdate)
            .then(() => {
                toast({ title: 'Successo', description: 'Dati utente aggiornati.' });
                router.push('/dashboard/admin/users');
            })
            .catch((serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'update',
                    requestResourceData: dataToUpdate,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({ variant: 'destructive', title: 'Errore', description: "Impossibile aggiornare l'utente." });
            })
            .finally(() => setIsSubmitting(false));
    }
  };

  if (adminUserLoading || (userLoading && !isNew)) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isNew && !user && !userLoading) {
    return (
        <div className="p-6 text-center">
            <p className="mb-4">Utente non trovato.</p>
            <Button asChild variant="outline"><Link href="/dashboard/admin/users">Torna alla lista</Link></Button>
        </div>
    );
  }
  
  const userInitial = values => values.displayName ? values.displayName.charAt(0).toUpperCase() : (values.email ? values.email.charAt(0).toUpperCase() : '?');

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/dashboard/admin/users"><ArrowLeft className="mr-2 h-4 w-4" /> Torna alla gestione utenti</Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            {!isNew && (
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                    <AvatarFallback className="text-xl">{user ? userInitial(user) : '?'}</AvatarFallback>
                </Avatar>
            )}
            <div>
              <CardTitle>{isNew ? 'Aggiungi Nuovo Utente' : 'Modifica Utente'}</CardTitle>
              <CardDescription>
                  {isNew 
                    ? 'Inserisci i dettagli dell\'utente che vuoi abilitare nel sistema.' 
                    : `Gestisci il profilo di ${user?.displayName || user?.email}`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indirizzo Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@esempio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruolo nel Sistema</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un ruolo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Utente">Utente</SelectItem>
                        <SelectItem value="Amministratore">Amministratore</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                        Gli amministratori hanno accesso completo a tutte le impostazioni e ai dati di tutti gli utenti.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Annulla</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : isNew ? (
                        <UserPlus className="mr-2 h-4 w-4" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isNew ? 'Crea Utente' : 'Salva Modifiche'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


export default function UserDetailPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <UserDetailContent />
    </Suspense>
  );
}
