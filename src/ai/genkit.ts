import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let ai: any;

try {
  // Verifichiamo la presenza di una chiave API valida
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey && typeof window === 'undefined') {
      console.warn('ATTENZIONE: Nessuna chiave API trovata per Google GenAI. Le funzioni IA saranno disabilitate.');
  }

  ai = genkit({
    plugins: [googleAI({ apiKey })],
    model: 'googleai/gemini-2.0-flash', // Utilizziamo il modello più recente e stabile
  });
} catch (e: any) {
  const errorMsg = e.message || String(e);
  console.error(
    'ERRORE CRITICO: Inizializzazione Genkit fallita. ' + errorMsg
  );

  // Fallback in caso di errore di inizializzazione
  const mockRunner = (config: {name: string}) => {
    return async (input: any) => {
      console.warn(`Il flusso IA '${config.name}' è stato chiamato, ma l'IA è disabilitata.`);
      throw new Error(
        "Servizio IA non configurato. Verifica la validità della chiave API e l'abilitazione della Generative Language API nella Console Google Cloud."
      );
    };
  };

  ai = {
    defineFlow: (config: any, flowLogic: any) => mockRunner(config),
    definePrompt: (config: any) => mockRunner(config),
  };
}

export { ai };
