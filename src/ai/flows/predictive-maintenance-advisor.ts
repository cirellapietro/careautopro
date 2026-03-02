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

export async function getMaintenanceAdvice(input: MaintenanceAdviceInput): Promise<MaintenanceAdviceOutput | { error: string }> {
  try {
    return await maintenanceAdviceFlow(input);
  } catch (e: any) {
    const errorMsg = e.message || String(e);
    console.error(`Genkit flow 'maintenanceAdviceFlow' failed: ${errorMsg}`);
    
    const isApiError = errorMsg.includes('Generative Language API') || 
                       errorMsg.includes('has not been used') ||
                       errorMsg.includes('disabled') ||
                       errorMsg.includes('403') ||
                       errorMsg.includes('API_KEY_INVALID') ||
                       errorMsg.includes('not authorized');

    if (isApiError) {
        return { error: "L'API per l'IA generativa (Gemini) non è attiva o la chiave non è valida. Assicurati di aver abilitato la 'Generative Language API' nella console Google Cloud per il progetto associato." };
    }
    
    return { error: "Si è verificato un problema durante l'analisi AI. Verifica la tua connessione internet o riprova tra qualche minuto." };
  }
}

const prompt = ai.definePrompt({
  name: 'maintenanceAdvicePrompt',
  input: {schema: MaintenanceAdviceInputSchema},
  output: {schema: MaintenanceAdviceOutputSchema},
  prompt: `You are an expert automotive maintenance advisor. Based on the following information about the vehicle, provide advice on upcoming maintenance needs, the urgency of the advice, and suggest specific maintenance interventions.

Vehicle Type: {{{vehicleType}}}
Kilometers Driven: {{{kilometersDriven}}}
Last Maintenance Date: {{{lastMaintenanceDate}}}
Maintenance History: {{{maintenanceHistory}}}
Driving Style: {{{drivingStyle}}}

Respond in Italian in a professional and helpful manner.
Consider common issues for the vehicle type and driving style.

Make sure to include suggestedInterventions based on vehicle data.
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
