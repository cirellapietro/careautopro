import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const salvaPreferenzeAuto = async (userId: string, vehicleId: string, bluetoothName: string, enableHotspot: boolean) => {
  const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
  await updateDoc(vehicleRef, {
    pairedBluetoothName: bluetoothName,
    autoHotspot: enableHotspot
  });
};

export const aggiungiDriver = async (ownerId: string, vehicleId: string, driverId: string) => {
  const vehicleRef = doc(db, 'users', ownerId, 'vehicles', vehicleId);
  await updateDoc(vehicleRef, { allowedDrivers: arrayUnion(driverId) });
};
