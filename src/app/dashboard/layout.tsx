"use client";
import React from "react";
import { AdsBanner } from "@/components/AdsBanner";
import { TrackingProvider } from "@/context/TrackingContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <TrackingProvider>
      <div className="min-h-screen bg-gray-50 pb-24">
        {children}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <AdsBanner />
        </div>
      </div>
    </TrackingProvider>
  );
}
