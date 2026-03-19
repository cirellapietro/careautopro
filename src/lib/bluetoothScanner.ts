import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Controlla se l'utente ha dato il permesso di attivare l'hotspot 
 * per questo specifico UUID veicolo.
 */
export const gestisciConnessioneVeicolo = async (ownerUUID: string, vehicleUUID: string) => {
  const vehicleRef = doc(db, 'users', ownerUUID, 'vehicles', vehicleUUID);
  const snap = await getDoc(vehicleRef);

  if (snap.exists()) {
    const { autoHotspotEnabled, pairedBluetoothName } = snap.data();

    // Procedi solo se l'utente ha attivato il check nel setup
    if (autoHotspotEnabled) {
      console.log(`Verifica Bluetooth per: ${pairedBluetoothName}`);
      // Qui parte la scansione BLE...
      // Se trovato -> Attiva Hotspot tramite bridge nativo
    } else {
      console.log("Hotspot disabilitato dalle impostazioni utente per questo veicolo.");
    }
  }
};
