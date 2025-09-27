import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Settings, ArrowLeft, Plus, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Manutenzione {
  intervento_id: string;
  dataoraintervento: string;
  kmintervento: number;
  descrizioneaggiuntiva: string | null;
  controlloperiodico_id: string;
  veicolo_id: string;
  // Dati del controllo periodico
  nomecontrollo: string;
  descrizione: string;
  frequenzakm: number;
  frequenzamesi: number;
  // Dati del veicolo
  nomeveicolo: string;
  targa: string;
  kmattuali: number;
}

const Manutenzioni = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [manutenzioni, setManutenzioni] = useState<Manutenzione[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica le manutenzioni effettuate
  const fetchManutenzioni = async () => {
    if (!user) return;

    try {
      console.log('🔧 Caricamento manutenzioni per utente:', user.id);

      const { data, error } = await supabase
        .from('interventi')
        .select(`
          intervento_id,
          dataoraintervento,
          kmintervento,
          descrizioneaggiuntiva,
          controlloperiodico_id,
          veicolo_id,
          controlliperiodici!inner(
            nomecontrollo,
            descrizione,
            frequenzakm,
            frequenzamesi
          ),
          veicoli!inner(
            nomeveicolo,
            targa,
            kmattuali,
            utente_id
          )
        `)
        .eq('veicoli.utente_id', user.id)
        .is('dataoraelimina', null)
        .order('dataoraintervento', { ascending: false });

      if (error) {
        console.error('❌ Errore nel caricamento manutenzioni:', error);
        throw error;
      }

      // Trasforma i dati per la visualizzazione
      const manutenzioniFormattate = data?.map(item => ({
        intervento_id: item.intervento_id,
        dataoraintervento: item.dataoraintervento,
        kmintervento: item.kmintervento,
        descrizioneaggiuntiva: item.descrizioneaggiuntiva,
        controlloperiodico_id: item.controlloperiodico_id,
        veicolo_id: item.veicolo_id,
        nomecontrollo: item.controlliperiodici.nomecontrollo,
        descrizione: item.controlliperiodici.descrizione,
        frequenzakm: item.controlliperiodici.frequenzakm,
        frequenzamesi: item.controlliperiodici.frequenzamesi,
        nomeveicolo: item.veicoli.nomeveicolo,
        targa: item.veicoli.targa,
        kmattuali: item.veicoli.kmattuali
      })) || [];

      console.log('✅ Manutenzioni caricate:', manutenzioniFormattate.length);
      setManutenzioni(manutenzioniFormattate);

    } catch (err: any) {
      console.error('❌ Errore nel caricamento manutenzioni:', err);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare le manutenzioni"
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchManutenzioni();
      setLoading(false);
    };

    loadData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
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
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Manutenzioni</h1>
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
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Manutenzioni</h1>
                <p className="text-sm text-muted-foreground">
                  Gestione interventi e controlli periodici
                </p>
              </div>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Intervento
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Sezione Storico */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Storico Manutenzioni
          </h2>
          {manutenzioni.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessuna manutenzione registrata
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Inizia a registrare i tuoi interventi per tenere traccia della manutenzione dei veicoli
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {manutenzioni.map((manutenzione) => (
                <Card key={manutenzione.intervento_id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{manutenzione.nomecontrollo}</CardTitle>
                        <CardDescription>
                          {manutenzione.nomeveicolo} - {manutenzione.targa}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {formatDate(manutenzione.dataoraintervento)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{manutenzione.descrizione}</p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="font-medium">Km intervento: </span>
                        {manutenzione.kmintervento.toLocaleString('it-IT')}
                      </div>
                      <div>
                        <span className="font-medium">Frequenza: </span>
                        ogni {manutenzione.frequenzakm.toLocaleString('it-IT')} km / {manutenzione.frequenzamesi} mesi
                      </div>
                    </div>
                    {manutenzione.descrizioneaggiuntiva && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <span className="font-medium text-sm">Note: </span>
                        <span className="text-sm">{manutenzione.descrizioneaggiuntiva}</span>
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

export default Manutenzioni;
