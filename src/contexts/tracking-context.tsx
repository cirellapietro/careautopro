'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo, useRef } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, getDoc, writeBatch, increment, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { calculateDistance } from '@/lib/utils';
import type { Vehicle, DailyStat } from '@/lib/types';
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
  sessionDistance: number; // Km sessione corrente
  sessionDuration: number; // Secondi sessione corrente
  liveSessionDistance: number; 
  dailyTotalDistance: number; // Totale km oggi (DB + corrente)
  dailyTotalTime: number; // Totale minuti oggi (DB + corrente)
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
    const [todayDbStats, setTodayDbStats] = useState<{ distance: number, time: number }>({ distance: 0, time: 0 });

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
    
    // Listen per le statistiche del giorno corrente del veicolo tracciato
    useEffect(() => {
        if (!user || !firestore || !trackedVehicleId) {
            setTodayDbStats({ distance: 0, time: 0 });
            return;
        }

        const todayId = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const dailyStatRef = doc(firestore, `users/${user.uid}/vehicles/${trackedVehicleId}/dailyStatistics`, todayId);

        const unsubscribe = onSnapshot(dailyStatRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTodayDbStats({
                    distance: Number(data.totalDistance) || 0,
                    time: Number(data.totalTime) || 0
                });
            } else {
                setTodayDbStats({ distance: 0, time: 0 });
            }
        });

        return () => unsubscribe();
    }, [user, firestore, trackedVehicleId]);

    // Caricamento stato locale
    useEffect(() => {
        if (user?.uid) {
            const userId = user.uid;
            const savedId = localStorage.getItem(`trackedVehicleId_${userId}`);
            if (savedId) {
                try { _setTrackedVehicleId(JSON.parse(savedId)); } catch { _setTrackedVehicleId(savedId); }
            }
            const isTrackingSaved = localStorage.getItem(`isTracking_${userId}`) === 'true';
            if (isTrackingSaved) setIsTracking(true);
            
            const distanceSaved = localStorage.getItem(`sessionDistance_${userId}`);
            if (distanceSaved) {
                distanceRef.current = parseFloat(distanceSaved);
                setSessionDistance(distanceRef.current);
            }
            const syncedSaved = localStorage.getItem(`syncedDistance_${userId}`);
            if (syncedSaved) {
                syncedDistanceRef.current = parseFloat(syncedSaved);
                setSyncedDistance(syncedDistanceRef.current);
            }
            const startSaved = localStorage.getItem(`startTime_${userId}`);
            if (startSaved) startTimeRef.current = new Date(startSaved);
        }
    }, [user?.uid]);

    const syncMileageToDb = useCallback((vehicleId: string, delta: number) => {
        if (!user || !firestore || delta <= 0) return;
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicleId);
        updateDoc(vehicleRef, { currentMileage: increment(delta) }).then(() => {
            if (user?.uid) localStorage.setItem(`syncedDistance_${user.uid}`, distanceRef.current.toString());
        }).catch(err => console.error(err));
    }, [user, firestore]);

    // Motore GPS
    useEffect(() => {
        if (!isTracking || !trackedVehicleId || permissionStatus === 'denied') {
            if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
            if (durationIntervalRef.current) { clearInterval(durationIntervalRef.current); durationIntervalRef.current = null; }
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
                setSessionDuration(Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000));
            }
        }, 1000);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                if (permissionStatus !== 'granted') setPermissionStatus('granted');
                if (position.coords.accuracy > 100) return;
                if (!lastPositionRef.current) { lastPositionRef.current = position.coords; return; }

                const d = calculateDistance(lastPositionRef.current.latitude, lastPositionRef.current.longitude, position.coords.latitude, position.coords.longitude);
                if (d > 0.003) {
                    distanceRef.current += d;
                    setSessionDistance(distanceRef.current);
                    if (user?.uid) localStorage.setItem(`sessionDistance_${user.uid}`, distanceRef.current.toString());

                    const unsyncedDistance = distanceRef.current - syncedDistanceRef.current;
                    if (unsyncedDistance >= 0.2) {
                        syncMileageToDb(trackedVehicleId, unsyncedDistance);
                        syncedDistanceRef.current = distanceRef.current;
                        setSyncedDistance(syncedDistanceRef.current);
                    }
                    lastPositionRef.current = position.coords;
                }
            },
            (error) => {
                if (error.code === 1) {
                    setPermissionStatus('denied');
                    setIsTracking(false);
                    toast({ variant: 'destructive', title: 'GPS Negato' });
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
            if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
        };
    }, [isTracking, trackedVehicleId, permissionStatus, user?.uid, syncMileageToDb, toast]);

    const setTrackedVehicleId = useCallback((id: string | null) => {
        _setTrackedVehicleId(id);
        if (user?.uid) localStorage.setItem(`trackedVehicleId_${user.uid}`, JSON.stringify(id));
    }, [user?.uid]);

    const stopTracking = useCallback(async () => {
        setIsStopping(true);
        const trackedDistance = distanceRef.current;
        const trackedDurationMin = startTimeRef.current ? (Date.now() - startTimeRef.current.getTime()) / 60000 : 0;
        const finalUnsyncedDistance = trackedDistance - syncedDistanceRef.current;

        if (!user || !firestore || !trackedVehicleId) {
            setIsTracking(false);
            setIsStopping(false);
            return;
        }

        try {
            const batch = writeBatch(firestore);
            const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, trackedVehicleId);
            batch.update(vehicleRef, { trackingGPS: false });

            if (trackedDistance > 0.01) {
                const sessionRef = doc(collection(vehicleRef, 'trackingSessions'));
                batch.set(sessionRef, {
                    id: sessionRef.id,
                    vehicleId: trackedVehicleId,
                    startTime: startTimeRef.current?.toISOString(),
                    endTime: new Date().toISOString(),
                    distanceTraveled: trackedDistance,
                    duration: trackedDurationMin,
                    dataoraelimina: null,
                });
                
                if (finalUnsyncedDistance > 0) batch.update(vehicleRef, { currentMileage: increment(finalUnsyncedDistance) });

                const todayId = new Date().toISOString().split('T')[0].replace(/-/g, '');
                const dailyStatRef = doc(collection(vehicleRef, 'dailyStatistics'), todayId);
                const dailySnap = await getDoc(dailyStatRef);

                if (dailySnap.exists()) {
                    batch.update(dailyStatRef, { totalDistance: increment(trackedDistance), totalTime: increment(trackedDurationMin) });
                } else {
                    batch.set(dailyStatRef, { id: todayId, vehicleId: trackedVehicleId, date: new Date().toISOString(), totalDistance: trackedDistance, totalTime: trackedDurationMin, dataoraelimina: null });
                }
                await batch.commit();
                toast({ title: 'Sessione Salvata', description: `Percorsi ${trackedDistance.toFixed(2)} km.` });
            } else {
                await updateDoc(vehicleRef, { trackingGPS: false });
            }
        } catch (e) { console.error(e); } finally {
            setIsTracking(false);
            distanceRef.current = 0; syncedDistanceRef.current = 0; lastPositionRef.current = null; startTimeRef.current = null;
            setSessionDistance(0); setSessionDuration(0); setSyncedDistance(0);
            if (user?.uid) {
                localStorage.removeItem(`isTracking_${user.uid}`);
                localStorage.removeItem(`sessionDistance_${user.uid}`);
                localStorage.removeItem(`syncedDistance_${user.uid}`);
                localStorage.removeItem(`startTime_${user.uid}`);
            }
            setIsStopping(false);
        }
    }, [user, firestore, trackedVehicleId, toast]);

    const startTracking = useCallback((id?: string) => {
        const targetId = id || trackedVehicleId;
        if (!targetId || !user || !firestore) return;
        if (permissionStatus === 'denied') { toast({ variant: 'destructive', title: 'GPS Disabilitato' }); return; }
        
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, targetId);
        updateDoc(vehicleRef, { trackingGPS: true });
        setTrackedVehicleId(targetId);
        setIsTracking(true);
    }, [permissionStatus, trackedVehicleId, user, firestore, setTrackedVehicleId, toast]);

    const switchTrackingTo = useCallback(async (id: string) => {
        if (isTracking) await stopTracking();
        startTracking(id);
    }, [isTracking, stopTracking, startTracking]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' as any }).then(res => {
                setPermissionStatus(res.state as PermissionStatus);
                res.onchange = () => setPermissionStatus(res.state as PermissionStatus);
            });
        }
    }, []);

    const dailyTotalDistance = todayDbStats.distance + sessionDistance;
    const dailyTotalTime = todayDbStats.time + (sessionDuration / 60);

    const value = useMemo(() => ({
        permissionStatus, isTracking, isStopping, trackedVehicleId, setTrackedVehicleId, startTracking, stopTracking, switchTrackingTo,
        trackedVehicle: vehicles?.find(v => v.id === trackedVehicleId) || null,
        vehicles: vehicles || [],
        sessionDistance, sessionDuration, liveSessionDistance: Math.max(0, sessionDistance - syncedDistance),
        dailyTotalDistance, dailyTotalTime
    }), [permissionStatus, isTracking, isStopping, trackedVehicleId, setTrackedVehicleId, startTracking, stopTracking, switchTrackingTo, vehicles, sessionDistance, sessionDuration, syncedDistance, dailyTotalDistance, dailyTotalTime]);

    return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking() {
    const ctx = useContext(TrackingContext);
    if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
    return ctx;
}
