"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchSuggestions } from "@/lib/search";
import { formatPrice, cn } from "@/lib/utils";
import type { Locale } from "@/types";

interface SearchAutocompleteProps {
  variant?: "header" | "catalog";
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
  className?: string;
}

export function SearchAutocomplete({
  variant = "header",
  initialQuery = "",
  onQueryChange,
  className,
}: SearchAutocompleteProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("catalog");
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const suggestions = query.trim().length >= 1
    ? getSearchSuggestions(query, locale, 8)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const goToCatalog = useCallback(() => {
    const q = query.trim();
    router.push(
      q ? `/${locale}/catalog?q=${encodeURIComponent(q)}` : `/${locale}/catalog`
    );
    setOpen(false);
  }, [query, locale, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && query) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        router.push(suggestions[activeIndex].href);
        setOpen(false);
      } else {
        goToCatalog();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isHeader = variant === "header";

  return (
    <div ref={wrapRef} className={cn("relative mb-3", className)}>
      <div className={cn("search-bar", isHeader && "border-b border-[var(--color-border)] rounded-none px-0")}>
        <Search size={20} className="text-[var(--color-muted)] shrink-0" strokeWidth={1.75} />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            onQueryChange?.(v);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("search")}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onQueryChange?.("");
              setOpen(false);
              setActiveIndex(-1);
            }}
            className="icon-btn shrink-0"
            aria-label="Очистить"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-[60] top-full mt-2 overflow-hidden card shadow-lg"
          >
            {suggestions.length === 0 ? (
              <p className="px-4 py-8 text-sm text-[var(--color-muted)] text-center">
                {t("noResults")}
              </p>
            ) : (
              <ul className="max-h-[360px] overflow-y-auto py-1">
                {suggestions.map((item, i) => (
                  <li key={`${item.type}-${item.id}`}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors",
                        activeIndex === i ? "bg-[var(--color-bg)]" : "hover:bg-[var(--color-bg)]"
                      )}
                      onMouseEnter={() => setActiveIndex(i)}
                    >
                      {item.image && (
                        <div className="relative w-12 h-14 shrink-0 rounded overflow-hidden bg-neutral-100">
                          <Image src={item.image} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.label}</p>
                        <p className="text-xs text-[var(--color-muted)]">{item.sublabel}</p>
                      </div>
                      {item.price != null && (
                        <span className="text-sm font-semibold shrink-0 tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      )}
                      <ArrowRight size={16} className="text-[var(--color-muted)] shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={goToCatalog}
              className="w-full border-t border-[var(--color-border)] py-3.5 text-sm font-medium text-[var(--color-brand)] hover:bg-[var(--color-bg)] transition-colors"
            >
              Все результаты по «{query}»
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
