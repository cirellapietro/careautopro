import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

/**
 * Salva preferenze usando UUID immutabile.
 */
export const salvaPreferenzeAuto = async (ownerUUID: string, vehicleUUID: string, bluetoothName: string, enableHotspot: boolean) => {
  const vehicleRef = doc(db, 'users', ownerUUID, 'vehicles', vehicleUUID);
  await updateDoc(vehicleRef, {
    pairedBluetoothName: bluetoothName,
    autoHotspot: enableHotspot,
    updatedAt: new Date().toISOString()
  });
};

/**
 * Gestisce scadenze periodiche (Bollo, Assicurazione, Revisione)
 * @param tipo 'bollo' | 'assicurazione' | 'revisione'
 */
export const salvaScadenzaPeriodica = async (ownerUUID: string, vehicleUUID: string, tipo: string, dataScadenza: string) => {
  const scadenzaRef = doc(db, 'users', ownerUUID, 'vehicles', vehicleUUID, 'scadenze', tipo);
  await setDoc(scadenzaRef, {
    tipo,
    dataScadenza,
    ultimoControllo: new Date().toISOString(),
    status: 'attivo'
  }, { merge: true });
};

export const aggiungiDriver = async (ownerUUID: string, vehicleUUID: string, driverUUID: string) => {
  const vehicleRef = doc(db, 'users', ownerUUID, 'vehicles', vehicleUUID);
  await updateDoc(vehicleRef, { 
    allowedDrivers: arrayUnion(driverUUID) 
  });
};
