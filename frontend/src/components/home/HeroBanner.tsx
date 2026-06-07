"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";

const HERO_IMAGE = "/hero/main.jpg";

export function HeroBanner() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const mobileTabs = useMobileTabs();

  const goCatalog = (e: React.MouseEvent) => {
    if (mobileTabs?.isShellActive) {
      e.preventDefault();
      mobileTabs.switchTab("catalog");
    }
  };

  return (
    <section className="relative h-[min(74svh,660px)] min-h-[440px] md:h-[80svh] md:min-h-[500px] md:max-h-[760px] overflow-hidden bg-[#0d4a32]">
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-[center_22%] md:object-[center_30%] scale-[1.02]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <div
        className="relative z-10 flex h-full flex-col justify-end px-[var(--page-x)] md:px-8 max-w-7xl mx-auto w-full"
        style={{ paddingBottom: "calc(var(--tabbar-h) + 1.5rem)" }}
      >
        <span className="inline-flex items-center gap-1.5 w-fit rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 mb-3">
          <Sparkles size={12} className="text-white/80" />
          Dushanbe · Premium
        </span>
        <h1 className="text-[2rem] leading-[1.1] md:text-[3.25rem] font-semibold tracking-tight text-white">
          Golib Shop
        </h1>
        <p className="mt-3 text-[0.9375rem] md:text-lg text-white/88 max-w-[20rem] md:max-w-md leading-relaxed">
          {t("tagline")}
        </p>
        <Link
          href={`/${locale}/catalog`}
          onClick={goCatalog}
          className="btn btn-hero mt-6 w-full max-w-[240px] md:w-fit !min-h-[3rem] !px-6"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
