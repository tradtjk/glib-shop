"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Category, Product } from "@/types";
import {
  categories as seedCategories,
  products as seedProducts,
  promotions as seedPromotions,
  type Promotion,
} from "@/lib/mock-data";
import { withGuaranteedImages } from "@/lib/product-images";

function newId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now()}`;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || `item-${Date.now()}`
  );
}

interface CatalogState {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  addProduct: (p: Omit<Product, "id" | "slug" | "sku"> & { slug?: string }) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addCategory: (data: Omit<Category, "id" | "slug"> & { slug?: string }) => Category;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  addPromotion: (data: Omit<Promotion, "id">) => Promotion;
  updatePromotion: (id: string, data: Partial<Promotion>) => void;
  removePromotion: (id: string) => void;
  resetCatalog: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: [...seedCategories].sort((a, b) => a.sortOrder - b.sortOrder),
      promotions: seedPromotions,

      addProduct: (data) => {
        const products = get().products;
        const slug = data.slug || slugify(data.name.ru);
        const product: Product = {
          ...data,
          id: newId("p"),
          slug,
          sku: `GLB-${1000 + products.length + 1}`,
        };
        set({ products: [...products, product] });
        return product;
      },

      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        });
      },

      removeProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      addCategory: (data) => {
        const cats = get().categories;
        const slug = data.slug || slugify(data.name.ru);
        const category: Category = {
          ...data,
          id: newId("c"),
          slug,
          sortOrder: data.sortOrder ?? cats.length + 1,
          image: data.image || "",
        };
        set({
          categories: [...cats, category].sort((a, b) => a.sortOrder - b.sortOrder),
        });
        return category;
      },

      updateCategory: (id, data) => {
        set({
          categories: get()
            .categories.map((c) => (c.id === id ? { ...c, ...data } : c))
            .sort((a, b) => a.sortOrder - b.sortOrder),
        });
      },

      removeCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      addPromotion: (data) => {
        const promo: Promotion = { ...data, id: newId("promo") };
        set({ promotions: [...get().promotions, promo] });
        return promo;
      },

      updatePromotion: (id, data) => {
        set({
          promotions: get().promotions.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        });
      },

      removePromotion: (id) => {
        set({ promotions: get().promotions.filter((p) => p.id !== id) });
      },

      resetCatalog: () => {
        set({
          products: seedProducts,
          categories: seedCategories,
          promotions: seedPromotions,
        });
      },
    }),
    {
      name: "golib-catalog",
      version: 5,
      migrate: (persisted, version) => {
        const state = persisted as CatalogState;
        if (!state?.categories) return state as CatalogState;
        const imgs: Record<string, string> = {
          sets: "/categories/category-sets.png",
          "t-shirts": "/categories/category-t-shirts.png",
          shirts: "/categories/category-shirts.png",
          pants: "/categories/category-pants.png",
          shoes: "/categories/category-shoes.png",
          accessories: "/categories/category-accessories.png",
        };
        if ((version ?? 0) < 2) {
          state.categories = state.categories.map((c) => ({
            ...c,
            image: imgs[c.slug] ?? c.image,
          }));
        }
        if ((version ?? 0) < 3) {
          state.products = seedProducts;
        }
        if ((version ?? 0) < 4) {
          state.products = withGuaranteedImages(seedProducts);
        }
        if ((version ?? 0) < 5) {
          const seen = new Set<string>();
          state.products = withGuaranteedImages(seedProducts).filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
        }
        return state;
      },
    }
  )
);

export function getCatalogProductBySlug(
  products: Product[],
  slug: string
): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCatalogSimilar(
  products: Product[],
  product: Product,
  limit = 4
): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
