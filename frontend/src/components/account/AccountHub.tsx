"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useAccountSub, type AccountSubId } from "@/contexts/account-sub-context";
import { useHydrated } from "@/hooks/use-hydrated";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { formatPhoneDisplay } from "@/lib/phone";

const tiles: { key: string; icon: typeof User; sub: AccountSubId }[] = [
  { key: "profile", icon: User, sub: "profile" },
  { key: "orders", icon: Package, sub: "orders" },
  { key: "favorites", icon: Heart, sub: "favorites" },
  { key: "addresses", icon: MapPin, sub: "addresses" },
  { key: "settings", icon: Settings, sub: "settings" },
];

export function AccountHub() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("account");
  const { user, logout } = useAuthStore();
  const accountSub = useAccountSub();
  const hydrated = useHydrated();
  const isMobile = useIsMobile();
  const base = `/${locale}/account`;
  const instant = hydrated && isMobile && accountSub;

  if (!user) return null;

  const open = (sub: AccountSubId) => {
    if (instant) {
      accountSub.openSub(sub);
      return;
    }
    router.push(sub === "hub" ? base : `${base}/${sub}`);
  };

  const handleLogout = () => {
    if (!window.confirm(t("logoutConfirm"))) return;
    logout();
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div className="form-card !p-4 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
          <User size={28} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--color-muted)]">{t("welcome")}</p>
          <h2 className="text-lg font-semibold truncate">{user.name}</h2>
          <p className="text-sm text-[var(--color-muted)] tabular-nums">
            {formatPhoneDisplay(user.phone)}
          </p>
        </div>
      </div>

      <div className="account-hub-grid">
        {tiles.map(({ key, icon: Icon, sub }) => {
          const inner = (
            <>
              <span className="account-hub-icon">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <span className="account-hub-label">{t(key)}</span>
              <ChevronRight size={16} className="text-[var(--color-muted)] ml-auto shrink-0" />
            </>
          );

          if (instant) {
            return (
              <button
                key={key}
                type="button"
                onClick={() => open(sub)}
                className="account-hub-tile tap-card text-left"
              >
                {inner}
              </button>
            );
          }

          return (
            <Link key={key} href={`${base}/${sub}`} className="account-hub-tile tap-card">
              {inner}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="account-logout-link w-full"
      >
        {t("logout")}
      </button>
    </div>
  );
}
