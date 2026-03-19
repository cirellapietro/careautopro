import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const gestisciConnessioneVeicolo = async (ownerUUID: string, vehicleUUID: string) => {
  const vehicleRef = doc(db, 'users', ownerUUID, 'vehicles', vehicleUUID);
  const snap = await getDoc(vehicleRef);
  if (snap.exists()) {
    const { autoHotspotEnabled, pairedBluetoothName } = snap.data();
    if (autoHotspotEnabled) {
      console.log("Rilevamento Bluetooth e attivazione Hotspot per: " + pairedBluetoothName);
      // Logica attivazione Wi-Fi qui
    }
  }
};
