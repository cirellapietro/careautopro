import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vehicle } from '@/hooks/useVehicles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const vehicleSchema = z.object({
  nomeveicolo: z.string().min(1, 'Nome veicolo richiesto'),
  targa: z.string().min(1, 'Targa richiesta'),
  kmattuali: z.number().min(0, 'Km attuali deve essere maggiore di 0'),
  dataimmatricolazione: z.date({
    required_error: 'Data immatricolazione richiesta',
  }),
  kmanno: z.number().min(0, 'Km annuali deve essere maggiore di 0').optional(),
  cilindrata: z.number().min(0, 'Cilindrata deve essere maggiore di 0').optional(),
  kw: z.number().min(0, 'Potenza deve essere maggiore di 0').optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
  onSubmit: (data: Partial<Vehicle>) => Promise<{ success: boolean; error?: string }>;
}

export const VehicleForm = ({ open, onOpenChange, vehicle, onSubmit }: VehicleFormProps) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!vehicle;

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      nomeveicolo: vehicle?.nomeveicolo || '',
      targa: vehicle?.targa || '',
      kmattuali: vehicle?.kmattuali || 0,
      dataimmatricolazione: vehicle?.dataimmatricolazione ? new Date(vehicle.dataimmatricolazione) : new Date(),
      kmanno: vehicle?.kmanno || undefined,
      cilindrata: vehicle?.cilindrata || undefined,
      kw: vehicle?.kw || undefined,
    },
  });

  const handleSubmit = async (data: VehicleFormData) => {
    setLoading(true);
    try {
      const result = await onSubmit({
        ...data,
        dataimmatricolazione: data.dataimmatricolazione.toISOString().split('T')[0],
      });
      
      if (result.success) {
        onOpenChange(false);
        form.reset();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifica Veicolo' : 'Aggiungi Nuovo Veicolo'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Modifica i dettagli del tuo veicolo' 
              : 'Inserisci i dettagli del nuovo veicolo da aggiungere'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nomeveicolo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Veicolo *</FormLabel>
                  <FormControl>
                    <Input placeholder="es. Fiat Panda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Targa *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="es. AB123CD" 
                      {...field} 
                      className="uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kmattuali"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Km Attuali *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataimmatricolazione"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data Immatricolazione *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Seleziona data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kmanno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Km/Anno Previsti</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="15000" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cilindrata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cilindrata (cc)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1400" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potenza (kW)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="75" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Aggiorna' : 'Aggiungi'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};