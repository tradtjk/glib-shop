"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { MapPin, Clock, Phone } from "lucide-react";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";

const STORE_PHOTOS = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  "https://images.unsplash.com/photo-1555529669-2269763671c0?w=600&q=80",
];

export function StoreSection() {
  const t = useTranslations("sections");
  const store = useTranslations("store");

  return (
    <section
      id="store"
      className="section bg-[var(--color-surface)] border-t border-[var(--color-border)]"
    >
      <CatalogInset>
        <SectionTitle title={t("store")} subtitle="Dushanbe" />
        <div className="grid grid-cols-2 gap-2 mb-4">
          {STORE_PHOTOS.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-neutral-100 shadow-md"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="45vw" />
            </div>
          ))}
        </div>
        <div className="card card-elevated p-4 space-y-3 text-sm">
          <p className="flex items-start gap-2.5">
            <MapPin size={16} className="shrink-0 mt-0.5 text-[var(--color-brand)]" />
            {store("address")}
          </p>
          <p className="flex items-center gap-2.5">
            <Clock size={16} className="shrink-0 text-[var(--color-brand)]" />
            {store("hours")}
          </p>
          <a
            href={`tel:${store("phone")}`}
            className="flex items-center gap-2.5 font-semibold text-[var(--color-brand)]"
          >
            <Phone size={16} className="shrink-0" />
            {store("phone")}
          </a>
        </div>
      </CatalogInset>
    </section>
  );
}
