"use client";

import { createContext, useContext, useEffect, useState } from "react";

const NowContext = createContext<number>(0);

/**
 * Runs a single 1-second setInterval for the entire subtree.
 * MatchCards read `useNow()` and compute their own remaining time,
 * replacing per-card intervals (N intervals → 1).
 */
export function CountdownProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<number>(0);

  // Initialise on the client to avoid SSR hydration mismatches.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}

export function useNow(): number {
  return useContext(NowContext);
}
