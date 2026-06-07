"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useCatalogProducts } from "@/hooks/use-catalog";
import {
  getCatalogProductBySlug,
  getCatalogSimilar,
} from "@/stores/catalog-store";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductPageSkeleton } from "@/components/skeletons/PageSkeletons";
import { useHydrated } from "@/hooks/use-hydrated";

export default function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = use(params);
  const hydrated = useHydrated();
  const products = useCatalogProducts();
  const product = hydrated ? getCatalogProductBySlug(products, slug) : undefined;

  if (!hydrated) {
    return <ProductPageSkeleton />;
  }

  if (!product) notFound();

  return (
    <ProductDetail product={product} similar={getCatalogSimilar(products, product)} />
  );
}
