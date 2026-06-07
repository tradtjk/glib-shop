"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageWithShimmer } from "@/components/ui/ImageWithShimmer";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Share2, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { t as localized } from "@/lib/localized";
import { formatPrice, calcDiscount, cn } from "@/lib/utils";
import { useCartModal } from "@/contexts/cart-modal-context";
import { addProductToCart } from "@/lib/add-to-cart";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { shareProductLink } from "@/lib/share-product";
import type { Locale } from "@/types";

export function ProductDetail({
  product,
  similar,
}: {
  product: Product;
  similar: Product[];
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);
  const { showAfterAdd } = useCartModal();
  const hydrated = useHydrated();
  const { toggle, has } = useFavoritesStore();

  const discount = calcDiscount(product.price, product.oldPrice);
  const isFavorite = hydrated && has(product.id);

  const handleBuy = () => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0]?.name || "";
    const modalItem = addProductToCart(product, locale, quantity, size, color);
    showAfterAdd(modalItem);
  };

  const handleShare = async () => {
    const name = localized(product.name, locale);
    const url = `${window.location.origin}/${locale}/product/${product.slug}`;
    const text = `${name} — ${formatPrice(product.price)}`;

    const result = await shareProductLink({ title: name, text, url });

    if (result === "cancelled") return;

    if (result === "copied") {
      setShareHint(t("shareCopied"));
    } else if (result === "failed") {
      setShareHint(t("shareFailed"));
    } else {
      return;
    }

    window.setTimeout(() => setShareHint(null), 2200);
  };

  return (
    <div className="bg-[var(--color-bg)] pb-[calc(var(--tabbar-h)+4.5rem+env(safe-area-inset-bottom))] md:pb-12">
      <ProductJsonLd
        name={localized(product.name, locale)}
        description={localized(product.description, locale)}
        sku={product.sku}
        price={product.price}
        image={product.images[0]}
        inStock={product.stock > 0}
      />

      <div className="relative mx-auto w-full max-w-lg aspect-[3/4] max-h-[70vh] bg-neutral-100 overflow-hidden">
        <ImageWithShimmer
          src={product.images[Math.max(0, activeImage)]}
          fallbackSrc={product.images[1] ?? product.images[0]}
          alt={localized(product.name, locale)}
          fill
          className="object-contain object-center"
          containerClassName="absolute inset-0 flex items-center justify-center"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <button
          type="button"
          onClick={() => toggle(product.id)}
          className="icon-btn absolute top-3 right-3 bg-white/90 shadow-sm"
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-[var(--color-sale)]" : ""} />
        </button>
      </div>

      {product.images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto px-[var(--page-x)] py-2 scrollbar-hide justify-center">
          {product.images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative h-12 w-10 shrink-0 overflow-hidden rounded border bg-neutral-50",
                activeImage === i ? "border-[var(--color-text)]" : "border-[var(--color-border)] opacity-60"
              )}
            >
              <Image src={img} alt="" fill className="object-contain object-center" sizes="40px" />
            </button>
          ))}
        </div>
      )}

      <div className="page !pb-0 max-w-lg md:max-w-7xl md:mx-auto md:grid md:grid-cols-2 md:gap-10">
        <div className="md:col-start-2 space-y-4">
          <div>
            <p className="text-xs text-[var(--color-muted)]">{product.sku}</p>
            <h1 className="text-xl font-semibold leading-snug mt-0.5">
              {localized(product.name, locale)}
            </h1>
            <div className="mt-1.5 flex items-center gap-1 text-sm text-[var(--color-muted)]">
              <Star size={14} className="fill-current" />
              4.9 · {t("reviewsCount")}
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-xs text-[var(--color-muted)] line-through tabular-nums">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="badge-sale">−{discount}%</span>
              </>
            )}
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs text-[var(--color-sale)] font-medium">
              {t("lowStock", { count: product.stock })}
            </p>
          )}

          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            {localized(product.description, locale)}
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="input-label !mb-0">{t("size")}</span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-sm text-[var(--color-brand)] underline"
              >
                {t("sizeGuide")}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "chip min-w-[2.5rem]",
                    selectedSize === size && "chip-active"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {product.colors.length > 0 && (
            <div>
              <span className="text-xs font-medium block mb-2">{t("color")}</span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2",
                      selectedColor === c.name
                        ? "border-[var(--color-text)]"
                        : "border-[var(--color-border)]"
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="icon-btn">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-xs font-medium tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="icon-btn"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm text-[var(--color-muted)]">
              {product.stock > 0 ? t("inStock") : t("outOfStock")}
            </span>
          </div>

          <div className="hidden md:flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleBuy}
              disabled={product.stock === 0}
              className="btn btn-buy w-full !min-h-[3rem]"
            >
              <ShoppingBag size={18} />
              {t("buy")}
            </button>
            <Link
              href={`/${locale}/checkout`}
              onClick={() => {
                const size = selectedSize || product.sizes[0];
                const color = selectedColor || product.colors[0]?.name || "";
                addProductToCart(product, locale, quantity, size, color);
              }}
              className="btn btn-secondary w-full"
            >
              {t("buyNow")}
            </Link>
            <button type="button" onClick={() => toggle(product.id)} className="btn btn-ghost w-full text-xs">
              <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
              {t("addToFavorites")}
            </button>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="section px-[var(--page-x)] max-w-7xl mx-auto border-t border-[var(--color-border)] mt-6">
          <h2 className="section-title mb-3">{t("similar")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {shareHint && (
        <div
          className="md:hidden fixed left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--color-text)] px-4 py-2 text-xs font-medium text-white shadow-lg"
          style={{ bottom: "calc(var(--tabbar-h) + 4.25rem + env(safe-area-inset-bottom))" }}
          role="status"
        >
          {shareHint}
        </div>
      )}

      <div
        className="md:hidden fixed left-0 right-0 z-40 bg-[var(--color-surface)] border-t border-[var(--color-border)] px-[var(--page-x)] py-2.5 flex gap-2"
        style={{ bottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={handleShare}
          className="btn btn-secondary shrink-0 !w-12 !px-0"
          aria-label={t("share")}
        >
          <Share2 size={18} />
        </button>
        <button
          type="button"
          onClick={handleBuy}
          disabled={product.stock === 0}
          className="btn btn-buy flex-1 !min-h-[3rem]"
        >
          {t("buy")} · {formatPrice(product.price)}
        </button>
      </div>

      <SizeGuideModal
        open={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        onSelect={setSelectedSize}
      />
    </div>
  );
}
