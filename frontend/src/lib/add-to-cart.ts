import type { Product } from "@/types";
import { t as localized } from "@/lib/localized";
import { useCartStore } from "@/stores/cart-store";
import type { CartModalItem } from "@/contexts/cart-modal-context";
import type { Locale } from "@/types";

export function buildCartPayload(
  product: Product,
  locale: Locale,
  quantity = 1,
  size?: string,
  color?: string
) {
  const s = size || product.sizes[0];
  const c = color || (product.colors[0]?.name ?? "");
  return {
    cartItem: {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      size: s,
      color: c,
      price: product.price,
    },
    modalItem: {
      name: localized(product.name, locale),
      image: product.images[0],
      price: product.price,
      quantity,
    } satisfies CartModalItem,
  };
}

export function addProductToCart(
  product: Product,
  locale: Locale,
  quantity = 1,
  size?: string,
  color?: string
): CartModalItem {
  const { cartItem, modalItem } = buildCartPayload(product, locale, quantity, size, color);
  useCartStore.getState().addItem(cartItem, quantity);
  return modalItem;
}
