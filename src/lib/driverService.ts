import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

/**
 * Aggiunge un driver autorizzato a un veicolo specifico.
 * @param ownerId UID del proprietario del veicolo
 * @param vehicleId Targa o ID del veicolo
 * @param driverId UID del nuovo driver da aggiungere
 */
export const aggiungiDriver = async (ownerId: string, vehicleId: string, driverId: string) => {
  const vehicleRef = doc(db, 'users', ownerId, 'vehicles', vehicleId);
  await updateDoc(vehicleRef, {
    allowedDrivers: arrayUnion(driverId)
  });
};

/**
 * Rimuove un driver autorizzato.
 */
export const rimuoviDriver = async (ownerId: string, vehicleId: string, driverId: string) => {
  const vehicleRef = doc(db, 'users', ownerId, 'vehicles', vehicleId);
  await updateDoc(vehicleRef, {
    allowedDrivers: arrayRemove(driverId)
  });
};
