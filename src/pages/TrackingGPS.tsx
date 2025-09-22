import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, ArrowLeft, Play, Square, Clock, Route, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVehicles } from '@/hooks/useVehicles';

interface SessioneUtilizzo {
  sessione_id: string;
  veicolo_id: string;
  dataora_inizio: string;
  dataora_fine: string | null;
  km_iniziali: number | null;
  km_finali: number | null;
  km_percorsi: number | null;
  durata_minuti: number | null;
  posizione_inizio_lat: number | null;
  posizione_inizio_lng: number | null;
  posizione_fine_lat: number | null;
  posizione_fine_lng: number | null;
  note: string | null;
  sessione_attiva: boolean;
  nomeveicolo: string;
  targa: string;
}

const TrackingGPS = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { vehicles } = useVehicles();
  const [sessioni, setSessioni] = useState<SessioneUtilizzo[]>([]);
  const [sessioneAttiva, setSessioneAttiva] = useState<SessioneUtilizzo | null>(null);
  const [veicoloSelezionato, setVeicoloSelezionato] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [trackingAttivo, setTrackingAttivo] = useState(false);

  // Carica le sessioni di utilizzo
  const fetchSessioni = async () => {
    if (!user) return;

    try {
      console.log('🗺️ Caricamento sessioni GPS per utente:', user.id);

      const { data, error } = await supabase
        .from('sessioniutilizzo')
        .select(`
          sessione_id,
          veicolo_id,
          dataora_inizio,
          dataora_fine,
          km_iniziali,
          km_finali,
          km_percorsi,
          durata_minuti,
          posizione_inizio_lat,
          posizione_inizio_lng,
          posizione_fine_lat,
          posizione_fine_lng,
          note,
          sessione_attiva,
          veicoli!inner(
            nomeveicolo,
            targa,
            utente_id
          )
        `)
        .eq('Veicoli.utente_id', user.id)
        .is('dataoraelimina', null)
        .order('dataora_inizio', { ascending: false });

      if (error) {
        console.error('❌ Errore nel caricamento sessioni:', error);
        throw error;
      }

      // Trasforma i dati per la visualizzazione
      const sessioniFormattate = data?.map(item => ({
        sessione_id: item.sessione_id,
        veicolo_id: item.veicolo_id,
        dataora_inizio: item.dataora_inizio,
        dataora_fine: item.dataora_fine,
        km_iniziali: item.km_iniziali,
        km_finali: item.km_finali,
        km_percorsi: item.km_percorsi,
        durata_minuti: item.durata_minuti,
        posizione_inizio_lat: item.posizione_inizio_lat,
        posizione_inizio_lng: item.posizione_inizio_lng,
        posizione_fine_lat: item.posizione_fine_lat,
        posizione_fine_lng: item.posizione_fine_lng,
        note: item.note,
        sessione_attiva: item.sessione_attiva,
        nomeveicolo: item.veicoli.nomeveicolo,
        targa: item.veicoli.targa
      })) || [];

      console.log('✅ Sessioni caricate:', sessioniFormattate.length);
      setSessioni(sessioniFormattate);

      // Trova la sessione attiva
      const attiva = sessioniFormattate.find(s => s.sessione_attiva);
      setSessioneAttiva(attiva || null);
      setTrackingAttivo(!!attiva);

    } catch (err: any) {
      console.error('❌ Errore nel caricamento sessioni:', err);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare le sessioni di tracking"
      });
    }
  };

  // Avvia una nuova sessione di tracking
  const avviaTracking = async () => {
    if (!user || !veicoloSelezionato) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Seleziona un veicolo per avviare il tracking"
      });
      return;
    }

    try {
      console.log('▶️ Avvio tracking per veicolo:', veicoloSelezionato);

      // Controlla se ci sono già sessioni attive per questo veicolo
      const { data: sessioniAttive } = await supabase
        .from('sessioniutilizzo')
        .select('sessione_id')
        .eq('veicolo_id', veicoloSelezionato)
        .eq('sessione_attiva', true)
        .is('dataoraelimina', null);

      if (sessioniAttive && sessioniAttive.length > 0) {
        toast({
          variant: "destructive",
          title: "Tracking già attivo",
          description: "Esiste già una sessione attiva per questo veicolo"
        });
        return;
      }

      // Ottieni la posizione GPS se disponibile
      let posizioneLat: number | null = null;
      let posizioneLng: number | null = null;

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            });
          });
          
          posizioneLat = position.coords.latitude;
          posizioneLng = position.coords.longitude;
          console.log('📍 Posizione GPS ottenuta:', { lat: posizioneLat, lng: posizioneLng });
        } catch (geoError) {
          console.log('⚠️ Posizione GPS non disponibile:', geoError);
        }
      }

      // Crea la nuova sessione
      const { data, error } = await supabase
        .from('sessioniutilizzo')
        .insert({
          veicolo_id: veicoloSelezionato,
          utente_id: user.id,
          dataora_inizio: new Date().toISOString(),
          posizione_inizio_lat: posizioneLat,
          posizione_inizio_lng: posizioneLng,
          sessione_attiva: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Errore nell\'avvio tracking:', error);
        throw error;
      }

      console.log('✅ Tracking avviato:', data);
      
      // Aggiorna il veicolo con la sessione attiva
      await supabase
        .from('veicoli')
        .update({ 
          sessione_attiva_id: data.sessione_id,
          ultimo_aggiornamento_tracking: new Date().toISOString()
        })
        .eq('veicolo_id', veicoloSelezionato);

      setTrackingAttivo(true);
      await fetchSessioni();

      toast({
        title: "Tracking avviato",
        description: "Il monitoraggio GPS è stato avviato con successo"
      });

    } catch (err: any) {
      console.error('❌ Errore nell\'avvio tracking:', err);
      toast({
        variant: "destructive",
        title: "Errore",
        description: err.message || "Impossibile avviare il tracking"
      });
    }
  };

  // Ferma la sessione di tracking attiva
  const fermaTracking = async () => {
    if (!sessioneAttiva) return;

    try {
      console.log('⏹️ Arresto tracking per sessione:', sessioneAttiva.sessione_id);

      // Ottieni la posizione GPS finale se disponibile
      let posizioneLat: number | null = null;
      let posizioneLng: number | null = null;

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            });
          });
          
          posizioneLat = position.coords.latitude;
          posizioneLng = position.coords.longitude;
        } catch (geoError) {
          console.log('⚠️ Posizione GPS finale non disponibile:', geoError);
        }
      }

      const dataFine = new Date();
      const dataInizio = new Date(sessioneAttiva.dataora_inizio);
      const durataMinuti = Math.floor((dataFine.getTime() - dataInizio.getTime()) / (1000 * 60));

      // Aggiorna la sessione
      const { error } = await supabase
        .from('sessioniutilizzo')
        .update({
          dataora_fine: dataFine.toISOString(),
          posizione_fine_lat: posizioneLat,
          posizione_fine_lng: posizioneLng,
          durata_minuti: durataMinuti,
          sessione_attiva: false
        })
        .eq('sessione_id', sessioneAttiva.sessione_id);

      if (error) {
        console.error('❌ Errore nell\'arresto tracking:', error);
        throw error;
      }

      // Rimuovi la sessione attiva dal veicolo
      await supabase
        .from('veicoli')
        .update({ 
          sessione_attiva_id: null,
          ultimo_aggiornamento_tracking: new Date().toISOString()
        })
        .eq('veicolo_id', sessioneAttiva.veicolo_id);

      console.log('✅ Tracking fermato');
      setTrackingAttivo(false);
      setSessioneAttiva(null);
      await fetchSessioni();

      toast({
        title: "Tracking fermato",
        description: `Sessione durata ${durataMinuti} minuti`
      });

    } catch (err: any) {
      console.error('❌ Errore nell\'arresto tracking:', err);
      toast({
        variant: "destructive",
        title: "Errore",
        description: err.message || "Impossibile fermare il tracking"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSessioni();
      setLoading(false);
    };

    loadData();
  }, [user]);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT');
  };

  const formatDuration = (minuti: number | null) => {
    if (!minuti) return 'N/D';
    const ore = Math.floor(minuti / 60);
    const minutiRimanenti = minuti % 60;
    return ore > 0 ? `${ore}h ${minutiRimanenti}m` : `${minutiRimanenti}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tracking GPS</h1>
                <p className="text-sm text-muted-foreground">Caricamento in corso...</p>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tracking GPS</h1>
                <p className="text-sm text-muted-foreground">
                  Monitoraggio utilizzo veicoli
                </p>
              </div>
            </div>
          </div>
          {sessioneAttiva && (
            <Badge variant="default" className="bg-green-500">
              <Navigation className="h-3 w-3 mr-1" />
              Tracking attivo
            </Badge>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Sezione Controlli */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Controlli Tracking
            </CardTitle>
            <CardDescription>
              Avvia o ferma il monitoraggio GPS per i tuoi veicoli
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!trackingAttivo ? (
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Seleziona Veicolo</label>
                  <Select value={veicoloSelezionato} onValueChange={setVeicoloSelezionato}>
                    <SelectTrigger>
                      <SelectValue placeholder="Scegli un veicolo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.veicolo_id} value={vehicle.veicolo_id}>
                          {vehicle.nomeveicolo} - {vehicle.targa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={avviaTracking} 
                  disabled={!veicoloSelezionato}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Avvia Tracking
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Tracking attivo per {sessioneAttiva?.nomeveicolo} - {sessioneAttiva?.targa}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Iniziato: {sessioneAttiva && formatDateTime(sessioneAttiva.dataora_inizio)}
                  </p>
                </div>
                <Button 
                  onClick={fermaTracking}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Ferma Tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sezione Storico Sessioni */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Clock className="h-6 w-6 mr-2" />
            Storico Sessioni
          </h2>
          {sessioni.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessuna sessione di tracking registrata
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Avvia il primo tracking per iniziare a monitorare l'utilizzo dei tuoi veicoli
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessioni.map((sessione) => (
                <Card key={sessione.sessione_id} className={sessione.sessione_attiva ? 'border-green-500' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {sessione.nomeveicolo} - {sessione.targa}
                          {sessione.sessione_attiva && (
                            <Badge variant="default" className="ml-2 bg-green-500">
                              In corso
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Inizio: {formatDateTime(sessione.dataora_inizio)}
                          {sessione.dataora_fine && (
                            <> • Fine: {formatDateTime(sessione.dataora_fine)}</>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        {sessione.durata_minuti && (
                          <Badge variant="outline" className="mb-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(sessione.durata_minuti)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Km iniziali: </span>
                        {sessione.km_iniziali?.toLocaleString('it-IT') || 'N/D'}
                      </div>
                      <div>
                        <span className="font-medium">Km finali: </span>
                        {sessione.km_finali?.toLocaleString('it-IT') || 'N/D'}
                      </div>
                      <div>
                        <span className="font-medium">Km percorsi: </span>
                        {sessione.km_percorsi?.toLocaleString('it-IT') || 'N/D'}
                      </div>
                      <div>
                        <span className="font-medium">Durata: </span>
                        {formatDuration(sessione.durata_minuti)}
                      </div>
                    </div>
                    
                    {(sessione.posizione_inizio_lat || sessione.posizione_fine_lat) && (
                      <div className="mt-4 p-3 bg-muted rounded space-y-2">
                        <h4 className="font-medium text-sm flex items-center">
                          <Route className="h-4 w-4 mr-1" />
                          Informazioni GPS
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {sessione.posizione_inizio_lat && sessione.posizione_inizio_lng && (
                            <div>
                              <span className="font-medium">Partenza: </span>
                              {sessione.posizione_inizio_lat.toFixed(6)}, {sessione.posizione_inizio_lng.toFixed(6)}
                            </div>
                          )}
                          {sessione.posizione_fine_lat && sessione.posizione_fine_lng && (
                            <div>
                              <span className="font-medium">Arrivo: </span>
                              {sessione.posizione_fine_lat.toFixed(6)}, {sessione.posizione_fine_lng.toFixed(6)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {sessione.note && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <span className="font-medium text-sm">Note: </span>
                        <span className="text-sm">{sessione.note}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrackingGPS;