"use client";

import { useLayoutEffect } from "react";
import { useAccountSub, type AccountSubId } from "@/contexts/account-sub-context";
import { scrollAppToTopSoon } from "@/lib/scroll-to-top";
import { cn } from "@/lib/utils";
import { AccountHub } from "./AccountHub";
import ProfilePage from "@/app/[locale]/account/profile/page";
import OrdersPage from "@/app/[locale]/account/orders/page";
import FavoritesPage from "@/app/[locale]/account/favorites/page";
import AddressesPage from "@/app/[locale]/account/addresses/page";
import SettingsPage from "@/app/[locale]/account/settings/page";

const PANELS: Record<AccountSubId, React.ReactNode> = {
  hub: <AccountHub />,
  profile: <ProfilePage />,
  orders: <OrdersPage />,
  favorites: <FavoritesPage />,
  addresses: <AddressesPage />,
  settings: <SettingsPage />,
};

const SUB_IDS: AccountSubId[] = [
  "hub",
  "profile",
  "orders",
  "favorites",
  "addresses",
  "settings",
];

export function AccountSubPanels() {
  const accountSub = useAccountSub();
  const activeSub = accountSub?.activeSub ?? "hub";

  useLayoutEffect(() => {
    scrollAppToTopSoon({ tab: "account" });
  }, [activeSub]);

  return (
    <div className="account-sub-shell flex flex-col min-h-0 flex-1">
      {SUB_IDS.map((id) => (
        <div
          key={id}
          className={cn(
            "account-sub-panel mobile-tab-panel flex flex-col min-h-0",
            activeSub !== id && "hidden"
          )}
          aria-hidden={activeSub !== id}
        >
          {PANELS[id]}
        </div>
      ))}
    </div>
  );
}
