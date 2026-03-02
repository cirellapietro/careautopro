"use client";

import { useActionState, useEffect, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { generateMaintenanceAdvice } from '@/app/dashboard/vehicles/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Sparkles, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';

const MaintenanceAdviceSchema = z.object({
  vehicleType: z.string(),
  kilometersDriven: z.number(),
  lastMaintenanceDate: z.string(),
  maintenanceHistory: z.string().min(10, { message: "Descrivi brevemente la cronologia." }),
  drivingStyle: z.string({ required_error: "Seleziona uno stile di guida." }),
});

type MaintenanceAdviceFormValues = z.infer<typeof MaintenanceAdviceSchema>;

const initialState = {
  advice: null,
  error: null,
};

export function MaintenanceAdvisorForm({ vehicle }: { vehicle: Vehicle }) {
  const [state, formAction] = useActionState(generateMaintenanceAdvice, initialState);
  const [isPending, startTransition] = useTransition();

  const form = useForm<MaintenanceAdviceFormValues>({
    resolver: zodResolver(MaintenanceAdviceSchema),
    defaultValues: {
      vehicleType: vehicle.type,
      kilometersDriven: vehicle.currentMileage,
      lastMaintenanceDate: vehicle.lastMaintenanceDate,
      maintenanceHistory: 'Manutenzione regolare effettuata secondo il libretto.',
      drivingStyle: 'moderate',
    },
  });

  useEffect(() => {
    form.reset({
      vehicleType: vehicle.type,
      kilometersDriven: vehicle.currentMileage,
      lastMaintenanceDate: vehicle.lastMaintenanceDate,
      maintenanceHistory: 'Manutenzione regolare effettuata secondo il libretto.',
      drivingStyle: 'moderate',
    })
  }, [vehicle, form.reset]);
  
  const onFormSubmit = (data: MaintenanceAdviceFormValues) => {
    const formData = new FormData();
    formData.append('vehicleType', data.vehicleType);
    formData.append('kilometersDriven', String(data.kilometersDriven));
    formData.append('lastMaintenanceDate', data.lastMaintenanceDate);
    formData.append('maintenanceHistory', data.maintenanceHistory);
    formData.append('drivingStyle', data.drivingStyle);
    startTransition(() => {
      formAction(formData);
    });
  };

  const renderError = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(urlRegex);
    return (
      <div className="space-y-4">
        <p className="leading-relaxed">{parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return null; // Non mostriamo il link nel testo perché aggiungiamo il pulsante sotto
          }
          return part;
        })}</p>
        
        {message.includes('https') && (
            <Button asChild variant="destructive" className="w-full">
                <a 
                    href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2"
                >
                    <ExternalLink className="h-4 w-4" />
                    Abilita API Google Gemini ora
                </a>
            </Button>
        )}
      </div>
    );
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Parametri di Analisi IA</CardTitle>
          <CardDescription>
            Affina i dati del veicolo per ricevere un consiglio personalizzato.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="maintenanceHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cronologia Manutenzione</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Esempio: Sostituzione pastiglie freni a 40.000km..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="drivingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stile di Guida</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona il tuo stile di guida" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aggressive">Aggressivo (Uso intenso)</SelectItem>
                        <SelectItem value="moderate">Moderato (Misto)</SelectItem>
                        <SelectItem value="conservative">Prudente (Solo città/extraurbano)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analizza con IA
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-4">
        {state.advice && (
          <Card className="bg-secondary animate-in fade-in slide-in-from-right-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Sparkles className="text-accent" />
                Risultato dell'Analisi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    state.advice.urgency?.toLowerCase() === 'high' ? 'text-destructive' : 
                    state.advice.urgency?.toLowerCase() === 'medium' ? 'text-yellow-500' : 'text-green-500'
                  )} />
                  Urgenza: <span className="capitalize">{state.advice.urgency}</span>
                </h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{state.advice.advice}</p>
              </div>
              <div className="pt-2 border-t">
                <h3 className="font-semibold">Interventi Suggeriti</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed italic">{state.advice.suggestedInterventions}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {state.error && (
          <Card className="border-destructive bg-destructive/5 animate-in shake-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-destructive text-lg">
                <AlertTriangle />
                Azione Richiesta
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-destructive font-medium">
              {renderError(state.error)}
            </CardContent>
          </Card>
        )}
        {!state.advice && !state.error && !isPending && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl h-full">
                <Sparkles className="h-12 w-12 mb-4 opacity-10" />
                <p className="text-sm">Configura i parametri e avvia l'analisi</p>
            </div>
        )}
        {isPending && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-xl h-full">
                <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
                <p className="text-sm font-bold animate-pulse">L'IA sta elaborando i dati...</p>
            </div>
        )}
      </div>
    </div>
  );
}
