"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogInset } from "@/components/layout/CatalogInset";
import { SectionTitle } from "./SectionTitle";

interface ProductGridSectionProps {
  titleKey: "newArrivals" | "popular";
  products: Product[];
}

export function ProductGridSection({
  titleKey,
  products,
}: ProductGridSectionProps) {
  const t = useTranslations("sections");

  return (
    <section className="section w-full min-w-0">
      <CatalogInset>
        <SectionTitle
          title={t(titleKey)}
          subtitle={titleKey === "newArrivals" ? "New in" : "Trending"}
        />
        <ProductGrid>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </ProductGrid>
      </CatalogInset>
    </section>
  );
}
