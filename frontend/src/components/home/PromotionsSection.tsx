"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Tag, ChevronRight } from "lucide-react";
import { useCatalogPromotions } from "@/hooks/use-catalog";
import { t as localized } from "@/lib/localized";
import { InstantLink } from "@/components/navigation/InstantLink";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";
import type { Locale } from "@/types";

export function PromotionsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("sections");
  const promotions = useCatalogPromotions();
  const featured = promotions.find((p) => p.accent) ?? promotions[0];
  const rest = promotions.filter((p) => p.id !== featured?.id);

  if (promotions.length === 0) return null;

  return (
    <section id="promotions" className="section bg-[var(--color-surface)]">
      <CatalogInset>
        <SectionTitle title={t("promotions")} subtitle="Промокоды и скидки" />

        {featured && (
          <InstantLink
            href={`/${locale}${featured.href}`}
            className="promo-featured block overflow-hidden mb-3 group"
          >
            <div className="relative h-44 md:h-52">
              <Image
                src={featured.image}
                alt={localized(featured.title, locale)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 80rem"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-5 md:p-7 text-white max-w-[88%]">
                <span className="inline-flex items-center gap-1.5 w-fit rounded-full border border-white/20 bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-semibold mb-3">
                  <Tag size={13} />
                  {featured.code}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                  {localized(featured.title, locale)}
                </h3>
                <p className="text-sm text-white/85 mt-1.5 line-clamp-2 max-w-sm">
                  {localized(featured.subtitle, locale)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {featured.discount}
                  <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </InstantLink>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {rest.map((promo) => (
            <InstantLink
              key={promo.id}
              href={`/${locale}${promo.href}`}
              className="card card-elevated flex gap-3 p-3.5 group hover:border-[var(--color-brand)]/35 active:scale-[0.99]"
            >
              <div className="relative w-[4.5rem] h-[4.5rem] shrink-0 rounded-[var(--radius-lg)] overflow-hidden bg-neutral-100 shadow-sm">
                <Image src={promo.image} alt="" fill className="object-cover" sizes="72px" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)]">
                  {promo.code}
                </span>
                <h3 className="text-sm font-semibold mt-0.5 line-clamp-2 leading-snug">
                  {localized(promo.title, locale)}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1">{promo.discount}</p>
              </div>
              <ChevronRight
                size={18}
                className="shrink-0 self-center text-[var(--color-muted)] group-hover:text-[var(--color-brand)] transition-colors"
              />
            </InstantLink>
          ))}
        </div>
      </CatalogInset>
    </section>
  );
}
