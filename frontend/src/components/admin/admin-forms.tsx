"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category, Product } from "@/types";
import type { Promotion } from "@/lib/mock-data";
import { useCatalogStore } from "@/stores/catalog-store";
import { AdminModal } from "./AdminModal";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-white/40 mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--color-brand)]";

function parseColors(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, hex] = line.split(":").map((s) => s.trim());
      return { name: name || "Color", hex: hex || "#111111" };
    });
}

function colorsToText(colors: { name: string; hex: string }[]) {
  return colors.map((c) => `${c.name}:${c.hex}`).join("\n");
}

export function ProductFormModal({
  product,
  categories,
  onClose,
}: {
  product?: Product;
  categories: Category[];
  onClose: () => void;
}) {
  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const isEdit = !!product;

  const [form, setForm] = useState({
    nameRu: product?.name.ru ?? "",
    nameTj: product?.name.tj ?? "",
    descRu: product?.description.ru ?? "",
    descTj: product?.description.tj ?? "",
    category: product?.category ?? categories[0]?.slug ?? "",
    brand: product?.brand ?? "Golib",
    price: product?.price ?? 0,
    oldPrice: product?.oldPrice ?? "",
    images: product?.images.join("\n") ?? "",
    sizes: product?.sizes.join(", ") ?? "S, M, L, XL",
    colors: colorsToText(product?.colors ?? [{ name: "Black", hex: "#111111" }]),
    stock: product?.stock ?? 10,
    isNew: product?.isNew ?? false,
    isPopular: product?.isPopular ?? false,
    videoUrl: product?.videoUrl ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: { ru: form.nameRu, tj: form.nameTj || form.nameRu },
      description: { ru: form.descRu, tj: form.descTj || form.descRu },
      category: form.category,
      brand: form.brand,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: parseColors(form.colors),
      stock: Number(form.stock),
      isNew: form.isNew,
      isPopular: form.isPopular,
      videoUrl: form.videoUrl || undefined,
    };

    if (isEdit && product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    onClose();
  };

  const preview = form.images.split("\n")[0]?.trim();

  return (
    <AdminModal title={isEdit ? "Редактировать товар" : "Новый товар"} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {preview && (
          <div className="relative h-40 rounded-xl overflow-hidden bg-white/5">
            <Image src={preview} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Название (RU)">
            <input required className={inputCls} value={form.nameRu} onChange={(e) => setForm((f) => ({ ...f, nameRu: e.target.value }))} />
          </Field>
          <Field label="Название (TJ)">
            <input className={inputCls} value={form.nameTj} onChange={(e) => setForm((f) => ({ ...f, nameTj: e.target.value }))} />
          </Field>
        </div>
        <Field label="Описание (RU)">
          <textarea rows={3} className={inputCls} value={form.descRu} onChange={(e) => setForm((f) => ({ ...f, descRu: e.target.value }))} />
        </Field>
        <Field label="Описание (TJ)">
          <textarea rows={2} className={inputCls} value={form.descTj} onChange={(e) => setForm((f) => ({ ...f, descTj: e.target.value }))} />
        </Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Категория">
            <select className={inputCls} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name.ru}</option>
              ))}
            </select>
          </Field>
          <Field label="Цена (TJS)">
            <input type="number" required min={0} className={inputCls} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          </Field>
          <Field label="Старая цена">
            <input type="number" min={0} className={inputCls} value={form.oldPrice} onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Бренд">
            <input className={inputCls} value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
          </Field>
          <Field label="Остаток">
            <input type="number" min={0} className={inputCls} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} />
          </Field>
        </div>
        <Field label="Изображения (URL, по одному на строку)">
          <textarea rows={3} className={inputCls} value={form.images} onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))} placeholder="https://..." />
        </Field>
        <Field label="Размеры (через запятую)">
          <input className={inputCls} value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} />
        </Field>
        <Field label="Цвета (название:#hex, по строке)">
          <textarea rows={3} className={inputCls} value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} placeholder="Black:#111111" />
        </Field>
        <Field label="Видео URL (опционально)">
          <input className={inputCls} value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))} />
        </Field>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} className="accent-[var(--color-brand)]" />
            Новинка
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))} className="accent-[var(--color-brand)]" />
            Популярный
          </label>
        </div>
        <button type="submit" className="w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold hover:opacity-90">
          {isEdit ? "Сохранить" : "Добавить товар"}
        </button>
      </form>
    </AdminModal>
  );
}

export function CategoryFormModal({
  category,
  onClose,
}: {
  category?: Category;
  onClose: () => void;
}) {
  const addCategory = useCatalogStore((s) => s.addCategory);
  const updateCategory = useCatalogStore((s) => s.updateCategory);
  const isEdit = !!category;

  const [form, setForm] = useState({
    nameRu: category?.name.ru ?? "",
    nameTj: category?.name.tj ?? "",
    slug: category?.slug ?? "",
    image: category?.image ?? "/categories/category-sets.png",
    sortOrder: category?.sortOrder ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: { ru: form.nameRu, tj: form.nameTj || form.nameRu },
      slug: form.slug || undefined,
      image: form.image,
      sortOrder: Number(form.sortOrder),
    };
    if (isEdit && category) {
      updateCategory(category.id, data);
    } else {
      addCategory(data);
    }
    onClose();
  };

  return (
    <AdminModal title={isEdit ? "Редактировать категорию" : "Новая категория"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.image && (
          <div className="relative h-28 w-28 mx-auto rounded-2xl overflow-hidden ring-2 ring-white/10">
            <Image src={form.image} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <Field label="Название (RU)">
          <input required className={inputCls} value={form.nameRu} onChange={(e) => setForm((f) => ({ ...f, nameRu: e.target.value }))} />
        </Field>
        <Field label="Название (TJ)">
          <input className={inputCls} value={form.nameTj} onChange={(e) => setForm((f) => ({ ...f, nameTj: e.target.value }))} />
        </Field>
        <Field label="Slug (латиница)">
          <input className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="t-shirts" />
        </Field>
        <Field label="Изображение (URL или /categories/...)">
          <input required className={inputCls} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
        </Field>
        <Field label="Порядок сортировки">
          <input type="number" min={1} className={inputCls} value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
        </Field>
        <button type="submit" className="w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold hover:opacity-90">
          {isEdit ? "Сохранить" : "Создать"}
        </button>
      </form>
    </AdminModal>
  );
}

export function PromotionFormModal({
  promotion,
  onClose,
}: {
  promotion?: Promotion;
  onClose: () => void;
}) {
  const addPromotion = useCatalogStore((s) => s.addPromotion);
  const updatePromotion = useCatalogStore((s) => s.updatePromotion);
  const isEdit = !!promotion;

  const [form, setForm] = useState({
    titleRu: promotion?.title.ru ?? "",
    titleTj: promotion?.title.tj ?? "",
    subtitleRu: promotion?.subtitle.ru ?? "",
    subtitleTj: promotion?.subtitle.tj ?? "",
    code: promotion?.code ?? "",
    discount: promotion?.discount ?? "",
    image: promotion?.image ?? "",
    href: promotion?.href ?? "/catalog",
    accent: promotion?.accent ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: { ru: form.titleRu, tj: form.titleTj || form.titleRu },
      subtitle: { ru: form.subtitleRu, tj: form.subtitleTj || form.subtitleRu },
      code: form.code,
      discount: form.discount,
      image: form.image,
      href: form.href,
      accent: form.accent,
    };
    if (isEdit && promotion) {
      updatePromotion(promotion.id, data);
    } else {
      addPromotion(data);
    }
    onClose();
  };

  return (
    <AdminModal title={isEdit ? "Редактировать акцию" : "Новая акция"} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.image && (
          <div className="relative h-32 rounded-xl overflow-hidden bg-white/5">
            <Image src={form.image} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Заголовок (RU)">
            <input required className={inputCls} value={form.titleRu} onChange={(e) => setForm((f) => ({ ...f, titleRu: e.target.value }))} />
          </Field>
          <Field label="Заголовок (TJ)">
            <input className={inputCls} value={form.titleTj} onChange={(e) => setForm((f) => ({ ...f, titleTj: e.target.value }))} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Подзаголовок (RU)">
            <input className={inputCls} value={form.subtitleRu} onChange={(e) => setForm((f) => ({ ...f, subtitleRu: e.target.value }))} />
          </Field>
          <Field label="Подзаголовок (TJ)">
            <input className={inputCls} value={form.subtitleTj} onChange={(e) => setForm((f) => ({ ...f, subtitleTj: e.target.value }))} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Промокод">
            <input required className={inputCls} value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} />
          </Field>
          <Field label="Скидка / текст">
            <input required className={inputCls} value={form.discount} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))} placeholder="30% или 2+1" />
          </Field>
          <Field label="Ссылка">
            <input className={inputCls} value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} />
          </Field>
        </div>
        <Field label="Изображение (URL)">
          <input required className={inputCls} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
        </Field>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.accent} onChange={(e) => setForm((f) => ({ ...f, accent: e.target.checked }))} className="accent-[var(--color-brand)]" />
          Главная акция (большая карточка)
        </label>
        <button type="submit" className="w-full rounded-lg bg-[var(--color-brand)] py-3 text-sm font-semibold hover:opacity-90">
          {isEdit ? "Сохранить" : "Создать акцию"}
        </button>
      </form>
    </AdminModal>
  );
}
