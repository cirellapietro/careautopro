'use client';

import { useEffect } from 'react';

export function AdsBanner() {
  useEffect(() => {
    try {
      // Inizializzazione per AdSense (Web/PWA)
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Errore AdMob:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-muted/30 my-4 border-y overflow-hidden">
      {/* Placeholder per AdMob/AdSense */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
           data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest absolute">Sponsor</p>
    </div>
  );
}
