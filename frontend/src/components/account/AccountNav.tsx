"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { User, Package, Heart, MapPin, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { key: "profile", icon: User, href: "profile" },
  { key: "orders", icon: Package, href: "orders" },
  { key: "favorites", icon: Heart, href: "favorites" },
  { key: "addresses", icon: MapPin, href: "addresses" },
  { key: "settings", icon: Settings, href: "settings" },
] as const;

export function AccountNav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("account");
  const base = `/${locale}/account`;

  if (pathname === base || pathname === `${base}/`) {
    return null;
  }

  return (
    <nav className="hidden md:flex md:flex-col md:gap-1 md:border md:border-[var(--color-border)] md:rounded-[var(--radius-lg)] md:bg-[var(--color-surface)] md:p-1">
      {sections.map(({ key, icon: Icon, href }) => {
        const path = `${base}/${href}`;
        const active = pathname === path || pathname.startsWith(`${path}/`);
        return (
          <Link
            key={key}
            href={path}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius)] text-xs font-medium transition-colors w-full",
              active
                ? "bg-[var(--color-brand)] text-white"
                : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
            )}
          >
            <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
            {t(key)}
          </Link>
        );
      })}
    </nav>
  );
}
