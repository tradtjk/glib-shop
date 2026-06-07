"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useSearchOverlay } from "@/contexts/search-context";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { type MobileTabId } from "@/lib/mobile-tabs";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { openSearch } = useSearchOverlay();
  const mobileTabs = useMobileTabs();
  const cartCount = useCartStore((s) => s.count());
  const hydrated = useHydrated();
  const inShell = mobileTabs?.isShellActive ?? false;

  const isActive = (tab: MobileTabId, href: string) => {
    if (inShell && mobileTabs) return mobileTabs.activeTab === tab;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const items = [
    { tab: "home" as const, href: `/${locale}`, icon: Home, label: t("home") },
    { tab: "catalog" as const, href: `/${locale}/catalog`, icon: LayoutGrid, label: t("catalog") },
    { tab: null, icon: Search, label: t("search"), onClick: openSearch },
    { tab: "cart" as const, href: `/${locale}/cart`, icon: ShoppingBag, label: t("cart"), badge: cartCount },
    { tab: "account" as const, href: `/${locale}/account`, icon: User, label: t("profile") },
  ];

  const handleTab = (tab: MobileTabId) => {
    mobileTabs?.switchTab(tab);
  };

  const renderItem = (
    active: boolean,
    Icon: typeof Home,
    label: string,
    badge: number | undefined,
    onClick?: () => void,
    key?: string,
    href?: string,
    tab?: MobileTabId | null
  ) => {
    const content = (
      <span className={cn("tabbar-item", active && "tabbar-item--active")}>
        <span className="relative flex items-center justify-center">
          <Icon
            size={21}
            strokeWidth={active ? 2.35 : 1.85}
            className={active ? "text-[var(--color-brand)]" : "text-[var(--color-muted)]"}
          />
          {hydrated && badge != null && badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--color-sale)] text-[9px] font-bold text-white px-0.5 ring-2 ring-[var(--color-surface)]">
              {badge > 9 ? "9+" : badge}
            </span>
          )}
        </span>
        <span
          className={cn(
            "text-[10px] leading-none font-medium",
            active ? "text-[var(--color-brand)]" : "text-[var(--color-muted)]"
          )}
        >
          {label}
        </span>
      </span>
    );

    if (onClick) {
      return (
        <button
          key={key ?? label}
          type="button"
          onClick={onClick}
          className="tap-card flex items-center justify-center"
        >
          {content}
        </button>
      );
    }

    if (inShell && tab) {
      return (
        <button
          key={key ?? href}
          type="button"
          onClick={() => handleTab(tab)}
          className="tap-card flex items-center justify-center"
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={key ?? href}
        href={href!}
        prefetch
        className="tap-card flex items-center justify-center"
      >
        {content}
      </Link>
    );
  };

  return (
    <nav
      className="mobile-tabbar md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        height: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-5 items-center px-1" style={{ height: "var(--tabbar-h)" }}>
        {items.map(({ tab, href, icon: Icon, label, badge, onClick }) =>
          renderItem(
            tab ? isActive(tab, href!) : false,
            Icon,
            label,
            badge,
            onClick,
            label,
            href,
            tab
          )
        )}
      </div>
    </nav>
  );
}
