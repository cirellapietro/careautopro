"use client";
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import Image from 'next/image';
import Link from 'next/link';
import { Car, Wrench, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useEffect, useState } from 'react';

function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background py-6">
      <div className="container mx-auto flex items-center justify-between px-4 text-sm text-muted-foreground">
        <p>&copy; {year} CareAutoPro. Tutti i diritti riservati.</p>
        <p>Versione: 1.0.0</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />
        <Button asChild>
          <Link href="/login">Accedi</Link>
        </Button>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              La manutenzione auto, semplice e proattiva.
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Con CareAutoPro, tieni traccia di ogni aspetto del tuo veicolo. Dalla manutenzione predittiva alle statistiche di guida, tutto in un unico posto.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Inizia Ora - È Gratis</Link>
              </Button>
              <Button size="lg" variant="outline">
                Scopri di più
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 h-full w-full bg-background [mask-image:radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.7),rgba(255,255,255,0))]"></div>
        </section>

        <section id="features" className="w-full bg-secondary py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Cura intelligente del tuo veicolo
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Tutto ciò che serve per una manutenzione senza pensieri e una guida consapevole.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Wrench className="h-10 w-10 text-accent" />
                  <CardTitle className="font-headline">Manutenzione Predittiva</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Il nostro assistente AI ti avvisa quando è il momento di fare un controllo, basandosi su chilometraggio e storico.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <BarChart3 className="h-10 w-10 text-accent" />
                  <CardTitle className="font-headline">Statistiche Dettagliate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analizza i tuoi viaggi, i consumi e i costi. Ottimizza il tuo stile di guida e risparmia.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Car className="h-10 w-10 text-accent" />
                  <CardTitle className="font-headline">Gestione Veicoli</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aggiungi tutti i tuoi veicoli. Tieni sotto controllo scadenze, interventi e documenti in un unico archivio digitale.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
