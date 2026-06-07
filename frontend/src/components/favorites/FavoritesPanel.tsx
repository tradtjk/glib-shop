"use client";

import Image from "next/image";
import Link from "next/link";
import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ChevronRight } from "lucide-react";
import { useFavoritesPanel } from "@/contexts/favorites-panel-context";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useCatalogProducts } from "@/hooks/use-catalog";
import { t as localized } from "@/lib/localized";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Locale } from "@/types";

export function FavoritesPanel() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const tc = useTranslations("cart");
  const { open, closeFavorites } = useFavoritesPanel();
  const hydrated = useHydrated();
  const products = useCatalogProducts();
  const productIds = useFavoritesStore((s) => s.productIds);
  const favProducts = products.filter((p) => productIds.includes(p.id));

  const show = open && hydrated;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[88] bg-black/40"
            aria-label="Close"
            onClick={closeFavorites}
          />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 z-[89] mx-auto w-full max-w-lg"
            style={{ top: "var(--header-h)" }}
          >
            <div className="mx-3 mt-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl overflow-hidden max-h-[min(70vh,520px)] flex flex-col">
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--color-border)] shrink-0">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-[var(--color-sale)]" fill="currentColor" />
                  <h2 className="text-base font-semibold">{t("favorites")}</h2>
                  {favProducts.length > 0 && (
                    <span className="text-xs font-medium text-[var(--color-muted)]">
                      {favProducts.length}
                    </span>
                  )}
                </div>
                <button type="button" onClick={closeFavorites} className="icon-btn" aria-label="Close">
                  <X size={22} />
                </button>
              </div>

              {favProducts.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm text-[var(--color-muted)] mb-4">{tc("empty")}</p>
                  <Link
                    href={`/${locale}/catalog`}
                    onClick={closeFavorites}
                    className="btn btn-primary inline-flex tap-card"
                  >
                    {tc("continue")}
                  </Link>
                </div>
              ) : (
                <>
                  <p className="px-4 pt-2 pb-1 text-xs text-[var(--color-muted)] shrink-0">
                    Готовые комплекты и товары
                  </p>
                  <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-2 space-y-2">
                    {favProducts.map((product) => {
                      const discount = calcDiscount(product.price, product.oldPrice);
                      return (
                        <li key={product.id}>
                          <InstantLink
                            href={`/${locale}/product/${product.slug}`}
                            onClick={closeFavorites}
                            className="tap-card flex gap-3 p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-brand)] hover:shadow-sm active:scale-[0.99] transition-all"
                          >
                            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              <Image
                                src={product.images[0]}
                                alt={localized(product.name, locale)}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="text-sm font-medium line-clamp-2 leading-snug pr-1">
                                {localized(product.name, locale)}
                              </p>
                              <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                                <span className="text-base font-bold text-[var(--color-brand)] tabular-nums">
                                  {formatPrice(product.price)}
                                </span>
                                {product.oldPrice && (
                                  <span className="text-xs text-[var(--color-muted)] line-through tabular-nums">
                                    {formatPrice(product.oldPrice)}
                                  </span>
                                )}
                                {discount > 0 && (
                                  <span className="badge-sale">−{discount}%</span>
                                )}
                              </div>
                            </div>
                            <ChevronRight
                              size={18}
                              className="shrink-0 self-center text-[var(--color-muted)]"
                            />
                          </InstantLink>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="shrink-0 border-t border-[var(--color-border)] p-3">
                    <Link
                      href={`/${locale}/account/favorites`}
                      onClick={closeFavorites}
                      className="btn btn-secondary w-full tap-card"
                    >
                      Все избранное
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
