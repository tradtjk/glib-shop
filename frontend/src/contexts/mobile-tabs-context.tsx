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
import { useLocale } from "next-intl";
import {
  type MobileTabId,
  isMainTabPath,
  pathnameToTab,
  tabPath,
} from "@/lib/mobile-tabs";
import { pathnameToAccountSub } from "@/contexts/account-sub-context";
interface MobileTabsContextValue {
  activeTab: MobileTabId;
  switchTab: (tab: MobileTabId) => void;
  isShellActive: boolean;
  isTabMounted: (tab: MobileTabId) => boolean;
}

const MobileTabsContext = createContext<MobileTabsContextValue | null>(null);

export function MobileTabsProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const routeTab = pathnameToTab(pathname, locale) ?? "home";
  const onMainRoute = isMainTabPath(pathname, locale);

  const [activeTab, setActiveTab] = useState<MobileTabId>(routeTab);
  const [shellActive, setShellActive] = useState(onMainRoute);
  const [mountedTabs, setMountedTabs] = useState<MobileTabId[]>(() =>
    routeTab ? [routeTab] : ["home"]
  );

  const ensureTabMounted = useCallback((tab: MobileTabId) => {
    setMountedTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]));
  }, []);

  useEffect(() => {
    const tab = pathnameToTab(pathname, locale);
    if (tab) {
      setActiveTab(tab);
      ensureTabMounted(tab);
      setShellActive(true);
    } else {
      setShellActive(false);
    }
  }, [pathname, locale, ensureTabMounted]);

  const switchTab = useCallback(
    (tab: MobileTabId) => {
      ensureTabMounted(tab);
      setActiveTab(tab);
      setShellActive(true);
      let url = tabPath(locale, tab);
      if (tab === "account") {
        const sub = pathnameToAccountSub(pathname, locale);
        if (sub !== "hub") url = `/${locale}/account/${sub}`;
      }

      if (isMainTabPath(pathname, locale) || shellActive) {
        window.history.replaceState(null, "", url);
        return;
      }

      router.push(url, { scroll: false });
    },
    [locale, pathname, router, shellActive, ensureTabMounted]
  );

  const isTabMounted = useCallback(
    (tab: MobileTabId) => mountedTabs.includes(tab),
    [mountedTabs]
  );

  const value = useMemo(
    () => ({
      activeTab,
      switchTab,
      isShellActive: shellActive,
      isTabMounted,
    }),
    [activeTab, switchTab, shellActive, isTabMounted]
  );

  return (
    <MobileTabsContext.Provider value={value}>
      {children}
    </MobileTabsContext.Provider>
  );
}

export function useMobileTabs() {
  return useContext(MobileTabsContext);
}
