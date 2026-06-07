"use client";

import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIsMobile } from "@/hooks/use-is-mobile";

/** Route page body for main tabs — hidden on mobile when the tab shell is active. */
export function MainTabPageContent({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const isMobile = useIsMobile();
  const showShell = useMobileTabs()?.isShellActive ?? false;

  if (!hydrated) {
    return <div className="hidden md:block">{children}</div>;
  }

  if (isMobile && showShell) {
    return null;
  }

  return <>{children}</>;
}
