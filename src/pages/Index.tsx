import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, LogOut, Plus, Calendar, Settings, MapPin } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">CareAutoPro</h1>
              <p className="text-sm text-muted-foreground">
                Benvenuto, {user?.user_metadata?.nomeutente || user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Esci
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* I Miei Veicoli */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                I Miei Veicoli
              </CardTitle>
              <CardDescription>
                Gestisci e monitora i tuoi veicoli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Veicolo
              </Button>
            </CardContent>
          </Card>

          {/* Manutenzioni */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Manutenzioni
              </CardTitle>
              <CardDescription>
                Programma e registra interventi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Visualizza Calendario
              </Button>
            </CardContent>
          </Card>

          {/* Tracking GPS */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Tracking GPS
              </CardTitle>
              <CardDescription>
                Monitora km e utilizzo veicoli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Avvia Tracking
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sezione notifiche rapide */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Notifiche Recenti</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Nessuna notifica al momento
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
