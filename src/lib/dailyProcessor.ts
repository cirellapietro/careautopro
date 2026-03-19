import { db } from './firebaseConfig';
import { collectionGroup, getDocs, updateDoc, doc, collection } from 'firebase/firestore';

export const ricalcoloGiornalieroInterventi = async () => {
  const veicoliSnapshot = await getDocs(collectionGroup(db, 'vehicles'));

  for (const veicoloDoc of veicoliSnapshot.docs) {
    const vData = veicoloDoc.data();
    const vehicleUUID = veicoloDoc.id;
    const ownerUUID = veicoloDoc.ref.parent.parent?.id;
    if (!ownerUUID) continue;

    // Calcolo KM stimati (percorrenza "fantasma" basata su media annua)
    const kmAnnui = vData.kmAnnuiPrevisti || 15000;
    const kmGiornalieriMedi = kmAnnui / 365;
    const oggi = new Date();
    const ultimoUpdate = vData.updatedAt?.toDate() || oggi;
    const giorniPassati = Math.max(1, Math.floor((oggi.getTime() - ultimoUpdate.getTime()) / (1000 * 3600 * 24)));
    const kmStimatiAttuali = vData.currentMileage + (kmGiornalieriMedi * giorniPassati);

    const interventiRef = collection(db, 'users', ownerUUID, 'vehicles', vehicleUUID, 'interventi');
    const interventiSnap = await getDocs(interventiRef);

    interventiSnap.forEach(async (intDoc) => {
      const iData = intDoc.data();
      let alertNecessario = false;
      let motivo = "";

      // 1. Controllo TEMPORALE (Bollo, Assicurazione, Revisione)
      if (iData.prossimaScadenzaData) {
        const dataScadenza = new Date(iData.prossimaScadenzaData);
        const giorniAlLimite = Math.ceil((dataScadenza.getTime() - oggi.getTime()) / (1000 * 3600 * 24));
        if (giorniAlLimite <= (iData.sogliaPreavvisoGiorni || 15)) {
          alertNecessario = true;
          motivo = `Scadenza tra ${giorniAlLimite} giorni`;
        }
      }

      // 2. Controllo CHILOMETRICO (Olio, Filtri, Freni)
      if (!alertNecessario && iData.prossimaScadenzaKm) {
        const kmMancanti = iData.prossimaScadenzaKm - kmStimatiAttuali;
        if (kmMancanti <= (iData.sogliaPreavvisoKm || 1000)) {
          alertNecessario = true;
          motivo = `Manutenzione tra circa ${Math.round(kmMancanti)} km`;
        }
      }

      if (alertNecessario) {
        await updateDoc(intDoc.ref, { 
          status: 'in_scadenza', 
          alertMotivo: motivo,
          ultimaVerificaBatch: oggi.toISOString() 
        });
      }
    });
  }
};
