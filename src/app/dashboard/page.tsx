'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import type { Vehicle } from '@/lib/types';
import { VehicleCard } from '@/components/dashboard/vehicle-card';
import { SmartMileageSync } from '@/components/SmartMileageSync';
import { AdsBanner } from '@/components/AdsBanner';
import { Loader2, PlusCircle, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const { firestore } = useFirebase();

  const vehiclesQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/vehicles`),
      where('dataoraelimina', '==', null)
    );
  }, [user, firestore]);

  const { data: vehicles, isLoading: vehiclesLoading } = useCollection<Vehicle>(vehiclesQuery);

  if (userLoading || vehiclesLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground font-medium">Caricamento cruscotto...</p>
      </div>
    );
  }

  const activeVehicle = vehicles?.find(v => v.trackingGPS);

  return (
    <div className="space-y-6">
      <AdsBanner />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Benvenuto, {user?.displayName?.split(' ')[0] || 'Utente'}</h1>
          <p className="text-muted-foreground font-medium">Gestisci i tuoi veicoli e monitora la manutenzione.</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/dashboard/vehicles">
            <PlusCircle className="mr-2 h-4 w-4" /> Aggiungi Veicolo
          </Link>
        </Button>
      </header>

      {activeVehicle && (
        <SmartMileageSync 
          vehicle={activeVehicle} 
          onConfirm={(km) => console.log("KM confermati:", km)} 
        />
      )}

      <div className="grid gap-6">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <h2 className="font-headline text-xl font-bold uppercase tracking-tight">I Tuoi Mezzi</h2>
        </div>

        {!vehicles || vehicles.length === 0 ? (
          <Card className="border-dashed py-12">
            <CardContent className="flex flex-col items-center text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Car className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <CardTitle>Ancora nessun veicolo</CardTitle>
              <CardDescription className="max-w-sm mt-2">
                Aggiungi il tuo primo veicolo per iniziare a tracciare i chilometri e ricevere avvisi di manutenzione.
              </CardDescription>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/dashboard/vehicles">Configura ora</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Prossime Scadenze
            </CardTitle>
            <CardDescription>Interventi suggeriti o programmati a breve.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Non ci sono interventi urgenti segnalati. Mantieni aggiornato il chilometraggio per previsioni accurate.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/10">
          <CardHeader>
            <CardTitle className="font-headline">Assistente AI</CardTitle>
            <CardDescription>Consigli personalizzati per la tua auto.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="p-0 h-auto font-bold text-accent underline">
              <Link href="/dashboard/ai-assistant">Chiedi un'analisi predittiva &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <AdsBanner />
    </div>
  );
}
