'use client';
import { useState, useEffect } from 'react';
import { db } from '@/firebase/auth/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function DebugPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const checkDB = async () => {
      const querySnapshot = await getDocs(collection(db, 'config_controlli_periodici'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(data);
    };
    checkDB();
  }, []);

  return (
    <div className="p-6 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4">LOG DATI TECNICI (MARCA-MODELLO)</h1>
      {logs.length === 0 ? <p>Nessun dato trovato. Il batch ha girato?</p> : 
        logs.map(log => (
          <pre key={log.id} className="bg-slate-100 p-2 mb-2 border rounded">
            {JSON.stringify(log, null, 2)}
          </pre>
        ))
      }
    </div>
  );
}
