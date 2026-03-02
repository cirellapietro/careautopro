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
    console.error(`Genkit flow 'maintenanceAdviceFlow' failed: ${e.message}`);
    
    const isApiError = e.message?.includes('Generative Language API') || 
                       e.message?.includes('has not been used') ||
                       e.message?.includes('disabled');

    if (isApiError) {
        return { error: "L'API per l'IA generativa (Gemini) non è attiva. Abilitala nella console Google Cloud per il progetto 705618426785 per ricevere consigli personalizzati." };
    }
    
    return { error: "Si è verificato un errore durante l'analisi AI. Per favore riprova più tardi o verifica la connessione." };
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

Respond in a professional and helpful manner.
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
    return output!;
  }
);
