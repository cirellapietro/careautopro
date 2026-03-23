'use client';

import React from 'react';
import { useTracking } from '@/contexts/tracking-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Clock, StopCircle, Loader2, Gauge, AlertTriangle, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function ActiveTrackingWidget() {
  const { 
    isTracking, 
    trackedVehicle, 
    isHotspotActive,
    dailyTotalDistance, 
    dailyTotalTime, 
    stopTracking, 
    isStopping,
    sessionDistance
  } = useTracking();

  if (!isTracking || !trackedVehicle) return null;

  return (
    <Card className="overflow-hidden border-destructive/30 shadow-lg shadow-destructive/10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-destructive px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-destructive-foreground">Monitoraggio in Corso</span>
        </div>
        <div className="flex gap-2">
            {isHotspotActive && (
                <Badge variant="outline" className="bg-white/20 border-white/30 text-white text-[10px] font-bold gap-1">
                    <Wifi className="h-3 w-3" /> HOTSPOT
                </Badge>
            )}
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] font-bold">
              {trackedVehicle.licensePlate}
            </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1 w-full space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black italic uppercase text-primary leading-none">
              {trackedVehicle.name}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {trackedVehicle.make} {trackedVehicle.model} • GPS {isHotspotActive ? '& Hotspot ' : ''}Attivo
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-2xl border w-full sm:w-auto justify-around sm:justify-start">
            <div className="flex flex-col items-center px-4 border-r">
              <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                <Activity className="h-3 w-3 text-destructive" /> Km Oggi
              </span>
              <span className="text-xl font-black tabular-nums">{dailyTotalDistance.toFixed(1)}</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <span className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-destructive" /> Minuti
              </span>
              <span className="text-xl font-black tabular-nums">{Math.floor(dailyTotalTime)}</span>
            </div>
          </div>

          <Button 
            variant="destructive" 
            size="lg"
            className="w-full sm:w-auto h-14 sm:h-12 px-8 font-black uppercase tracking-tight shadow-md"
            onClick={stopTracking}
            disabled={isStopping}
          >
            {isStopping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <StopCircle className="mr-2 h-5 w-5" />
                Ferma Viaggio
              </>
            )}
          </Button>
        </div>

        {/* Notifica rapida se ci sono scadenze (Placeholder logica) */}
        <div className="mt-4 pt-4 border-t flex items-center gap-2 text-[10px] text-muted-foreground">
          <Gauge className="h-3 w-3" />
          <span>Tachimetro stimato: <strong>{Math.round(trackedVehicle.currentMileage + sessionDistance)} km</strong></span>
          <span className="mx-2 text-muted-foreground/30">|</span>
          <div className="flex items-center gap-1 text-orange-600 font-bold">
            <AlertTriangle className="h-3 w-3" />
            <span>Verifica scadenze consigliata a fine viaggio</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
