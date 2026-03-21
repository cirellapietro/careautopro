'use client';

import React from "react";
import { AdsBanner } from "@/components/AdsBanner";
import { TrackingProvider } from "@/contexts/tracking-context";
import { Header } from "@/components/layout/header";
import { TrackingBanner } from "@/components/dashboard/tracking-banner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrackingProvider>
      <div className="flex min-h-screen flex-col bg-muted/20">
        <Header />
        <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 max-w-7xl mx-auto w-full">
          <TrackingBanner />
          {children}
          <AdsBanner />
        </main>
        <footer className="py-6 border-t bg-background">
          <div className="container px-4 text-center text-xs text-muted-foreground">
            CareAutoPro v1.0 - Il tuo assistente intelligente per la manutenzione.
          </div>
        </footer>
      </div>
    </TrackingProvider>
  );
}