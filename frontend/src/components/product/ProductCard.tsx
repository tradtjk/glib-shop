"use client";

import { ImageWithShimmer } from "@/components/ui/ImageWithShimmer";
import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { t as localized } from "@/lib/localized";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useCartModal } from "@/contexts/cart-modal-context";
import { addProductToCart } from "@/lib/add-to-cart";
import type { Locale } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const hydrated = useHydrated();
  const { toggle, has } = useFavoritesStore();
  const { showAfterAdd } = useCartModal();
  const discount = calcDiscount(product.price, product.oldPrice);
  const isFavorite = hydrated && has(product.id);

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const modalItem = addProductToCart(product, locale, 1);
    showAfterAdd(modalItem);
  };

  return (
    <article className="flex min-w-0 w-full flex-col">
      <div className="product-card-media relative aspect-[3/4]">
        <InstantLink
          href={`/${locale}/product/${product.slug}`}
          className="block absolute inset-0"
        >
          <ImageWithShimmer
            src={product.images[0]}
            fallbackSrc={product.images[1]}
            alt={localized(product.name, locale)}
            fill
            className="object-cover"
            containerClassName="absolute inset-0"
            sizes="(max-width: 640px) 45vw, 22vw"
            priority={priority}
          />
        </InstantLink>

        {discount > 0 && (
          <span className="badge-sale absolute top-2 left-2 z-10">
            −{discount}%
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="icon-btn absolute top-2.5 right-2.5 z-10 bg-white/95 shadow-md backdrop-blur-sm"
          aria-label={t("addToFavorites")}
        >
          <Heart
            size={18}
            strokeWidth={1.75}
            fill={isFavorite ? "currentColor" : "none"}
            className={isFavorite ? "text-[var(--color-sale)]" : "text-[var(--color-text)]"}
          />
        </button>
      </div>

      <div className="pt-1.5 px-0.5">
        <InstantLink
          href={`/${locale}/product/${product.slug}`}
          className="text-sm text-[var(--color-text)] line-clamp-2 leading-snug hover:opacity-80"
        >
          {localized(product.name, locale)}
        </InstantLink>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-semibold tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-[var(--color-muted)] line-through tabular-nums">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button type="button" onClick={handleBuy} className="btn btn-buy">
          {t("buy")}
        </button>
      </div>
    </article>
  );
}
