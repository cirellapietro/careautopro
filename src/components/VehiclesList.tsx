import { useState } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Car, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VehiclesList = () => {
  const { vehicles, loading, error, deleteVehicle } = useVehicles();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    // TODO: Implementare modifica veicolo
    toast({
      title: "Modifica veicolo",
      description: `Modifica di ${vehicle.nomeveicolo} - funzionalità in arrivo`,
    });
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo veicolo?')) return;
    
    setDeletingId(vehicleId);
    const result = await deleteVehicle(vehicleId);
    
    if (result.success) {
      toast({
        title: "Veicolo eliminato",
        description: "Il veicolo è stato eliminato con successo",
      });
    } else {
      toast({
        title: "Errore",
        description: result.error || "Errore nell'eliminazione del veicolo",
        variant: "destructive",
      });
    }
    setDeletingId(null);
  };

  const handleTrack = (vehicle: Vehicle) => {
    // TODO: Implementare tracking veicolo
    toast({
      title: "Tracking GPS",
      description: `Tracking di ${vehicle.nomeveicolo} - funzionalità in arrivo`,
    });
  };

  const handleAddVehicle = () => {
    // TODO: Implementare aggiunta veicolo
    toast({
      title: "Aggiungi veicolo",
      description: "Funzionalità in arrivo",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            <Car className="h-6 w-6 mr-2 text-primary" />
            I Miei Veicoli
          </h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Car className="h-6 w-6 mr-2 text-primary" />
          I Miei Veicoli
        </h2>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Errore nel caricamento dei veicoli: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Car className="h-6 w-6 mr-2 text-primary" />
          I Miei Veicoli
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            ({vehicles.length})
          </span>
        </h2>
        <Button onClick={handleAddVehicle} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nessun veicolo trovato</h3>
              <p className="text-muted-foreground mb-4">
                Aggiungi il tuo primo veicolo per iniziare
              </p>
              <Button onClick={handleAddVehicle}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Primo Veicolo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.veicolo_id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTrack={handleTrack}
            />
          ))}
        </div>
      )}
    </div>
  );
};