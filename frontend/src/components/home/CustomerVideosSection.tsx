"use client";

import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { customerVideos } from "@/lib/mock-data";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";

export function CustomerVideosSection() {
  const locale = useLocale();
  const t = useTranslations("sections");

  return (
    <section className="section">
      <CatalogInset>
        <SectionTitle title={t("customerVideos")} subtitle="Reels" />
        <div className="catalog-hscroll">
          <div className="catalog-hscroll-track">
            {customerVideos.map((item) => (
              <InstantLink
                key={item.id}
                href={`/${locale}/product/${item.productSlug}`}
                className="snap-start shrink-0 w-[42vw] max-w-[9.5rem]"
              >
                <div className="video-reel relative aspect-[9/16] bg-neutral-900">
                  <video
                    src={item.video}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <p className="mt-2 text-[11px] font-medium text-[var(--color-muted)] line-clamp-1">
                  @{item.username}
                </p>
              </InstantLink>
            ))}
          </div>
        </div>
      </CatalogInset>
    </section>
  );
}
