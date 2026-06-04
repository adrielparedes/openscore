"use client";

import { createContext, useContext, useState } from "react";

type ViewMode = "condensed" | "normal";

interface BracketContextValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  zoom: number;
  setZoom: (z: number) => void;
}

const BracketContext = createContext<BracketContextValue | null>(null);

export function BracketProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("normal");
  const [zoom, setZoom] = useState(1);
  return (
    <BracketContext.Provider value={{ mode, setMode, zoom, setZoom }}>
      {children}
    </BracketContext.Provider>
  );
}

export function useBracket() {
  const ctx = useContext(BracketContext);
  if (!ctx) throw new Error("useBracket must be used inside BracketProvider");
  return ctx;
}
