"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useCartModal } from "@/contexts/cart-modal-context";
import { useCartStore } from "@/stores/cart-store";
import { t as localized } from "@/lib/localized";
import { formatPrice } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";
import type { Locale } from "@/types";

export function CartAddedModal() {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const { open, close } = useCartModal();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.total());
  const cartCount = useCartStore((s) => s.count());

  const show = open && hydrated && items.length > 0;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/45"
            aria-label="Close"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed left-0 right-0 z-[95] mx-auto flex w-full max-w-lg flex-col rounded-t-2xl bg-[var(--color-surface)] shadow-2xl bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] md:bottom-0 max-h-[min(58vh,420px)] md:max-h-[min(70vh,520px)]"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed */}
            <div className="shrink-0 border-b border-[var(--color-border)]">
              <div className="flex justify-center pt-2 pb-0.5">
                <span className="h-1 w-10 rounded-full bg-[var(--color-border)]" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="flex items-center gap-2 min-w-0 text-[var(--color-brand)]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)]/10">
                    <Check size={18} strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-semibold truncate">{t("addedTitle")}</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="icon-btn shrink-0 hover:bg-black/5"
                  aria-label="Close"
                >
                  <X size={22} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Items — scroll */}
            <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-2 space-y-2">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-3 rounded-[var(--radius)] border border-[var(--color-border)] p-2.5 bg-[var(--color-bg)]"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded bg-neutral-100">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 leading-snug">
                      {localized(item.name, locale)}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">
                      {item.size}
                      {item.color ? ` · ${item.color}` : ""} · ×{item.quantity}
                    </p>
                    <p className="text-sm font-semibold tabular-nums mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer — fixed, buttons always visible */}
            <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 pt-3 pb-4 safe-bottom">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-[var(--color-muted)]">
                  {t("inCart", { count: cartCount })}
                </span>
                <span className="text-base font-semibold tabular-nums">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/${locale}/checkout`}
                  onClick={close}
                  className="btn w-full !min-h-[2.75rem] bg-[var(--color-brand)] text-white hover:opacity-90 border-0"
                >
                  {t("checkout")}
                </Link>
                <button
                  type="button"
                  onClick={close}
                  className="btn btn-secondary w-full !min-h-[2.75rem]"
                >
                  {t("continue")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
