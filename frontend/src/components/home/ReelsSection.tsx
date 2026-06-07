"use client";

import { useTranslations } from "next-intl";
import { Instagram } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

const reels = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988350-763728e46ecc?w=400&q=80",
];

export function ReelsSection() {
  const t = useTranslations("sections");

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle title={t("reels")} />
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {reels.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 w-[200px] sm:w-[240px] aspect-[9/16] snap-start overflow-hidden bg-[#F5F5F5] group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${src})` }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
            </div>
          </a>
        ))}
      </div>
      <p className="text-center text-xs text-black/40 mt-6 tracking-wide">
        @golibshop · Instagram Reels
      </p>
    </section>
  );
}
