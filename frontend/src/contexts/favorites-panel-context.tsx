"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface FavoritesPanelContextValue {
  open: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  toggleFavorites: () => void;
}

const FavoritesPanelContext = createContext<FavoritesPanelContextValue | null>(null);

export function FavoritesPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openFavorites = useCallback(() => setOpen(true), []);
  const closeFavorites = useCallback(() => setOpen(false), []);
  const toggleFavorites = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <FavoritesPanelContext.Provider
      value={{ open, openFavorites, closeFavorites, toggleFavorites }}
    >
      {children}
    </FavoritesPanelContext.Provider>
  );
}

export function useFavoritesPanel() {
  const ctx = useContext(FavoritesPanelContext);
  if (!ctx) {
    throw new Error("useFavoritesPanel requires FavoritesPanelProvider");
  }
  return ctx;
}
