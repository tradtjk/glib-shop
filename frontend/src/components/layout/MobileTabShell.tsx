"use client";

import { useLayoutEffect } from "react";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { scrollAppToTopSoon } from "@/lib/scroll-to-top";
import { MOBILE_TABS, type MobileTabId } from "@/lib/mobile-tabs";
import { cn } from "@/lib/utils";
import { CachedTabPanel } from "./CachedTabPanel";
import { HomeTabContent } from "@/components/tabs/HomeTabContent";
import { CatalogTabContent } from "@/components/tabs/CatalogTabContent";
import { CartTabContent } from "@/components/tabs/CartTabContent";
import { AccountTabContent } from "@/components/tabs/AccountTabContent";

const TAB_CONTENT: Record<MobileTabId, React.ReactNode> = {
  home: <HomeTabContent />,
  catalog: <CatalogTabContent />,
  cart: <CartTabContent />,
  account: <AccountTabContent />,
};

export function MobileTabShell() {
  const tabs = useMobileTabs();
  const isShellActive = tabs?.isShellActive ?? false;
  const activeTab = tabs?.activeTab ?? "home";

  useLayoutEffect(() => {
    if (!isShellActive) return;
    scrollAppToTopSoon({ tab: activeTab });
    const t = window.setTimeout(() => scrollAppToTopSoon({ tab: activeTab }), 100);
    return () => window.clearTimeout(t);
  }, [activeTab, isShellActive]);

  if (!isShellActive || !tabs) return null;

  const { isTabMounted } = tabs;

  return (
    <div className="mobile-tab-shell hidden max-md:flex flex-1 flex-col min-h-0">
      {MOBILE_TABS.map((tab) => (
        <div
          key={tab}
          id={`mobile-tab-${tab}`}
          className={cn(
            "mobile-tab-panel min-h-0",
            activeTab !== tab && "hidden"
          )}
          aria-hidden={activeTab !== tab}
        >
          <CachedTabPanel tab={tab} active={activeTab === tab}>
            {isTabMounted(tab) ? TAB_CONTENT[tab] : null}
          </CachedTabPanel>
        </div>
      ))}
    </div>
  );
}
