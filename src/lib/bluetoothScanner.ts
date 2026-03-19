import { BleClient } from '@capacitor-community/bluetooth-le';

/**
 * Scansiona e abilita l'hotspot solo se l'utente lo ha previsto per quel veicolo
 */
export const scanAndConnectVehicle = async (targetBtName: string, shouldEnableHotspot: boolean) => {
  try {
    await BleClient.initialize();
    
    // Avvia scansione per 5 secondi
    await BleClient.requestLEScan({}, (result) => {
      if (result.localName === targetBtName) {
        console.log(`Veicolo trovato: ${targetBtName}`);
        
        // IL CHECK CHE HAI RICHIESTO:
        if (shouldEnableHotspot) {
          attivaHotspotNativo();
        }
      }
    });

    setTimeout(async () => {
      await BleClient.stopLEScan();
    }, 5000);
    
  } catch (error) {
    console.error("Errore Bluetooth:", error);
  }
};

const attivaHotspotNativo = () => {
  // Qui chiamiamo il plugin @capacitor-community/http o un bridge personalizzato
  console.log("Comando inviato: Abilitazione Hotspot Smartphone in corso...");
  // In produzione: HotspotPlugin.enable();
};
