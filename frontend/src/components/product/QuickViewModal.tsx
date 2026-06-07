"use client";

import { ImageWithShimmer } from "@/components/ui/ImageWithShimmer";
import { InstantLink } from "@/components/navigation/InstantLink";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { t as localized } from "@/lib/localized";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { Locale } from "@/types";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const addToCart = useCartStore((s) => s.addItem);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/70 p-0 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto md:rounded-none"
          >
            <div className="relative aspect-[3/4] bg-black">
              <ImageWithShimmer
                src={product.images[0]}
                fallbackSrc={product.images[1]}
                alt=""
                fill
                className="object-cover"
                containerClassName="absolute inset-0"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                {localized(product.name, locale)}
              </h3>
              <p className="mt-2 text-xl font-bold">
                {formatPrice(product.price)}
                {product.oldPrice && (
                  <span className="ml-2 text-sm text-black/40 line-through font-normal">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(
                      {
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.images[0],
                        size: product.sizes[0],
                        color: product.colors[0]?.name ?? "",
                        price: product.price,
                      },
                      1
                    );
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em]"
                >
                  <ShoppingBag size={16} />
                  {t("addToCart")}
                </button>
                <InstantLink
                  href={`/${locale}/product/${product.slug}`}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center border border-black py-4 text-[10px] uppercase tracking-[0.2em]"
                >
                  Подробнее
                </InstantLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
