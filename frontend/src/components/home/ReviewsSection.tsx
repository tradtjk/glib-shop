"use client";

import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { reviews } from "@/lib/mock-data";
import { t as localized } from "@/lib/localized";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";
import type { Locale } from "@/types";

export function ReviewsSection() {
  const locale = useLocale() as Locale;
  const t = useTranslations("sections");

  return (
    <section className="section border-t border-[var(--color-border)]">
      <CatalogInset>
        <SectionTitle title={t("reviews")} subtitle="Отзывы" />
        <div className="catalog-hscroll">
          <div className="catalog-hscroll-track">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="review-card snap-start shrink-0 w-[min(78vw,17.5rem)] p-4"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={11}
                      className={
                        j < review.rating
                          ? "fill-[var(--color-brand)] text-[var(--color-brand)]"
                          : "text-[var(--color-border)]"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text)] line-clamp-4">
                  {localized(review.text, locale)}
                </p>
                <p className="mt-3 text-xs font-semibold text-[var(--color-muted)]">
                  {review.author}
                </p>
              </article>
            ))}
          </div>
        </div>
      </CatalogInset>
    </section>
  );
}
