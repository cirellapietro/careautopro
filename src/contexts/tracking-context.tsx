'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, getDoc, writeBatch, increment, updateDoc, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { useCollection } from '@/firebase';

type PermissionStatus = 'prompt' | 'granted' | 'denied';

interface TrackingContextType {
  permissionStatus: PermissionStatus;
  isTracking: boolean;
  isStopping: boolean;
  trackedVehicleId: string | null;
  setTrackedVehicleId: (id: string | null) => void;
  startTracking: (vehicleIdOverride?: string) => void;
  stopTracking: () => Promise<void>;
  switchTrackingTo: (newVehicleId: string) => Promise<void>;
  trackedVehicle: Vehicle | null;
  vehicles: Vehicle[];
  sessionDistance: number; // Totale km sessione corrente
  sessionDuration: number; // in secondi
  liveSessionDistance: number; // Distanza non ancora sincronizzata nel DB
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
    const [isTracking, setIsTracking] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [trackedVehicleId, _setTrackedVehicleId] = useState<string | null>(null);
    
    const [sessionDistance, setSessionDistance] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [syncedDistance, setSyncedDistance] = useState(0);

    const watchIdRef = useRef<number | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastPositionRef = useRef<GeolocationCoordinates | null>(null);
    const distanceRef = useRef(0);
    const syncedDistanceRef = useRef(0);
    const startTimeRef = useRef<Date | null>(null);

    // Fetch vehicles from Firestore
    const vehiclesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/vehicles`), where('dataoraelimina', '==', null));
    }, [user, firestore]);
    const { data: vehicles } = useCollection<Vehicle>(vehiclesQuery);
    
    // CARICAMENTO INIZIALE
    useEffect(() => {
        if (user?.uid) {
            const userId = user.uid;
            
            const savedId = localStorage.getItem(`trackedVehicleId_${userId}`);
            if (savedId) {
                try {
                    _setTrackedVehicleId(JSON.parse(savedId));
                } catch {
                    _setTrackedVehicleId(savedId);
                }
            }

            const isTrackingSaved = localStorage.getItem(`isTracking_${userId}`) === 'true';
            const distanceSaved = localStorage.getItem(`sessionDistance_${userId}`);
            const syncedSaved = localStorage.getItem(`syncedDistance_${userId}`);
            const startSaved = localStorage.getItem(`startTime_${userId}`);

            if (distanceSaved) {
                distanceRef.current = parseFloat(distanceSaved);
                setSessionDistance(distanceRef.current);
            }

            if (syncedSaved) {
                syncedDistanceRef.current = parseFloat(syncedSaved);
                setSyncedDistance(syncedDistanceRef.current);
            }

            if (startSaved) {
                startTimeRef.current = new Date(startSaved);
            }

            if (isTrackingSaved) {
                setIsTracking(true);
            }
        }
    }, [user?.uid]);

    // Sincronizza i chilometri nel DB periodicamente
    const syncMileageToDb = useCallback((vehicleId: string, delta: number) => {
        if (!user || !firestore || delta <= 0) return;
        
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicleId);
        updateDoc(vehicleRef, { currentMileage: increment(delta) }).then(() => {
            if (user?.uid) {
                localStorage.setItem(`syncedDistance_${user.uid}`, distanceRef.current.toString());
            }
        }).catch(err => {
            console.error("Errore sincronizzazione chilometri:", err);
        });
    }, [user, firestore]);

    // MOTORE DI CALCOLO GPS
    useEffect(() => {
        if (!isTracking || !trackedVehicleId || permissionStatus !== 'granted') {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
                durationIntervalRef.current = null;
            }
            return;
        }

        if (!startTimeRef.current) {
            startTimeRef.current = new Date();
            if (user?.uid) {
                localStorage.setItem(`startTime_${user.uid}`, startTimeRef.current.toISOString());
                localStorage.setItem(`isTracking_${user.uid}`, 'true');
            }
        }

        durationIntervalRef.current = setInterval(() => {
            if (startTimeRef.current) {
                const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
                setSessionDuration(elapsedSeconds);
            }
        }, 1000);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                if (position.coords.accuracy > 100) return;

                if (!lastPositionRef.current) {
                    lastPositionRef.current = position.coords;
                    return;
                }

                const d = calculateDistance(
                    lastPositionRef.current.latitude,
                    lastPositionRef.current.longitude,
                    position.coords.latitude,
                    position.coords.longitude
                );
                
                if (d > 0.003) { 
                    distanceRef.current += d;
                    setSessionDistance(distanceRef.current);
                    
                    if (user?.uid) {
                        localStorage.setItem(`sessionDistance_${user.uid}`, distanceRef.current.toString());
                    }

                    const unsyncedDistance = distanceRef.current - syncedDistanceRef.current;
                    // Sincronizza ogni 200 metri nel DB principale
                    if (unsyncedDistance >= 0.2) {
                        syncMileageToDb(trackedVehicleId, unsyncedDistance);
                        syncedDistanceRef.current = distanceRef.current;
                        setSyncedDistance(syncedDistanceRef.current);
                    }

                    lastPositionRef.current = position.coords;
                }
            },
            (error) => {
                console.error("GPS Error:", error);
                if (error.code === 1) setPermissionStatus('denied');
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 0 
            }
        );

        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
            if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
        };
    }, [isTracking, trackedVehicleId, permissionStatus, user?.uid, syncMileageToDb]);

    const setTrackedVehicleId = useCallback((id: string | null) => {
        _setTrackedVehicleId(id);
        if (user?.uid) {
            localStorage.setItem(`trackedVehicleId_${user.uid}`, JSON.stringify(id));
        }
    }, [user?.uid]);

    const trackedVehicle = useMemo(() => {
        return vehicles?.find(v => v.id === trackedVehicleId) || null;
    }, [vehicles, trackedVehicleId]);

    const resetTrackingState = useCallback(() => {
        distanceRef.current = 0;
        syncedDistanceRef.current = 0;
        lastPositionRef.current = null;
        startTimeRef.current = null;
        setSessionDistance(0);
        setSessionDuration(0);
        setSyncedDistance(0);

        if (user?.uid) {
            localStorage.removeItem(`isTracking_${user.uid}`);
            localStorage.removeItem(`sessionDistance_${user.uid}`);
            localStorage.removeItem(`syncedDistance_${user.uid}`);
            localStorage.removeItem(`startTime_${user.uid}`);
        }
    }, [user?.uid]);

    const startTracking = useCallback((vehicleIdOverride?: string) => {
        const idToTrack = vehicleIdOverride || trackedVehicleId;
        
        if (!idToTrack || !user || !firestore) {
            toast({ variant: 'destructive', title: 'Attenzione', description: 'Seleziona un veicolo per iniziare.' });
            return;
        }

        if (permissionStatus !== 'granted') {
            toast({ variant: 'destructive', title: 'Permessi GPS', description: 'Abilita i permessi GPS per tracciare i chilometri.' });
            return;
        }

        // Reset state for new session
        resetTrackingState();
        
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, idToTrack);
        updateDoc(vehicleRef, { trackingGPS: true }).catch(e => console.error(e));

        setTrackedVehicleId(idToTrack);
        setIsTracking(true);
        toast({ title: 'Tracking avviato', description: 'Il GPS monitorerà il tuo percorso.' });
    }, [permissionStatus, trackedVehicleId, user, firestore, setTrackedVehicleId, toast, resetTrackingState]);

    const stopTracking = useCallback(async () => {
        setIsStopping(true);
        const trackedDistance = distanceRef.current;
        const trackedDuration = startTimeRef.current ? (Date.now() - startTimeRef.current.getTime()) / 60000 : 0;
        const finalUnsyncedDistance = trackedDistance - syncedDistanceRef.current;

        if (!user || !firestore || !trackedVehicleId) {
            setIsTracking(false);
            resetTrackingState();
            setIsStopping(false);
            return;
        }

        try {
            const batch = writeBatch(firestore);
            const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, trackedVehicleId);
            
            batch.update(vehicleRef, { trackingGPS: false });

            if (trackedDistance > 0.01) {
                // 1. Salva la sessione di tracking
                const sessionRef = doc(collection(vehicleRef, 'trackingSessions'));
                batch.set(sessionRef, {
                    id: sessionRef.id,
                    vehicleId: trackedVehicleId,
                    startTime: startTimeRef.current?.toISOString(),
                    endTime: new Date().toISOString(),
                    distanceTraveled: trackedDistance,
                    duration: trackedDuration,
                    dataoraelimina: null,
                });
                
                // 2. Sincronizza l'ultimo delta di chilometri nel totale del veicolo
                if (finalUnsyncedDistance > 0) {
                    batch.update(vehicleRef, { currentMileage: increment(finalUnsyncedDistance) });
                }

                // 3. Aggiorna statistiche giornaliere
                const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
                const dailyStatRef = doc(collection(vehicleRef, 'dailyStatistics'), todayStr);
                const dailyStatSnap = await getDoc(dailyStatRef);

                if (dailyStatSnap.exists()) {
                    batch.update(dailyStatRef, {
                        totalDistance: increment(trackedDistance),
                        totalTime: increment(trackedDuration),
                    });
                } else {
                    batch.set(dailyStatRef, {
                        id: todayStr,
                        vehicleId: trackedVehicleId,
                        date: new Date().toISOString(),
                        totalDistance: trackedDistance,
                        totalTime: trackedDuration,
                        dataoraelimina: null,
                    });
                }
                await batch.commit();
                toast({ title: 'Viaggio completato!', description: `Hai percorso ${trackedDistance.toFixed(2)} km.` });
            } else {
                await updateDoc(vehicleRef, { trackingGPS: false });
            }
        } catch (e: any) {
            console.error("Save Error:", e);
        } finally {
            setIsTracking(false);
            resetTrackingState();
            setIsStopping(false);
        }
    }, [user, firestore, trackedVehicleId, toast, resetTrackingState]);

    const switchTrackingTo = useCallback(async (newVehicleId: string) => {
        if (isTracking) {
            await stopTracking();
        }
        startTracking(newVehicleId);
    }, [isTracking, stopTracking, startTracking]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ('permissions' in navigator) {
                navigator.permissions.query({ name: 'geolocation' as any }).then(result => {
                    setPermissionStatus(result.state as PermissionStatus);
                    result.onchange = () => setPermissionStatus(result.state as PermissionStatus);
                });
            } else {
                 navigator.geolocation.getCurrentPosition(
                    () => setPermissionStatus('granted'),
                    () => setPermissionStatus('denied')
                );
            }
        }
    }, []);

    const value = useMemo(() => ({
        permissionStatus,
        isTracking,
        isStopping,
        trackedVehicleId,
        setTrackedVehicleId,
        startTracking,
        stopTracking,
        switchTrackingTo,
        trackedVehicle,
        vehicles: vehicles || [],
        sessionDistance,
        sessionDuration,
        liveSessionDistance: Math.max(0, sessionDistance - syncedDistance),
    }), [permissionStatus, isTracking, isStopping, trackedVehicleId, setTrackedVehicleId, startTracking, stopTracking, switchTrackingTo, trackedVehicle, vehicles, sessionDistance, sessionDuration, syncedDistance]);

    return (
        <TrackingContext.Provider value={value}>
            {children}
        </TrackingContext.Provider>
    );
}

export function useTracking(): TrackingContextType {
    const context = useContext(TrackingContext);
    if (context === undefined) {
        throw new Error('useTracking must be used within a TrackingProvider');
    }
    return context;
}