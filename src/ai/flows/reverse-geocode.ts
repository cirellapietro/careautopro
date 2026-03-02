'use server';

/**
 * @fileOverview An AI-powered flow to get city and country from geographic coordinates.
 *
 * - reverseGeocode - A function that returns the city and country.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude.'),
  longitude: z.number().describe('The longitude.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  city: z.string().describe('The city name.'),
  country: z.string().describe('The country name.'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput | { error: string }> {
  try {
    return await reverseGeocodeFlow(input);
  } catch(e: any) {
    console.error(`Genkit flow 'reverseGeocode' failed: ${e.message}`);
    
    const isApiError = e.message?.includes('Generative Language API') || 
                       e.message?.includes('has not been used') ||
                       e.message?.includes('disabled');

    if (isApiError) {
        return { error: "L'API per l'IA generativa non è attiva. Abilitala nella console Google Cloud per abilitare la localizzazione intelligente." };
    }
    return { error: "Si è verificato un errore durante la geocodifica." };
  }
}

const prompt = ai.definePrompt({
  name: 'reverseGeocodePrompt',
  input: { schema: ReverseGeocodeInputSchema },
  output: { schema: ReverseGeocodeOutputSchema },
  prompt: `What is the city and country for the coordinates latitude: {{latitude}}, longitude: {{longitude}}?
  Provide the response in Italian.
  Respond ONLY with a JSON object with the keys "city" and "country".
  Do not include any other text, explanation, or markdown formatting.
  Example:
  {
    "city": "Roma",
    "country": "Italia"
  }
  `,
});

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
