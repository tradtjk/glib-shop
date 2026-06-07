"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { scrollAppToTopSoon } from "@/lib/scroll-to-top";

interface InstantNavContextValue {
  displayPath: string;
  navigate: (path: string) => void;
  prefetch: (path: string) => void;
}

const InstantNavContext = createContext<InstantNavContextValue | null>(null);

export function InstantNavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayPath, setDisplayPath] = useState(pathname);

  useEffect(() => {
    setDisplayPath(pathname);
    scrollAppToTopSoon();
  }, [pathname]);

  const navigate = useCallback(
    (path: string) => {
      setDisplayPath(path);
      window.history.pushState(null, "", path);
      router.push(path, { scroll: false });
      scrollAppToTopSoon();
    },
    [router]
  );

  const prefetch = useCallback(
    (path: string) => {
      router.prefetch(path);
    },
    [router]
  );

  const value = useMemo(
    () => ({ displayPath, navigate, prefetch }),
    [displayPath, navigate, prefetch]
  );

  return (
    <InstantNavContext.Provider value={value}>
      {children}
    </InstantNavContext.Provider>
  );
}

export function useInstantNav() {
  return useContext(InstantNavContext);
}
