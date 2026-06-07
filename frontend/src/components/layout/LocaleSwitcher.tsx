"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const locales = [
  { code: "ru", label: "RU" },
  { code: "tj", label: "TJ" },
] as const;

export function LocaleSwitcher({
  variant = "light",
  compact = false,
  className,
}: {
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dark = variant === "dark";

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") || `/${newLocale}`);
  };

  return (
    <div
      className={cn(
        "flex font-medium",
        compact
          ? "gap-0 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] p-0.5 text-[9px] shadow-[var(--shadow-xs)]"
          : "gap-0.5 text-[10px]",
        className
      )}
    >
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchLocale(l.code)}
          className={cn(
            "transition-colors",
            compact ? "px-2 py-1 rounded-full min-w-[1.75rem]" : "px-2 py-1 rounded",
            dark
              ? locale === l.code
                ? "bg-white text-black"
                : "text-white/60"
              : compact
                ? locale === l.code
                  ? "bg-[var(--color-surface)] text-[var(--color-brand)] font-semibold shadow-sm"
                  : "text-[var(--color-muted)]"
                : locale === l.code
                  ? "text-[var(--color-text)] font-semibold"
                  : "text-[var(--color-muted)]"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
