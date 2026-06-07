"use client";

import { useCatalogStore } from "@/stores/catalog-store";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  products as seedProducts,
  categories as seedCategories,
  promotions as seedPromotions,
} from "@/lib/mock-data";

export function useCatalogProducts() {
  const hydrated = useHydrated();
  const products = useCatalogStore((s) => s.products);
  return hydrated ? products : seedProducts;
}

export function useCatalogCategories() {
  const hydrated = useHydrated();
  const categories = useCatalogStore((s) => s.categories);
  return hydrated ? categories : seedCategories;
}

export function useCatalogPromotions() {
  const hydrated = useHydrated();
  const promotions = useCatalogStore((s) => s.promotions);
  return hydrated ? promotions : seedPromotions;
}
