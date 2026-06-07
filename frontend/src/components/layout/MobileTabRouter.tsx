"use client";

import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MobileTabShell } from "./MobileTabShell";
import { RouteKeepAlive } from "./RouteKeepAlive";

export function MobileTabRouter({ children }: { children: React.ReactNode }) {
  const mobileTabs = useMobileTabs();
  const hydrated = useHydrated();
  const isMobile = useIsMobile();
  const showShell = mobileTabs?.isShellActive ?? false;

  if (!hydrated) {
    if (showShell) {
      return (
        <>
          <MobileTabShell />
          <div className="hidden md:block">{children}</div>
        </>
      );
    }
    return (
      <>
        <div className="hidden md:block">{children}</div>
        <div className="flex flex-1 flex-col min-h-0 md:hidden">{children}</div>
      </>
    );
  }

  if (!isMobile) {
    return <>{children}</>;
  }

  if (showShell) {
    return <MobileTabShell />;
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <RouteKeepAlive>{children}</RouteKeepAlive>
    </div>
  );
}
