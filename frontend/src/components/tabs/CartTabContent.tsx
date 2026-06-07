"use client";

import Image from "next/image";
import Link from "next/link";
import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import { t as localized } from "@/lib/localized";
import { formatPrice } from "@/lib/utils";
import { Page, PageHeader } from "@/components/ui/Page";
import type { Locale } from "@/types";

export function CartTabContent() {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const mobileTabs = useMobileTabs();
  const { items, updateQuantity, removeItem, total, promoCode, setPromoCode } =
    useCartStore();
  const sum = total();
  const discount = promoCode === "GOLIB10" ? sum * 0.1 : 0;

  const goCatalog = () => {
    if (mobileTabs?.isShellActive) {
      mobileTabs.switchTab("catalog");
      return;
    }
  };

  if (items.length === 0) {
    return (
      <Page>
        <PageHeader title={t("title")} />
        <p className="text-sm text-[var(--color-muted)] text-center py-12">{t("empty")}</p>
        {mobileTabs?.isShellActive ? (
          <button type="button" onClick={goCatalog} className="btn btn-primary w-full">
            {t("continue")}
          </button>
        ) : (
          <Link href={`/${locale}/catalog`} className="btn btn-primary w-full">
            {t("continue")}
          </Link>
        )}
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title={t("title")} subtitle={`${items.length} items`} />

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="card flex gap-3 p-2.5"
          >
            <InstantLink
              href={`/${locale}/product/${item.slug}`}
              className="relative w-16 h-20 shrink-0 rounded overflow-hidden bg-neutral-100"
            >
              <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
            </InstantLink>
            <div className="flex-1 min-w-0">
              <InstantLink
                href={`/${locale}/product/${item.slug}`}
                className="text-xs font-medium line-clamp-2 leading-snug"
              >
                {localized(item.name, locale)}
              </InstantLink>
              <p className="text-[10px] text-[var(--color-muted)] mt-0.5">
                {item.size} · {item.color}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center rounded border border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                    }
                    className="icon-btn !w-8 !h-8"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-xs tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                    }
                    className="icon-btn !w-8 !h-8"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="text-xs font-semibold tabular-nums">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId, item.size, item.color)}
              className="icon-btn self-start shrink-0"
              aria-label={t("remove")}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-3 mt-4 space-y-3">
        <div className="flex gap-2">
          <input
            placeholder={t("promo")}
            value={promoCode || ""}
            onChange={(e) => setPromoCode(e.target.value || null)}
            className="input flex-1 !min-h-9 text-xs"
          />
          <button type="button" className="btn btn-secondary !min-h-9 !px-3 text-xs">
            {t("apply")}
          </button>
        </div>
        {discount > 0 && (
          <p className="text-xs text-[var(--color-sale)]">−{formatPrice(discount)}</p>
        )}
        <div className="flex justify-between text-sm font-semibold">
          <span>{t("subtotal")}</span>
          <span className="tabular-nums">{formatPrice(sum - discount)}</span>
        </div>
        <Link href={`/${locale}/checkout`} className="btn btn-primary w-full">
          {t("checkout")}
        </Link>
      </div>
    </Page>
  );
}
