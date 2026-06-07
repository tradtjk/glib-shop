"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { looks } from "@/lib/mock-data";
import { t as localized } from "@/lib/localized";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";
import type { Locale } from "@/types";

export function LooksSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("sections");

  return (
    <section id="looks" className="section bg-[var(--color-surface)]">
      <CatalogInset>
        <SectionTitle title={t("looks")} subtitle={t("looksSubtitle")} />
        <div className="catalog-hscroll mt-3">
          <div className="catalog-hscroll-track">
            {looks.map((look) => {
              const discount = calcDiscount(look.bundlePrice, look.oldBundlePrice);
              return (
                <Link
                  key={look.id}
                  href={`/${locale}/catalog?look=${look.slug}`}
                  className="catalog-col-w snap-start group flex flex-col"
                >
                  <div className="product-card-media relative aspect-[3/4]">
                    <Image
                      src={look.image}
                      alt={localized(look.name, locale)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, 22vw"
                    />
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 z-10 badge-sale">
                        −{discount}%
                      </span>
                    )}
                  </div>
                  <div className="pt-1.5 px-0.5">
                    <p className="text-sm text-[var(--color-text)] line-clamp-2 leading-snug group-hover:opacity-80 transition-opacity">
                      {localized(look.name, locale)}
                    </p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base font-semibold tabular-nums">
                        {formatPrice(look.bundlePrice)}
                      </span>
                      {look.oldBundlePrice > look.bundlePrice && (
                        <span className="text-sm text-[var(--color-muted)] line-through tabular-nums">
                          {formatPrice(look.oldBundlePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </CatalogInset>
    </section>
  );
}
