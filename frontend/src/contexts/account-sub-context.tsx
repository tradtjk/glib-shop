"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { scrollAppToTopSoon } from "@/lib/scroll-to-top";

export type AccountSubId =
  | "hub"
  | "profile"
  | "orders"
  | "favorites"
  | "addresses"
  | "settings";

const SUBS: AccountSubId[] = [
  "hub",
  "profile",
  "orders",
  "favorites",
  "addresses",
  "settings",
];

export function pathnameToAccountSub(
  pathname: string,
  locale: string
): AccountSubId {
  const base = `/${locale}/account`;
  if (pathname === base || pathname === `${base}/`) return "hub";
  const seg = pathname.slice(`${base}/`.length).split("/")[0];
  if (SUBS.includes(seg as AccountSubId)) return seg as AccountSubId;
  return "hub";
}

export function accountSubPath(locale: string, sub: AccountSubId): string {
  const base = `/${locale}/account`;
  return sub === "hub" ? base : `${base}/${sub}`;
}

interface AccountSubContextValue {
  activeSub: AccountSubId;
  openSub: (sub: AccountSubId) => void;
}

const AccountSubContext = createContext<AccountSubContextValue | null>(null);

export function AccountSubProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const routeSub = pathnameToAccountSub(pathname, locale);
  const [activeSub, setActiveSub] = useState<AccountSubId>(routeSub);

  useEffect(() => {
    setActiveSub(pathnameToAccountSub(pathname, locale));
  }, [pathname, locale]);

  const openSub = useCallback(
    (sub: AccountSubId) => {
      setActiveSub(sub);
      const url = accountSubPath(locale, sub);
      window.history.pushState(null, "", url);
      scrollAppToTopSoon({ tab: "account" });
    },
    [locale]
  );

  const value = useMemo(
    () => ({ activeSub, openSub }),
    [activeSub, openSub]
  );

  return (
    <AccountSubContext.Provider value={value}>
      {children}
    </AccountSubContext.Provider>
  );
}

export function useAccountSub() {
  return useContext(AccountSubContext);
}
