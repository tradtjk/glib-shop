"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useAccountSub } from "@/contexts/account-sub-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useHydrated } from "@/hooks/use-hydrated";

export function AccountPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const locale = useLocale();
  const accountSub = useAccountSub();
  const isMobile = useIsMobile();
  const hydrated = useHydrated();

  const useInstantBack = hydrated && isMobile && accountSub;

  return (
    <header className="flex items-center gap-2 mb-5 -ml-1">
      {useInstantBack ? (
        <button
          type="button"
          onClick={() => accountSub.openSub("hub")}
          className="icon-btn shrink-0 text-[var(--color-text)] hover:bg-black/5"
          aria-label="Назад"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
      ) : (
        <Link
          href={`/${locale}/account`}
          className="icon-btn shrink-0 text-[var(--color-text)] hover:bg-black/5"
          aria-label="Назад"
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-semibold leading-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
