"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCatalogProducts } from "@/hooks/use-catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";

export default function FavoritesPage() {
  const locale = useLocale();
  const t = useTranslations("account");
  const tc = useTranslations("cart");
  const hydrated = useHydrated();
  const products = useCatalogProducts();
  const productIds = useFavoritesStore((s) => s.productIds);
  const favProducts = hydrated
    ? products.filter((p) => productIds.includes(p.id))
    : [];

  return (
    <div>
      <AccountPageHeader title={t("favorites")} />
      {favProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-[var(--color-muted)] mb-4">{tc("empty")}</p>
          <Link href={`/${locale}/catalog`} className="btn btn-primary inline-flex">
            {tc("continue")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {favProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
