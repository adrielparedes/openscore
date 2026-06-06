"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type LayoutMode = "sidebar" | "navbar";

const STORAGE_KEY = "openscore-layout";
const COLLAPSED_KEY = "openscore-sidebar-collapsed";
const DEFAULT_MODE: LayoutMode = "sidebar";

interface LayoutContextValue {
  mode: LayoutMode;
  collapsed: boolean;
  toggle: () => void;
  toggleCollapsed: () => void;
}

const LayoutContext = createContext<LayoutContextValue>({
  mode: DEFAULT_MODE,
  collapsed: false,
  toggle: () => {},
  toggleCollapsed: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LayoutMode>(DEFAULT_MODE);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "navbar" || stored === "sidebar") {
      setMode(stored);
    }
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "true");
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "sidebar" ? "navbar" : "sidebar";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  if (!mounted) return null;

  return (
    <LayoutContext.Provider value={{ mode, collapsed, toggle, toggleCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout(): LayoutContextValue {
  return useContext(LayoutContext);
}
