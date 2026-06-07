"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useSearchOverlay } from "@/contexts/search-context";
import { getSearchSuggestions } from "@/lib/search";
import { categories, getNewProducts } from "@/lib/mock-data";
import { t as localized } from "@/lib/localized";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/types";

const POPULAR = ["костюм", "футболка", "кроссовки", "рубашка"];

export function FullScreenSearch() {
  const { open, closeSearch } = useSearchOverlay();
  const locale = useLocale() as Locale;
  const t = useTranslations("search");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const suggestions = query.length >= 1 ? getSearchSuggestions(query, locale, 8) : [];
  const newProducts = getNewProducts().slice(0, 4);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[var(--color-bg)] flex flex-col"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: 0.05 }}
            className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <div className="search-bar search-bar--overlay">
              <Search size={20} className="text-[var(--color-muted)] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
              />
              <button type="button" onClick={closeSearch} className="icon-btn shrink-0" aria-label="Close">
                <X size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex-1 overflow-y-auto px-4 py-4"
          >
            {query && suggestions.length > 0 ? (
              <ul className="card divide-y divide-[var(--color-border)] overflow-hidden">
                {suggestions.map((s) => (
                  <li key={`${s.type}-${s.id}`}>
                    <Link
                      href={s.href}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 hover:bg-[var(--color-bg)]"
                    >
                      {s.image && (
                        <div className="relative w-12 h-14 shrink-0 rounded overflow-hidden bg-neutral-100">
                          <Image src={s.image} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.label}</p>
                        <p className="text-xs text-[var(--color-muted)]">{s.sublabel}</p>
                      </div>
                      {s.price != null && (
                        <span className="text-sm font-semibold tabular-nums">{formatPrice(s.price)}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query ? (
              <p className="text-sm text-[var(--color-muted)] text-center py-12">Ничего не найдено</p>
            ) : (
              <>
                <p className="text-sm font-medium text-[var(--color-text)] mb-2">{t("popularQueries")}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {POPULAR.map((q) => (
                    <button key={q} type="button" onClick={() => setQuery(q)} className="chip">
                      {q}
                    </button>
                  ))}
                </div>
                <p className="text-sm font-medium mb-3">{t("newArrivals")}</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {newProducts.map((p) => (
                    <InstantLink key={p.id} href={`/${locale}/product/${p.slug}`} onClick={closeSearch}>
                      <div className="relative aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden bg-neutral-100">
                        <Image src={p.images[0]} alt="" fill className="object-cover" sizes="45vw" />
                      </div>
                      <p className="text-sm mt-2 line-clamp-2 leading-snug">{localized(p.name, locale)}</p>
                      <p className="text-sm font-semibold tabular-nums mt-0.5">{formatPrice(p.price)}</p>
                    </InstantLink>
                  ))}
                </div>
                <p className="text-sm font-medium mb-2">{t("categories")}</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${locale}/catalog?category=${c.slug}`}
                      onClick={closeSearch}
                      className="chip"
                    >
                      {localized(c.name, locale)}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {query && (
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href={`/${locale}/catalog?q=${encodeURIComponent(query)}`}
                onClick={closeSearch}
                className="btn btn-primary w-full"
              >
                {t("seeAll")} «{query}»
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
