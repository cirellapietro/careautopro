import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Gauge, Settings, Trash2, Edit, MapPin } from 'lucide-react';
import { Vehicle } from '@/hooks/useVehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
  onTrack: (vehicle: Vehicle) => void;
}

export const VehicleCard = ({ vehicle, onEdit, onDelete, onTrack }: VehicleCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const calculateAge = (registrationDate: string) => {
    const years = new Date().getFullYear() - new Date(registrationDate).getFullYear();
    return years;
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{vehicle.nomeveicolo || 'Veicolo'}</p>
              <p className="text-sm font-normal text-muted-foreground">{vehicle.targa}</p>
            </div>
          </div>
          <Badge variant="secondary">{calculateAge(vehicle.dataimmatricolazione)} anni</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statistiche principali */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Gauge className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold text-primary">{vehicle.kmattuali?.toLocaleString() || '0'}</p>
            <p className="text-xs text-muted-foreground">km attuali</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-secondary-foreground" />
            <p className="text-sm font-medium">{formatDate(vehicle.dataimmatricolazione)}</p>
            <p className="text-xs text-muted-foreground">immatricolazione</p>
          </div>
        </div>

        {/* Dettagli tecnici */}
        {(vehicle.cilindrata || vehicle.kw) && (
          <div className="flex justify-between text-sm">
            {vehicle.cilindrata && (
              <span className="text-muted-foreground">
                Cilindrata: <span className="font-medium">{vehicle.cilindrata}cc</span>
              </span>
            )}
            {vehicle.kw && (
              <span className="text-muted-foreground">
                Potenza: <span className="font-medium">{vehicle.kw}kW</span>
              </span>
            )}
          </div>
        )}

        {/* Km annuali */}
        {vehicle.kmanno && (
          <div className="text-sm text-muted-foreground">
            Km/anno previsti: <span className="font-medium">{vehicle.kmanno.toLocaleString()}</span>
          </div>
        )}

        {/* Azioni */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTrack(vehicle)}
            className="flex-1 min-w-0"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Tracking
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(vehicle)}
            className="flex-1 min-w-0"
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifica
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(vehicle.veicolo_id)}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};