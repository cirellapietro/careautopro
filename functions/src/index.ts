import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * CRON-TAB: Gira ogni notte alle 03:00 AM
 * Ricalcola KM stimati e scadenze per tutti i veicoli
 */
export const dailyVehicleSync = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('Europe/Rome')
  .onRun(async (context) => {
    const veicoliSnapshot = await db.collectionGroup('vehicles').get();
    const oggi = new Date();

    for (const veicoloDoc of veicoliSnapshot.docs) {
      const vData = veicoloDoc.data();
      const kmAnnui = vData.kmAnnuiPrevisti || 15000;
      const kmGiornalieriMedi = kmAnnui / 365;
      
      // Calcolo giorni dall'ultimo update reale
      const ultimoUpdate = vData.updatedAt?.toDate() || oggi;
      const giorniPassati = Math.max(1, Math.floor((oggi.getTime() - ultimoUpdate.getTime()) / (1000 * 3600 * 24)));
      const kmStimati = vData.currentMileage + (kmGiornalieriMedi * giorniPassati);

      // Aggiorna lo stato degli interventi per questo veicolo
      const interventiRef = veicoloDoc.ref.collection('interventi');
      const interventiSnap = await interventiRef.get();

      for (const intDoc of interventiSnap.docs) {
        const iData = intDoc.data();
        let status = 'regolare';
        
        // Check temporale
        if (iData.prossimaScadenzaData) {
          const scadenza = iData.prossimaScadenzaData.toDate();
          const giorniMancanti = Math.ceil((scadenza.getTime() - oggi.getTime()) / (1000 * 3600 * 24));
          if (giorniMancanti <= (iData.sogliaPreavvisoGiorni || 15)) status = 'in_scadenza';
        }

        // Check chilometrico
        if (iData.prossimaScadenzaKm && status === 'regolare') {
          if (iData.prossimaScadenzaKm - kmStimati <= (iData.sogliaPreavvisoKm || 1000)) {
            status = 'in_scadenza';
          }
        }

        if (status === 'in_scadenza') {
          await intDoc.ref.update({ status: 'in_scadenza', ultimaVerificaBatch: admin.firestore.FieldValue.serverTimestamp() });
        }
      }
    }
    console.log('Ricalcolo notturno completato con successo');
    return null;
  });
