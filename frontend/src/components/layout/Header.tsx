"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Store } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { HeaderSearchTrigger } from "./HeaderSearchTrigger";
import { useFavoritesPanel } from "@/contexts/favorites-panel-context";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { cn } from "@/lib/utils";

function BrandMark({ onClick }: { onClick?: () => void }) {
  const inner = (
    <>
      <span className="brand-mark flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--color-brand)] transition-colors">
        <Store size={20} strokeWidth={2.25} />
      </span>
      <span className="text-[1.125rem] md:text-[1.3rem] font-semibold tracking-tight whitespace-nowrap leading-none text-[var(--color-text)]">
        Golib Shop
      </span>
    </>
  );

  const cls = "flex items-center gap-2.5 shrink-0 tap-card text-[var(--color-text)] min-w-0";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "text-left")}>
        {inner}
      </button>
    );
  }

  return <span className={cls}>{inner}</span>;
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { toggleFavorites, closeFavorites } = useFavoritesPanel();
  const favCount = useFavoritesStore((s) => s.productIds.length);
  const hydrated = useHydrated();
  const mobileTabs = useMobileTabs();
  const inShell = mobileTabs?.isShellActive ?? false;

  useEffect(() => {
    closeFavorites();
  }, [pathname, closeFavorites]);

  return (
    <header
      className="app-header z-50 transition-all duration-300 max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0 md:sticky md:top-0 text-[var(--color-text)]"
      style={{ height: "var(--header-h)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-2 pl-3 pr-2.5 md:gap-3 md:pl-8 md:pr-8">
        {inShell && mobileTabs ? (
          <BrandMark onClick={() => mobileTabs.switchTab("home")} />
        ) : (
          <Link href={`/${locale}`} className="tap-card min-w-0">
            <BrandMark />
          </Link>
        )}

        <div className="header-actions flex items-center gap-1.5 shrink-0 md:gap-2">
          <HeaderSearchTrigger className="header-search-pill md:hidden" />

          <LocaleSwitcher compact className="max-md:flex md:hidden" />

          <button
            type="button"
            onClick={toggleFavorites}
            className="header-fav-btn relative"
            aria-label={t("favorites")}
          >
            <Heart size={20} strokeWidth={1.85} className="text-[var(--color-text)]" />
            {hydrated && favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-sale)] text-[9px] font-bold text-white px-0.5 ring-2 ring-[var(--color-surface)]">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2">
            <HeaderSearchTrigger className="header-search-pill header-search-pill--desktop" />
            <LocaleSwitcher />
            <button
              type="button"
              onClick={toggleFavorites}
              className="header-fav-btn relative !w-11 !h-11"
              aria-label={t("favorites")}
            >
              <Heart size={21} strokeWidth={1.75} className="text-[var(--color-text)]" />
              {hydrated && favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-sale)] text-[9px] font-bold text-white px-0.5">
                  {favCount > 9 ? "9+" : favCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
