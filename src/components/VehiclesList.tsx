import { useState } from 'react';
import { useVehicles, Vehicle } from '@/hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { VehicleForm } from './VehicleForm';
import { VehicleDeleteDialog } from './VehicleDeleteDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Car, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VehiclesList = () => {
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { toast } = useToast();
  
  // Stati per i dialoghi
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDelete = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.veicolo_id === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedVehicle) return;
    
    setDeletingId(selectedVehicle.veicolo_id);
    const result = await deleteVehicle(selectedVehicle.veicolo_id);
    
    if (result.success) {
      toast({
        title: "Veicolo eliminato",
        description: "Il veicolo è stato eliminato con successo",
      });
      setDeleteDialogOpen(false);
      setSelectedVehicle(null);
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
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Vehicle>) => {
    if (selectedVehicle) {
      // Modifica
      const result = await updateVehicle(selectedVehicle.veicolo_id, data);
      if (result.success) {
        toast({
          title: "Veicolo aggiornato",
          description: "Il veicolo è stato aggiornato con successo",
        });
      } else {
        toast({
          title: "Errore",
          description: result.error || "Errore nell'aggiornamento del veicolo",
          variant: "destructive",
        });
      }
      return result;
    } else {
      // Aggiungi
      const result = await addVehicle(data);
      if (result.success) {
        toast({
          title: "Veicolo aggiunto",
          description: "Il nuovo veicolo è stato aggiunto con successo",
        });
      } else {
        toast({
          title: "Errore",
          description: result.error || "Errore nell'aggiunta del veicolo",
          variant: "destructive",
        });
      }
      return result;
    }
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

      {/* Dialoghi */}
      <VehicleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={selectedVehicle}
        onSubmit={handleFormSubmit}
      />

      <VehicleDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        vehicle={selectedVehicle}
        onConfirm={confirmDelete}
        loading={deletingId === selectedVehicle?.veicolo_id}
      />
    </div>
  );
};