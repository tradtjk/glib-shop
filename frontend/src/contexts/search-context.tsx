"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  return (
    <SearchContext.Provider value={{ open, openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchOverlay() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchOverlay requires SearchProvider");
  return ctx;
}
