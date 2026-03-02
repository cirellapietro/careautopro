'use server';

/**
 * @fileOverview An AI-powered flow to fetch the average annual vehicle mileage for a city.
 *
 * - fetchAverageMileage - A function that returns the average mileage.
 * - FetchAverageMileageInput - The input type for the fetchAverageMileage function.
 * - FetchAverageMileageOutput - The return type for the fetchAverageMileage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FetchAverageMileageInputSchema = z.object({
  city: z.string().describe('The city name.'),
  country: z.string().describe('The country name.'),
});
export type FetchAverageMileageInput = z.infer<typeof FetchAverageMileageInputSchema>;

const FetchAverageMileageOutputSchema = z.object({
  averageMileage: z.number().describe('The average annual mileage in kilometers.'),
});
export type FetchAverageMileageOutput = z.infer<typeof FetchAverageMileageOutputSchema>;

export async function fetchAverageMileage(input: FetchAverageMileageInput): Promise<FetchAverageMileageOutput | { error: string }> {
  try {
    return await fetchAverageMileageFlow(input);
  } catch (e: any) {
    const errorMsg = e.message || String(e);
    console.error(`Genkit flow 'fetchAverageMileage' failed: ${errorMsg}`);
    
    const isApiError = errorMsg.includes('Generative Language API') || 
                       errorMsg.includes('has not been used') ||
                       errorMsg.includes('disabled') ||
                       errorMsg.includes('403');

    if (isApiError) {
        return { error: "L'API Generative Language non è attiva nel tuo progetto Google Cloud. Abilitala su: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com" };
    }
    return { error: "Impossibile recuperare il chilometraggio medio tramite IA." };
  }
}

const prompt = ai.definePrompt({
  name: 'fetchAverageMileagePrompt',
  input: { schema: FetchAverageMileageInputSchema },
  output: { schema: FetchAverageMileageOutputSchema },
  prompt: `Qual è la stima del chilometraggio medio annuo per un'auto a {{city}}, {{country}}?
  Fornisci la risposta in chilometri.
  Rispondi SOLO con un oggetto JSON con la chiave "averageMileage".
  Non includere altro testo, spiegazioni o formattazione markdown.
  Esempio:
  {
    "averageMileage": 11500
  }
  `,
});

const fetchAverageMileageFlow = ai.defineFlow(
  {
    name: 'fetchAverageMileageFlow',
    inputSchema: FetchAverageMileageInputSchema,
    outputSchema: FetchAverageMileageOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
