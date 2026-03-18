'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { useUser } from '@/firebase/auth/use-user';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrackingProvider } from '@/contexts/tracking-context';
import { TrackingBanner } from '@/components/dashboard/tracking-banner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Caricamento...</p>
      </div>
    );
  }

  const navItems = [
    { href: "/dashboard/statistics", label: "Statistiche" },
    { href: "/dashboard/vehicles", label: "Veicoli" },
    { href: "/dashboard/interventions", label: "Interventi" },
    { href: "/dashboard/ai-assistant", label: "Assistente AI" },
    { href: "/dashboard/notifications", label: "Notifiche" },
  ];

  return (
    <TrackingProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="border-b">
          <div className="container flex-1 items-start md:grid md:gap-6 lg:gap-10">
            <nav className="flex gap-4 overflow-x-auto py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {user.role === 'Amministratore' && (
                  <Link
                      href="/dashboard/admin"
                      className={cn(
                          "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          pathname.startsWith('/dashboard/admin')
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted"
                      )}
                  >
                      Amministrazione
                  </Link>
              )}
            </nav>
          </div>
        </div>
        <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <TrackingBanner />
      <AdsBanner />
          {children}
        </main>
        <footer className="mt-auto border-t bg-secondary py-4">
          <div className="container flex items-center justify-end">
            <p className="text-xs text-muted-foreground">Versione: 1.0.0</p>
          </div>
        </footer>
      </div>
    </TrackingProvider>
  );
}
