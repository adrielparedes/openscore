"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ViewMode = "condensed" | "normal";

interface BracketContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  zoom: number;
  setZoom: (z: number) => void;
  mounted: boolean;
}

const BracketContext = createContext<BracketContextValue | null>(null);

const STORAGE_KEY = "bracket-view-mode";

export function BracketProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("normal");
  const [zoom, setZoom] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "condensed" || saved === "normal") setMode(saved);
    setMounted(true);
  }, []);

  function handleSetMode(m: ViewMode) {
    setMode(m);
    localStorage.setItem(STORAGE_KEY, m);
  }

  return (
    <BracketContext.Provider value={{ mode, setMode: handleSetMode, zoom, setZoom, mounted }}>
      {children}
    </BracketContext.Provider>
  );
}

export function useBracket() {
  const ctx = useContext(BracketContext);
  if (!ctx) throw new Error("useBracket must be used inside BracketProvider");
  return ctx;
}
