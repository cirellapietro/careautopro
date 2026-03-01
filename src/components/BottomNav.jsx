"use client";
import React, { useState, useEffect } from 'react';
// Import rimosso per migrazione Firebase
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BottomNav({ utenteId }) {
  const [hasUrgent, setHasUrgent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!utenteId) return;
    const checkUrgent = async () => {
      const { data } = await supabase.from('avviso_notifiche').select('stato').eq('utente_id', utenteId).eq('stato', 'URGENTE');
      setHasUrgent(data && data.length > 0);
    };
    checkUrgent();
  }, [utenteId]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around items-center z-50 shadow-lg">
      <button onClick={() => router.back()} className="flex flex-col items-center text-gray-500">
        <span className="text-xl">⬅️</span>
        <span className="text-[10px]">Indietro</span>
      </button>
      <Link href="/" className="flex flex-col items-center text-gray-400">
        <span className="text-xl">🏠</span>
        <span className="text-[10px]">Home</span>
      </Link>
      <Link href="/notifiche" className="relative flex flex-col items-center text-gray-400">
        <span className="text-xl">🔔</span>
        <span className="text-[10px]">Avvisi</span>
        {hasUrgent && <span className="absolute top-0 right-3 h-2 w-2 bg-red-600 rounded-full animate-ping"></span>}
      </Link>
      <button onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }} className="flex flex-col items-center text-red-500">
        <span className="text-xl">🚪</span>
        <span className="text-[10px]">Esci</span>
      </button>
    </nav>
  );
}
