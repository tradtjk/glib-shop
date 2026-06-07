"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  LogOut,
  ExternalLink,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { useCatalogStore } from "@/stores/catalog-store";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Product } from "@/types";
import type { Promotion } from "@/lib/mock-data";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";
import {
  ProductFormModal,
  CategoryFormModal,
  PromotionFormModal,
} from "./admin-forms";
import { AdminOrdersPanel } from "./AdminOrdersPanel";

type Tab = "dashboard" | "products" | "categories" | "orders" | "promotions";

const CATEGORY_IMAGES: Record<string, string> = {
  sets: "/categories/category-sets.png",
  "t-shirts": "/categories/category-t-shirts.png",
  shirts: "/categories/category-shirts.png",
  pants: "/categories/category-pants.png",
  shoes: "/categories/category-shoes.png",
  accessories: "/categories/category-accessories.png",
};

function catImage(cat: Category) {
  if (cat.image?.startsWith("/categories/")) return cat.image;
  return CATEGORY_IMAGES[cat.slug] ?? cat.image;
}

export function AdminDashboard() {
  const logout = useAdminAuthStore((s) => s.logout);
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const promotions = useCatalogStore((s) => s.promotions);
  const removeProduct = useCatalogStore((s) => s.removeProduct);
  const removeCategory = useCatalogStore((s) => s.removeCategory);
  const removePromotion = useCatalogStore((s) => s.removePromotion);
  const resetCatalog = useCatalogStore((s) => s.resetCatalog);

  const [tab, setTab] = useState<Tab>("dashboard");
  const [editProduct, setEditProduct] = useState<Product | null | "new">(null);
  const [editCategory, setEditCategory] = useState<Category | null | "new">(null);
  const [editPromotion, setEditPromotion] = useState<Promotion | null | "new">(null);

  const revenue = products.reduce((s, p) => s + p.price * (p.boughtToday ?? 0), 0);
  const ordersMock = 24;
  const clientsMock = 156;

  const nav = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as const, label: "Товары", icon: Package },
    { id: "categories" as const, label: "Каталог", icon: Layers },
    { id: "orders" as const, label: "Заказы", icon: ShoppingCart },
    { id: "promotions" as const, label: "Акции", icon: Tag },
  ];

  const confirmDelete = (label: string) =>
    typeof window !== "undefined" && window.confirm(`Удалить «${label}»?`);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      <aside className="w-56 shrink-0 border-r border-white/10 p-4 flex flex-col">
        <p className="text-lg font-bold tracking-[0.2em] uppercase mb-8 px-2">Golib</p>
        <nav className="space-y-1 flex-1">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors",
                tab === id
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </nav>
        <Link
          href="/ru"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white mb-2 rounded-lg hover:bg-white/5"
        >
          <ExternalLink size={14} />
          Сайт
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-red-400 rounded-lg hover:bg-white/5"
        >
          <LogOut size={14} />
          Выйти
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {tab === "dashboard" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <button
                type="button"
                onClick={() => resetCatalog()}
                className="text-xs text-white/40 hover:text-white underline"
              >
                Сбросить каталог
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Выручка (оценка)", value: `${revenue.toLocaleString()} TJS` },
                { label: "Заказы", value: String(ordersMock) },
                { label: "Клиенты", value: String(clientsMock) },
                { label: "Товары", value: String(products.length) },
              ].map((card) => (
                <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
            <h2 className="text-sm uppercase tracking-widest text-white/40 mb-4">Популярные товары</h2>
            <div className="space-y-2 rounded-xl border border-white/10 overflow-hidden">
              {products
                .filter((p) => p.isPopular)
                .map((p) => (
                  <div key={p.id} className="flex justify-between py-3 px-4 border-b border-white/5 last:border-0 text-sm bg-white/[0.02]">
                    <span>{p.name.ru}</span>
                    <span className="text-[var(--color-brand)]">{p.price} TJS</span>
                  </div>
                ))}
            </div>
          </>
        )}

        {tab === "products" && (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Товары</h1>
              <button
                type="button"
                onClick={() => setEditProduct("new")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand)] text-sm font-medium hover:opacity-90 shrink-0"
              >
                <Plus size={16} />
                Добавить
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors"
                >
                  <div className="relative h-36 bg-white/5">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt="" fill className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-white/40 font-mono">{p.sku}</p>
                    <h3 className="font-medium mt-1 line-clamp-2">{p.name.ru}</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {categories.find((c) => c.slug === p.category)?.name.ru} · {p.price} TJS · {p.stock} шт
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setEditProduct(p)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 text-xs hover:bg-white/15"
                      >
                        <Pencil size={14} />
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(p.name.ru) && removeProduct(p.id)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10"
                        aria-label="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "categories" && (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Каталог · Категории</h1>
                <p className="text-sm text-white/50 mt-1">Иконки на главной и в каталоге</p>
              </div>
              <button
                type="button"
                onClick={() => setEditCategory("new")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand)] text-sm font-medium hover:opacity-90 shrink-0"
              >
                <Plus size={16} />
                Добавить
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <div
                    key={cat.id}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-[var(--color-brand)]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white/10">
                        <Image src={catImage(cat)} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditCategory(cat)}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(cat.name.ru) && removeCategory(cat.id)}
                          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-medium flex items-center gap-2">
                      <Icon size={14} className="text-[var(--color-brand)]" />
                      {cat.name.ru}
                    </h3>
                    <p className="text-xs text-white/40 mt-1 font-mono">{cat.slug}</p>
                    <p className="text-xs text-white/30 mt-2">
                      {products.filter((p) => p.category === cat.slug).length} товаров
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "orders" && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Заказы</h1>
            <p className="text-sm text-white/50 mb-6">
              Список обновляется каждые 15 секунд.
            </p>
            <AdminOrdersPanel />
          </>
        )}

        {tab === "promotions" && (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Акции</h1>
              <button
                type="button"
                onClick={() => setEditPromotion("new")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-brand)] text-sm font-medium hover:opacity-90 shrink-0"
              >
                <Plus size={16} />
                Добавить
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {promotions.map((promo) => (
                <div key={promo.id} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="relative h-28">
                    {promo.image && (
                      <Image src={promo.image} alt="" fill className="object-cover" unoptimized />
                    )}
                    {promo.accent && (
                      <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-[var(--color-brand)] px-2 py-0.5 rounded">
                        Главная
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand)]">{promo.code}</span>
                    <h3 className="mt-1 font-medium">{promo.title.ru}</h3>
                    <p className="text-sm text-white/50 mt-1 line-clamp-2">{promo.subtitle.ru}</p>
                    <p className="mt-2 text-xl font-bold">{promo.discount}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => setEditPromotion(promo)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/10 text-xs hover:bg-white/15"
                      >
                        <Pencil size={14} />
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(promo.code) && removePromotion(promo.id)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {editProduct && (
        <ProductFormModal
          product={editProduct === "new" ? undefined : editProduct}
          categories={categories}
          onClose={() => setEditProduct(null)}
        />
      )}
      {editCategory && (
        <CategoryFormModal
          category={editCategory === "new" ? undefined : editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {editPromotion && (
        <PromotionFormModal
          promotion={editPromotion === "new" ? undefined : editPromotion}
          onClose={() => setEditPromotion(null)}
        />
      )}
    </div>
  );
}
