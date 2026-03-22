
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
  lastTrackedVehicleId: string | null;
  setTrackedVehicleId: (id: string | null) => void;
  startTracking: (vehicleIdOverride?: string) => void;
  stopTracking: () => Promise<void>;
  switchTrackingTo: (newVehicleId: string) => Promise<void>;
  trackedVehicle: Vehicle | null;
  vehicles: Vehicle[];
  sessionDistance: number; 
  sessionDuration: number; 
  liveSessionDistance: number; 
  dailyTotalDistance: number; 
  dailyTotalTime: number; 
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
    const [lastTrackedVehicleId, setLastTrackedVehicleId] = useState<string | null>(null);
    
    const [sessionDistance, setSessionDistance] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [syncedDistance, setSyncedDistance] = useState(0);
    const [todayDbStats, setTodayDbStats] = useState<{ distance: number, time: number }>({ distance: 0, time: 0 });

    const watchIdRef = useRef<number | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastPositionRef = useRef<GeolocationCoordinates | null>(null);
    const distanceRef = useRef(0);
    const syncedDistanceRef = useRef(0);
    const syncedTimeSecondsRef = useRef(0);
    const startTimeRef = useRef<Date | null>(null);

    // Fetch vehicles
    const vehiclesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/vehicles`), where('dataoraelimina', '==', null));
    }, [user, firestore]);
    const { data: vehicles } = useCollection<Vehicle>(vehiclesQuery);
    
    // Listen for daily stats
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

    // Restore state
    useEffect(() => {
        if (user?.uid) {
            const userId = user.uid;
            const savedId = localStorage.getItem(`trackedVehicleId_${userId}`);
            if (savedId) {
                try { _setTrackedVehicleId(JSON.parse(savedId)); } catch { _setTrackedVehicleId(savedId); }
            }
            const savedLastId = localStorage.getItem(`lastTrackedVehicleId_${userId}`);
            if (savedLastId) setLastTrackedVehicleId(savedLastId);

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

    const syncMileageToDb = useCallback(async (vehicleId: string, deltaKm: number, deltaSeconds: number) => {
        if (!user || !firestore || (deltaKm <= 0 && deltaSeconds <= 0)) return;
        
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, vehicleId);
        const todayId = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const dailyStatRef = doc(firestore, `users/${user.uid}/vehicles/${vehicleId}/dailyStatistics`, todayId);

        const batch = writeBatch(firestore);
        
        if (deltaKm > 0) {
            batch.update(vehicleRef, { 
                currentMileage: increment(deltaKm),
                updatedAt: new Date().toISOString(),
                lastGpsIncrement: deltaKm 
            });
        }

        const deltaMin = deltaSeconds / 60;
        batch.set(dailyStatRef, {
            id: todayId,
            vehicleId: vehicleId,
            date: new Date().toISOString(),
            totalDistance: increment(deltaKm),
            totalTime: increment(deltaMin),
            dataoraelimina: null
        }, { merge: true });

        try {
            await batch.commit();
            syncedDistanceRef.current = distanceRef.current;
            syncedTimeSecondsRef.current = Math.floor((Date.now() - (startTimeRef.current?.getTime() || Date.now())) / 1000);
            
            setSyncedDistance(syncedDistanceRef.current);

            if (user?.uid) {
                localStorage.setItem(`syncedDistance_${user.uid}`, syncedDistanceRef.current.toString());
                localStorage.setItem(`syncedTimeSeconds_${user.uid}`, syncedTimeSecondsRef.current.toString());
            }
        } catch (err) {
            console.error("Errore sincronizzazione batch GPS:", err);
        }
    }, [user, firestore]);

    // BLUETOOTH AUTO-AUTOMATION LOGIC
    useEffect(() => {
        if (!vehicles || vehicles.length === 0 || isTracking) return;

        // In a real Capacitor app, we would use a Bluetooth LE plugin listener here.
        // For simulation and PWA, we can check for paired devices if available or use a mocked interval.
        const checkBluetoothDevices = () => {
            // Check each vehicle for auto-automation
            for (const v of vehicles) {
                if (v.autoTrackingEnabled && v.bluetoothMacAddress) {
                    // MOCK: In a real app, logic would be: if (connectedDevice.id === v.bluetoothMacAddress)
                    // We check if this device was "simulated" as connected in localStorage for demo
                    const isSimulatedConnected = localStorage.getItem(`simulated_bt_connected_${v.id}`) === 'true';
                    
                    if (isSimulatedConnected) {
                        toast({ 
                            title: 'Bluetooth Rilevato!', 
                            description: `Avvio automatico per ${v.name}. ${v.autoHotspotEnabled ? 'Hotspot attivato.' : ''}` 
                        });
                        startTracking(v.id);
                        break; 
                    }
                }
            }
        };

        const interval = setInterval(checkBluetoothDevices, 5000);
        return () => clearInterval(interval);
    }, [vehicles, isTracking, toast]);

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
                const currentDuration = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
                setSessionDuration(currentDuration);
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
                    const unsyncedSeconds = Math.floor((Date.now() - (startTimeRef.current?.getTime() || Date.now())) / 1000) - syncedTimeSecondsRef.current;

                    if (unsyncedDistance >= 0.1) {
                        syncMileageToDb(trackedVehicleId, unsyncedDistance, unsyncedSeconds);
                    }
                    lastPositionRef.current = position.coords;
                }
            },
            (error) => {
                if (error.code === 1) {
                    setPermissionStatus('denied');
                    setIsTracking(false);
                    toast({ variant: 'destructive', title: 'GPS Negato', description: 'Abilita la posizione per tracciare i km.' });
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
        if (id && user?.uid) {
            localStorage.setItem(`trackedVehicleId_${user.uid}`, JSON.stringify(id));
            localStorage.setItem(`lastTrackedVehicleId_${user.uid}`, id);
            setLastTrackedVehicleId(id);
        }
    }, [user?.uid]);

    const stopTracking = useCallback(async () => {
        setIsStopping(true);
        const trackedDistance = distanceRef.current;
        const finalUnsyncedDistance = trackedDistance - syncedDistanceRef.current;
        const currentTotalSeconds = Math.floor((Date.now() - (startTimeRef.current?.getTime() || Date.now())) / 1000);
        const finalUnsyncedSeconds = currentTotalSeconds - syncedTimeSecondsRef.current;

        if (!user || !firestore || !trackedVehicleId) {
            setIsTracking(false);
            setIsStopping(false);
            return;
        }

        try {
            if (finalUnsyncedDistance > 0 || finalUnsyncedSeconds > 0) {
                await syncMileageToDb(trackedVehicleId, Math.max(0, finalUnsyncedDistance), Math.max(0, finalUnsyncedSeconds));
            }

            const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, trackedVehicleId);
            await updateDoc(vehicleRef, { 
                trackingGPS: false,
                lastTrackedAt: new Date().toISOString()
            });

            toast({ title: 'Tracking Fermato', description: `Hai percorso ${trackedDistance.toFixed(2)} km in totale.` });
        } catch (e) { 
            console.error("Errore salvataggio sessione finale:", e); 
        } finally {
            setIsTracking(false);
            distanceRef.current = 0; syncedDistanceRef.current = 0; syncedTimeSecondsRef.current = 0; 
            lastPositionRef.current = null; startTimeRef.current = null;
            setSessionDistance(0); setSessionDuration(0); setSyncedDistance(0);
            if (user?.uid) {
                localStorage.removeItem(`isTracking_${user.uid}`);
                localStorage.removeItem(`sessionDistance_${user.uid}`);
                localStorage.removeItem(`syncedDistance_${user.uid}`);
                localStorage.removeItem(`syncedTimeSeconds_${user.uid}`);
                localStorage.removeItem(`startTime_${user.uid}`);
            }
            setIsStopping(false);
        }
    }, [user, firestore, trackedVehicleId, syncMileageToDb, toast]);

    const startTracking = useCallback((id?: string) => {
        const targetId = id || trackedVehicleId;
        if (!targetId || !user || !firestore) return;
        
        const vehicleRef = doc(firestore, `users/${user.uid}/vehicles`, targetId);
        updateDoc(vehicleRef, { trackingGPS: true });
        setTrackedVehicleId(targetId);
        setIsTracking(true);
    }, [trackedVehicleId, user, firestore, setTrackedVehicleId]);

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

    const dailyTotalDistance = todayDbStats.distance + (sessionDistance - syncedDistance);
    const dailyTotalTime = todayDbStats.time + ((sessionDuration - syncedTimeSecondsRef.current) / 60);

    const value = useMemo(() => ({
        permissionStatus, isTracking, isStopping, trackedVehicleId, lastTrackedVehicleId, setTrackedVehicleId, startTracking, stopTracking, switchTrackingTo,
        trackedVehicle: vehicles?.find(v => v.id === trackedVehicleId) || null,
        vehicles: vehicles || [],
        sessionDistance, sessionDuration, 
        liveSessionDistance: Math.max(0, sessionDistance - syncedDistance), 
        dailyTotalDistance, dailyTotalTime
    }), [permissionStatus, isTracking, isStopping, trackedVehicleId, lastTrackedVehicleId, setTrackedVehicleId, startTracking, stopTracking, switchTrackingTo, vehicles, sessionDistance, sessionDuration, syncedDistance, dailyTotalDistance, dailyTotalTime]);

    return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking() {
    const ctx = useContext(TrackingContext);
    if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
    return ctx;
}
