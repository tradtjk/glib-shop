"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useOrdersStore } from "@/stores/orders-store";
import { useHydrated } from "@/hooks/use-hydrated";

const DEFAULT_INTERVAL_MS = 20_000;

export function useOrdersSync(enabled = true, intervalMs = DEFAULT_INTERVAL_MS) {
  const hydrated = useHydrated();
  const token = useAuthStore((s) => s.token);
  const syncFromApi = useOrdersStore((s) => s.syncFromApi);

  useEffect(() => {
    if (!enabled || !hydrated || !token) return;

    syncFromApi(token);

    const timer = window.setInterval(() => {
      syncFromApi(token);
    }, intervalMs);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        syncFromApi(token);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, hydrated, token, syncFromApi, intervalMs]);
}
