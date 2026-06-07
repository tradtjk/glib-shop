"use client";

import { useCatalogProducts } from "@/hooks/use-catalog";
import { ProductGridSection } from "./ProductGridSection";

export function HomeNewArrivals() {
  const products = useCatalogProducts();
  const list = products.filter((p) => p.isNew).slice(0, 4);
  return <ProductGridSection titleKey="newArrivals" products={list} />;
}

export function HomePopular() {
  const products = useCatalogProducts();
  const list = products.filter((p) => p.isPopular).slice(0, 4);
  return <ProductGridSection titleKey="popular" products={list} />;
}
