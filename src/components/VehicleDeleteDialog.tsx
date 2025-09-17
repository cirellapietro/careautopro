import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Vehicle } from '@/hooks/useVehicles';
import { Trash2 } from 'lucide-react';

interface VehicleDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onConfirm: () => void;
  loading?: boolean;
}

export const VehicleDeleteDialog = ({ 
  open, 
  onOpenChange, 
  vehicle, 
  onConfirm, 
  loading 
}: VehicleDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-destructive" />
            Elimina Veicolo
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sei sicuro di voler eliminare il veicolo{' '}
            <span className="font-semibold">
              {vehicle?.nomeveicolo} ({vehicle?.targa})
            </span>
            ?
            <br />
            <br />
            Questa azione eliminerà anche tutti i dati di tracking e manutenzione associati. 
            L'operazione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Annulla
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Eliminazione...' : 'Elimina'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};