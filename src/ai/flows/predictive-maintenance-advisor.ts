'use server';

/**
 * @fileOverview An AI-powered predictive maintenance advisor for vehicles.
 *
 * - getMaintenanceAdvice - A function that generates maintenance advice for a vehicle.
 * - MaintenanceAdviceInput - The input type for the getMaintenanceAdvice function.
 * - MaintenanceAdviceOutput - The return type for the getMaintenanceAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MaintenanceAdviceInputSchema = z.object({
  vehicleType: z.string().describe('The type of the vehicle (e.g., gasoline, diesel, electric).'),
  kilometersDriven: z.number().describe('The total kilometers driven by the vehicle.'),
  lastMaintenanceDate: z.string().describe('The date of the last maintenance service (YYYY-MM-DD).'),
  maintenanceHistory: z.string().describe('A summary of the vehicle maintenance history.'),
  drivingStyle: z.string().describe('The user driving style (e.g., aggressive, moderate, conservative).'),
});
export type MaintenanceAdviceInput = z.infer<typeof MaintenanceAdviceInputSchema>;

const MaintenanceAdviceOutputSchema = z.object({
  advice: z.string().describe('AI-generated advice on upcoming maintenance needs.'),
  urgency: z.string().describe('The urgency level of the advice (e.g., high, medium, low).'),
  suggestedInterventions: z.string().describe('Suggested maintenance interventions based on vehicle data.'),
});
export type MaintenanceAdviceOutput = z.infer<typeof MaintenanceAdviceOutputSchema>;

const prompt = ai.definePrompt({
  name: 'maintenanceAdvicePrompt',
  input: {schema: MaintenanceAdviceInputSchema},
  output: {schema: MaintenanceAdviceOutputSchema},
  prompt: `Sei un esperto consulente di manutenzione automobilistica. Sulla base delle seguenti informazioni sul veicolo, fornisci consigli sulle prossime necessità di manutenzione, il livello di urgenza e suggerisci interventi specifici.

Tipo di Veicolo: {{{vehicleType}}}
Chilometri Percorsi: {{{kilometersDriven}}}
Data Ultima Manutenzione: {{{lastMaintenanceDate}}}
Storico Manutenzione: {{{maintenanceHistory}}}
Stile di Guida: {{{drivingStyle}}}

Rispondi in modo professionale e utile in lingua Italiana.
Considera i problemi comuni per il tipo di veicolo e lo stile di guida specificati.
Assicurati di includere suggestedInterventions basati sui dati reali del veicolo.
`,
});

const maintenanceAdviceFlow = ai.defineFlow(
  {
    name: 'maintenanceAdviceFlow',
    inputSchema: MaintenanceAdviceInputSchema,
    outputSchema: MaintenanceAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error("L'IA non ha prodotto alcun risultato.");
    return output;
  }
);

export async function getMaintenanceAdvice(input: MaintenanceAdviceInput): Promise<MaintenanceAdviceOutput | { error: string }> {
  try {
    return await maintenanceAdviceFlow(input);
  } catch (e: any) {
    const errorMsg = e.message || String(e);
    console.error(`Genkit flow 'maintenanceAdviceFlow' failed: ${errorMsg}`);
    
    const isApiKeyError = errorMsg.includes('API_KEY_INVALID') || 
                          errorMsg.includes('not authorized') || 
                          errorMsg.includes('invalid') ||
                          errorMsg.includes('key');

    const isApiDisabledError = errorMsg.includes('Generative Language API') || 
                               errorMsg.includes('has not been used') ||
                               errorMsg.includes('disabled') ||
                               errorMsg.includes('non è attiva') ||
                               errorMsg.includes('403');

    if (isApiKeyError && !isApiDisabledError) {
        return { error: "La chiave API per Gemini non è valida o è scaduta. Controlla la configurazione nel file .env." };
    }
    
    if (isApiDisabledError) {
        return { error: "L'API Generative Language non è attiva nel tuo progetto Google Cloud. Abilitala su: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" };
    }
    
    return { error: "Si è verificato un problema durante la comunicazione con l'assistente AI. Per favore assicurati di aver abilitato l'API Generative Language nella tua console Google Cloud." };
  }
}
