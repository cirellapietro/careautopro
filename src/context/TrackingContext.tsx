"use client";
import React, { createContext, useContext, useState } from 'react';

const TrackingContext = createContext<any>(null);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [isTracking, setIsTracking] = useState(false);

  return (
    <TrackingContext.Provider value={{ isTracking, setIsTracking }}>
      {children}
    </TrackingContext.Provider>
  );
}

export const useTracking = () => useContext(TrackingContext);
