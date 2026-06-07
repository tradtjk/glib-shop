"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCatalogProducts } from "@/hooks/use-catalog";
import { filterProductsByQuery } from "@/lib/search";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { CategoryBar } from "@/components/catalog/CategoryBar";
import { Page, PageHeader } from "@/components/ui/Page";
import { TabCatalogSkeleton } from "@/components/skeletons/PageSkeletons";
import type { Locale, Product } from "@/types";

const PAGE_SIZE = 12;

type SortKey = "new" | "price-asc" | "price-desc" | "popular";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const ALL_COLORS = ["Black", "White", "Charcoal", "Navy", "Beige", "Gray", "Brown", "Green"];

function CatalogContentInner() {
  const products = useCatalogProducts();
  const locale = useLocale() as Locale;
  const t = useTranslations("catalog");
  const tc = useTranslations("common");
  const tCart = useTranslations("cart");
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>(
    (searchParams.get("sort") as SortKey) || "new"
  );
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(4000);
  const [sizeFilter, setSizeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list: Product[] = filterProductsByQuery([...products], search, locale);

    if (category) list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (sizeFilter) list = list.filter((p) => p.sizes.includes(sizeFilter));
    if (colorFilter) {
      list = list.filter((p) => p.colors.some((c) => c.name === colorFilter));
    }
    list = list.filter((p) => p.price <= priceMax);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list = list.filter((p) => p.isPopular);
        break;
      default:
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return list;
  }, [products, search, category, inStockOnly, priceMax, sort, sizeFilter, colorFilter, locale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetPage = () => setPage(1);

  return (
    <Page wide>
      <PageHeader
        title={t("title")}
        subtitle={t("showing", { count: filtered.length })}
      />

      <SearchAutocomplete
        variant="catalog"
        initialQuery={search}
        onQueryChange={(q) => {
          setSearch(q);
          resetPage();
        }}
      />

      <CategoryBar
        active={category}
        onChange={(slug) => {
          setCategory(slug);
          resetPage();
        }}
      />

      <div className="flex items-center justify-between gap-2 py-2 sticky top-[var(--header-h)] z-30 bg-[var(--color-bg)] -mx-0.5 px-0.5">
        <button
          type="button"
          className="chip flex items-center gap-1"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={12} />
          {t("filters")}
        </button>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey);
            resetPage();
          }}
          className="chip border-0 bg-transparent text-[var(--color-text)] max-w-[48%] truncate"
        >
          <option value="new">{t("sortNew")}</option>
          <option value="price-asc">{t("sortPriceAsc")}</option>
          <option value="price-desc">{t("sortPriceDesc")}</option>
          <option value="popular">{t("sortPopular")}</option>
        </select>
      </div>

      {filtersOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/35 md:hidden"
            aria-label="Close"
            onClick={() => setFiltersOpen(false)}
          />
          <aside
            className="fixed left-0 right-0 z-50 rounded-t-xl bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 max-h-[75vh] overflow-y-auto lg:static lg:max-h-none lg:rounded-none lg:border-0 lg:p-0 lg:mb-0 lg:shadow-none"
            style={{ bottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between mb-3 md:hidden">
              <span className="text-sm font-semibold">{t("filters")}</span>
              <button type="button" onClick={() => setFiltersOpen(false)} className="icon-btn">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-[10px] text-[var(--color-muted)] block mb-1">{t("size")}</label>
                <select
                  value={sizeFilter}
                  onChange={(e) => { setSizeFilter(e.target.value); resetPage(); }}
                  className="input"
                >
                  <option value="">{tc("all")}</option>
                  {ALL_SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[var(--color-muted)] block mb-1">{t("color")}</label>
                <select
                  value={colorFilter}
                  onChange={(e) => { setColorFilter(e.target.value); resetPage(); }}
                  className="input"
                >
                  <option value="">{tc("all")}</option>
                  {ALL_COLORS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[var(--color-muted)] block mb-1">
                  {t("price")}: {priceMax}
                </label>
                <input
                  type="range"
                  min={100}
                  max={3000}
                  step={50}
                  value={priceMax}
                  onChange={(e) => { setPriceMax(Number(e.target.value)); resetPage(); }}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => { setInStockOnly(e.target.checked); resetPage(); }}
                />
                {t("inStockOnly")}
              </label>
              <button
                type="button"
                className="btn btn-primary w-full md:hidden"
                onClick={() => setFiltersOpen(false)}
              >
                {tCart("apply")}
              </button>
            </div>
          </aside>
        </>
      )}

      {filtered.length === 0 ? (
        <p className="text-center py-16 text-sm text-[var(--color-muted)]">{t("noResults")}</p>
      ) : (
        <>
          <ProductGrid>
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="icon-btn disabled:opacity-30"
                aria-label={t("prev")}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs text-[var(--color-muted)] tabular-nums">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="icon-btn disabled:opacity-30"
                aria-label={t("next")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
      <div className="mobile-tab-end-spacer md:hidden" aria-hidden />
    </Page>
  );
}

export function CatalogTabContent() {
  return (
    <Suspense fallback={<TabCatalogSkeleton />}>
      <CatalogContentInner />
    </Suspense>
  );
}
