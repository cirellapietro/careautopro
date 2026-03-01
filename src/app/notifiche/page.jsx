"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import BottomNav from '../../components/BottomNav';

export default function NotifichePage() {
  const [avvisi, setAvvisi] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const notificationsRef = ref(db, 'avviso_notifiche');
        const q = query(notificationsRef, orderByChild('utente_id'), equalTo(currentUser.uid));
        const unsubscribeData = onValue(q, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const list = Object.values(data).sort((a, b) => new Date(b.data_ora) - new Date(a.data_ora));
            setAvvisi(list);
          } else { setAvvisi([]); }
        });
        return () => unsubscribeData();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-4">
      <h1 className="text-2xl font-black mb-6">Centro Notifiche</h1>
      <div className="space-y-4">
        {avvisi.length === 0 ? (
          <p className="text-slate-500 text-center py-10">Nessuna notifica presente.</p>
        ) : (
          avvisi.map((a, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white shadow-sm border-l-4 border-blue-500">
              <p className="text-sm font-bold text-blue-600">{a.stato}</p>
              <p className="text-slate-800">{a.descrizione}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav utenteId={user?.uid} />
    </div>
  );
}
