import { db, auth } from './firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const salvaInterventoRapido = async (targa, kmAttuali, tipoIntervento) => {
  const user = auth.currentUser;
  if (!user) return;
  const veicoloRef = doc(db, "veicoli", targa);
  const scadenze = { 
    olio: parseInt(kmAttuali) + 15000, 
    freni: parseInt(kmAttuali) + 30000, 
    revisione: parseInt(kmAttuali) + 20000 
  };
  await setDoc(veicoloRef, { 
    ultimoUpdate: kmAttuali, 
    [`prossimo_${tipoIntervento}`]: scadenze[tipoIntervento], 
    aggiornatoIl: serverTimestamp(), 
    userId: user.uid 
  }, { merge: true });
};


