"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCatalogCategories } from "@/hooks/use-catalog";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { useMobileTabs } from "@/contexts/mobile-tabs-context";
import {
  categoryRowScrollState,
  scrollCategoryRow,
} from "@/lib/category-scroll";
import { t as localized } from "@/lib/localized";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const DEFAULT_IMAGES: Record<string, string> = {
  "": "/categories/category-all.png",
  sets: "/categories/category-sets.png",
  "t-shirts": "/categories/category-t-shirts.png",
  shirts: "/categories/category-shirts.png",
  pants: "/categories/category-pants.png",
  shoes: "/categories/category-shoes.png",
  accessories: "/categories/category-accessories.png",
};

function categoryImage(slug: string, image?: string) {
  if (image?.startsWith("/categories/")) return image;
  return DEFAULT_IMAGES[slug] ?? image ?? DEFAULT_IMAGES[""];
}

interface CategoryIconRowProps {
  active?: string;
  onChange?: (slug: string) => void;
  linkMode?: boolean;
  className?: string;
  showNav?: boolean;
  headerless?: boolean;
  title?: string;
  subtitle?: string;
}

export function CategoryIconRow({
  active = "",
  onChange,
  linkMode = false,
  className,
  showNav = false,
  headerless = false,
  title,
  subtitle,
}: CategoryIconRowProps) {
  const locale = useLocale() as Locale;
  const tc = useTranslations("common");
  const categories = useCatalogCategories();
  const mobileTabs = useMobileTabs();
  const instant = useInstantNav();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const items = [
    { slug: "", label: tc("all"), image: DEFAULT_IMAGES[""] },
    ...categories.map((cat) => ({
      slug: cat.slug,
      label: localized(cat.name, locale),
      image: categoryImage(cat.slug, cat.image),
    })),
  ];

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const state = categoryRowScrollState(el);
    setCanLeft(state.canLeft);
    setCanRight(state.canRight);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(() => requestAnimationFrame(updateArrows));
    ro.observe(el);

    const timers = [100, 400, 900].map((ms) => window.setTimeout(updateArrows, ms));

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) updateArrows();
      },
      { threshold: 0.05 }
    );
    io.observe(el);

    return () => {
      timers.forEach(clearTimeout);
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
      io.disconnect();
    };
  }, [updateArrows, items.length]);

  useEffect(() => {
    if (mobileTabs?.activeTab === "catalog" || mobileTabs?.activeTab === "home") {
      requestAnimationFrame(updateArrows);
    }
  }, [mobileTabs?.activeTab, updateArrows]);

  const scrollStep = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    scrollCategoryRow(el, dir);
    window.setTimeout(updateArrows, 320);
  };

  const goToCatalog = (slug: string) => {
    const href = slug
      ? `/${locale}/catalog?category=${slug}`
      : `/${locale}/catalog`;

    if (mobileTabs?.isShellActive) {
      mobileTabs.switchTab("catalog");
    }
    if (instant) {
      instant.navigate(href);
      return;
    }
    window.location.href = href;
  };

  const handleItemClick = (slug: string) => {
    if (linkMode) {
      goToCatalog(slug);
      return;
    }
    onChange?.(slug);
  };

  const navButtons = showNav ? (
    <div className="flex gap-1.5 shrink-0">
      <button
        type="button"
        className="category-nav-btn"
        onClick={() => scrollStep(-1)}
        disabled={!canLeft}
        aria-label="Предыдущая категория"
      >
        <ChevronLeft size={18} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="category-nav-btn"
        onClick={() => scrollStep(1)}
        disabled={!canRight}
        aria-label="Следующая категория"
      >
        <ChevronRight size={18} strokeWidth={2.25} />
      </button>
    </div>
  ) : null;

  const showHeader = !headerless && (title || showNav);

  return (
    <div className={cn("category-icon-row-wrap", className)}>
      {showHeader && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <div className="min-w-0 flex-1">
              <span className="section-accent" aria-hidden />
              {subtitle && <p className="section-sub">{subtitle}</p>}
              <h2 className="section-title">{title}</h2>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {navButtons}
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="category-icon-scroll catalog-hscroll snap-x snap-proximity"
      >
        <div className="catalog-hscroll-track">
        {items.map(({ slug, label, image }) => {
          const isActive = active === slug;
          return (
            <button
              key={slug || "all"}
              type="button"
              data-category-item
              onClick={() => handleItemClick(slug)}
              className={cn(
                "category-icon-item snap-start shrink-0 flex flex-col items-center gap-1.5 w-[4.75rem] group select-none",
                isActive && "is-active"
              )}
            >
              <span
                className={cn(
                  "category-icon-thumb block h-[3.75rem] w-[3.75rem] rounded-2xl p-[2px] transition-all",
                  isActive ? "category-icon-thumb--active" : "category-icon-thumb--idle"
                )}
              >
                <span className="block h-full w-full overflow-hidden rounded-[0.65rem]">
                  <Image
                    src={image}
                    alt={label}
                    width={60}
                    height={60}
                    className="h-full w-full object-cover"
                    sizes="60px"
                    draggable={false}
                    onLoad={updateArrows}
                  />
                </span>
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium text-center leading-tight w-full line-clamp-2",
                  isActive ? "text-[var(--color-brand)]" : "text-[var(--color-muted)]"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
