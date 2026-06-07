"use client";

import { useEffect, useRef, useState } from "react";
import type { MobileTabId } from "@/lib/mobile-tabs";
import {
  TabAccountSkeleton,
  TabCartSkeleton,
  TabCatalogSkeleton,
  TabHomeSkeleton,
} from "@/components/skeletons/PageSkeletons";

const TAB_SKELETONS: Record<MobileTabId, React.ReactNode> = {
  home: <TabHomeSkeleton />,
  catalog: <TabCatalogSkeleton />,
  cart: <TabCartSkeleton />,
  account: <TabAccountSkeleton />,
};

export function CachedTabPanel({
  tab,
  active,
  children,
}: {
  tab: MobileTabId;
  active: boolean;
  children: React.ReactNode;
}) {
  const readyRef = useRef<Set<MobileTabId>>(new Set());
  const [ready, setReady] = useState(() => readyRef.current.has(tab));

  useEffect(() => {
    if (!active || readyRef.current.has(tab)) return;

    const mark = () => {
      readyRef.current.add(tab);
      setReady(true);
    };

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(mark, { timeout: 350 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(mark, 100);
    return () => window.clearTimeout(t);
  }, [active, tab]);

  const showSkeleton = active && !ready;

  if (showSkeleton) {
    return (
      <div className="overflow-y-auto flex-1 min-h-0 bg-[var(--color-bg)]">
        {TAB_SKELETONS[tab]}
      </div>
    );
  }

  return <>{children}</>;
}
