import { db } from './firebaseConfig';
import { collectionGroup, getDocs, updateDoc, doc } from 'firebase/firestore';

export const ricalcoloGiornalieroInterventi = async () => {
  const veicoliSnapshot = await getDocs(collectionGroup(db, 'vehicles'));

  for (const veicoloDoc of veicoliSnapshot.docs) {
    const vData = veicoloDoc.data();
    const vehicleUUID = veicoloDoc.id;
    const ownerUUID = veicoloDoc.ref.parent.parent?.id;
    if (!ownerUUID) continue;

    // Calcolo KM stimati (percorrenza "fantasma" dall'ultimo update)
    const kmAnnui = vData.kmAnnuiPrevisti || 12000;
    const kmGiornalieriMedi = kmAnnui / 365;
    const oggi = new Date();
    const ultimoUpdate = vData.updatedAt?.toDate() || oggi;
    const giorniDallUltimoUpdate = Math.max(0, Math.floor((oggi.getTime() - ultimoUpdate.getTime()) / (1000 * 3600 * 24)));
    const kmStimatiAttuali = vData.currentMileage + (kmGiornalieriMedi * giorniDallUltimoUpdate);

    const interventiRef = collection(db, 'users', ownerUUID, 'vehicles', vehicleUUID, 'interventi');
    const interventiSnap = await getDocs(interventiRef);

    interventiSnap.forEach(async (intDoc) => {
      const iData = intDoc.data();
      let alertNecessario = false;
      let motivo = "";

      // 1. CONTROLLO TEMPORALE (Bollo, Assicurazione, Scadenze a mesi)
      if (iData.prossimaScadenzaData) {
        const dataScadenza = new Date(iData.prossimaScadenzaData);
        const giorniMancanti = Math.ceil((dataScadenza.getTime() - oggi.getTime()) / (1000 * 3600 * 24));
        
        if (giorniMancanti <= (iData.sogliaPreavvisoGiorni || 15)) {
          alertNecessario = true;
          motivo = `Scadenza temporale tra ${giorniMancanti} giorni`;
        }
      }

      // 2. CONTROLLO CHILOMETRICO (Olio, Filtri, Freni)
      if (!alertNecessario && iData.prossimaScadenzaKm) {
        const kmAlLimite = iData.prossimaScadenzaKm - kmStimatiAttuali;
        if (kmAlLimite <= (iData.sogliaPreavvisoKm || 1000)) {
          alertNecessario = true;
          motivo = `Scadenza chilometrica tra circa ${Math.round(kmAlLimite)} km`;
        }
      }

      if (alertNecessario) {
        await updateDoc(intDoc.ref, { 
          status: 'in_scadenza', 
          alertMotivo: motivo,
          ultimaVerifica: oggi.toISOString() 
        });
      }
    });
  }
};
