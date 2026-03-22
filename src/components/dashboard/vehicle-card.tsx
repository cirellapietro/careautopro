
'use client';

import { type Vehicle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Zap, Leaf, Flame, PlayCircle, StopCircle, Loader2, Gauge, Timer, Activity } from 'lucide-react';
import React from 'react';
import { useTracking } from '@/contexts/tracking-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


type VehicleCardProps = {
  vehicle: Vehicle;
};

const VehicleIcon = ({ type, className }: { type: string, className?: string }) => {
    const vehicleType = type?.toLowerCase() || '';

    switch (vehicleType) {
        case 'elettrica':
            return <Zap className={className} />;
        case 'ibrida':
            return <Leaf className={className} />;
        case 'gpl':
        case 'metano':
            return <Flame className={className} />;
        default:
            return <Car className={className} />;
    }
};


export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  const { 
    trackedVehicleId, 
    isTracking,
    startTracking,
    stopTracking,
    isStopping,
    permissionStatus,
    switchTrackingTo,
    sessionDistance,
    sessionDuration,
    liveSessionDistance,
  } = useTracking();

  const isThisVehicleBeingTracked = trackedVehicleId === vehicle.id && isTracking;
  
  // Abilitiamo il tasto se il permesso non è espressamente negato
  const canStartTracking = permissionStatus !== 'denied';

  const registrationYear = vehicle.registrationDate && !isNaN(new Date(vehicle.registrationDate).getTime()) 
    ? new Date(vehicle.registrationDate).getFullYear() 
    : 'N/D';

  const lastMaintenance = vehicle.lastMaintenanceDate && !isNaN(new Date(vehicle.lastMaintenanceDate).getTime())
    ? new Date(vehicle.lastMaintenanceDate).toLocaleDateString('it-IT')
    : 'N/D';

  const baseMileage = typeof vehicle.currentMileage === 'number' ? vehicle.currentMileage : 0;
  
  // Chilometraggio totale aggiornato in tempo reale durante il tracking.
  // Sommiamo al baseMileage (dal DB) la liveSessionDistance (km percorsi ma non ancora sincronizzati nel DB).
  const displayMileage = isThisVehicleBeingTracked ? baseMileage + liveSessionDistance : baseMileage;

  const handleCardClick = () => {
    router.push(`/dashboard/vehicles/view?id=${vehicle.id}`);
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
        const paddedHours = String(hours).padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }
    
    return `${paddedMinutes}:${paddedSeconds}`;
  };

  const renderFooter = () => {
    if (isThisVehicleBeingTracked) {
      return (
        <Button onClick={(e) => handleButtonClick(e, stopTracking)} variant="destructive" className="w-full font-bold shadow-md" disabled={isStopping}>
          {isStopping ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <StopCircle className="mr-2 h-4 w-4" />}
          Ferma Tracking GPS
        </Button>
      );
    }

    if (isTracking) {
       return (
            <Button onClick={(e) => handleButtonClick(e, () => switchTrackingTo(vehicle.id))} variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                <PlayCircle className="mr-2 h-4 w-4" /> Passa Tracking a questo Veicolo
            </Button>
        );
    }
    
    return (
        <Button 
            onClick={(e) => handleButtonClick(e, () => startTracking(vehicle.id))} 
            className="w-full font-bold" 
            disabled={!canStartTracking}
        >
            <PlayCircle className="mr-2 h-4 w-4" /> Avvia Tracking GPS
        </Button>
    );
  }

  return (
    <Card 
        className={cn(
            "flex flex-col transition-all duration-300 cursor-pointer hover:bg-muted/50 relative overflow-hidden", 
            isThisVehicleBeingTracked && "ring-2 ring-destructive bg-destructive/5 shadow-xl shadow-destructive/10 border-destructive/50"
        )}
        onClick={handleCardClick}
    >
        {isThisVehicleBeingTracked && (
            <div className="absolute top-0 right-0 p-2">
                <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
            </div>
        )}
        
        <CardHeader className="flex flex-col items-center justify-center p-6 text-center">
            <div className={cn(
                "mb-4 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500",
                isThisVehicleBeingTracked ? "bg-destructive/20 scale-110" : "bg-secondary"
            )}>
                <VehicleIcon type={vehicle.type} className={cn("h-12 w-12 transition-colors", isThisVehicleBeingTracked ? "text-destructive" : "text-accent")} />
            </div>
            <Badge variant={isThisVehicleBeingTracked ? "destructive" : "outline"} className={cn(isThisVehicleBeingTracked && "animate-pulse")}>
                {isThisVehicleBeingTracked ? "IN MOVIMENTO" : vehicle.type}
            </Badge>
            <CardTitle className="font-headline text-2xl mt-2">{vehicle.name}</CardTitle>
            <CardDescription>{vehicle.make} {vehicle.model} - {registrationYear}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6 pt-0">
            <div className="border-t pt-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                    <span>Chilometraggio:</span>
                    <span className={cn(
                        "font-bold text-xl tabular-nums transition-colors", 
                        isThisVehicleBeingTracked ? "text-destructive" : "text-foreground"
                    )}>
                        {/* Arrotondiamo sempre all'intero per una visualizzazione pulita */}
                        {Math.round(displayMileage).toLocaleString('it-IT')} km
                    </span>
                </div>
                
                {isThisVehicleBeingTracked && (
                    <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-background/80 backdrop-blur rounded-md border border-destructive/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Sessione Km</p>
                            <p className="flex items-center gap-1 text-sm font-black text-foreground">
                                <Activity className="h-3 w-3 text-destructive" /> 
                                {sessionDistance.toFixed(2)}
                            </p>
                        </div>
                        <div className="space-y-1 border-l pl-3">
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tempo</p>
                            <p className="flex items-center gap-1 text-sm font-black text-foreground">
                                <Timer className="h-3 w-3 text-destructive" /> 
                                {formatDuration(sessionDuration)}
                            </p>
                        </div>
                    </div>
                )}
                
                {!isThisVehicleBeingTracked && (
                    <p className="mt-2 text-xs">Ultima manutenzione: <span className="font-semibold text-foreground">{lastMaintenance}</span></p>
                )}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            {renderFooter()}
        </CardFooter>
    </Card>
  );
}
