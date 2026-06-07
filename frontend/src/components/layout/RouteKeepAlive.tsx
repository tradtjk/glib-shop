"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useInstantNav } from "@/contexts/instant-nav-context";
import { useCatalogProducts } from "@/hooks/use-catalog";
import { getCatalogProductBySlug, getCatalogSimilar } from "@/stores/catalog-store";
import { ProductDetail } from "@/components/product/ProductDetail";
import { RouteSkeleton } from "@/components/skeletons/RouteSkeleton";
import { isProductPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

const MAX_CACHE = 20;

function ProductFastView({ path, locale }: { path: string; locale: string }) {
  const products = useCatalogProducts();
  const slug = path.replace(`/${locale}/product/`, "").split("/")[0];
  const product = getCatalogProductBySlug(products, slug);
  if (!product) return <RouteSkeleton pathname={path} locale={locale} />;
  return (
    <ProductDetail product={product} similar={getCatalogSimilar(products, product)} />
  );
}

export function RouteKeepAlive({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const instant = useInstantNav();
  const displayPath = instant?.displayPath ?? pathname;
  const [cache, setCache] = useState<Record<string, React.ReactNode>>({});
  const [pending, setPending] = useState(false);
  const orderRef = useRef<string[]>([]);

  const cached = cache[displayPath] !== undefined;
  const productFast =
    !cached && isProductPath(displayPath, locale);

  useEffect(() => {
    setPending(!cached && !productFast);
  }, [displayPath, cached, productFast]);

  useLayoutEffect(() => {
    setCache((prev) => {
      if (prev[pathname] === children) return prev;

      const next = { ...prev, [pathname]: children };
      const order = orderRef.current.filter((p) => p !== pathname);
      order.push(pathname);
      orderRef.current = order;

      while (order.length > MAX_CACHE) {
        const drop = order.shift();
        if (drop && drop !== pathname) delete next[drop];
      }

      return next;
    });
    setPending(false);
  }, [pathname, children]);

  if (cached) {
    return (
      <div className="route-keep-alive flex flex-1 flex-col min-h-0">
        {Object.entries(cache).map(([path, node]) => (
          <div
            key={path}
            className={cn(
              "route-cache-panel mobile-tab-panel",
              displayPath === path ? "flex flex-col" : "hidden"
            )}
            aria-hidden={displayPath !== path}
          >
            {node}
          </div>
        ))}
        <div className="hidden" aria-hidden>
          {children}
        </div>
      </div>
    );
  }

  if (productFast) {
    return (
      <div className="route-keep-alive flex flex-1 flex-col min-h-0">
        <div className="route-cache-panel mobile-tab-panel flex flex-col flex-1">
          <ProductFastView path={displayPath} locale={locale} />
        </div>
        <div className="hidden" aria-hidden>
          {children}
        </div>
      </div>
    );
  }

  if (pending) {
    return (
      <div className="route-keep-alive flex flex-1 flex-col min-h-0">
        <div className="route-cache-panel mobile-tab-panel flex flex-col flex-1 overflow-y-auto bg-[var(--color-bg)]">
          <RouteSkeleton pathname={displayPath} locale={locale} />
        </div>
        <div className="hidden" aria-hidden>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="route-keep-alive flex flex-1 flex-col min-h-0">
      <div className="route-cache-panel mobile-tab-panel flex flex-col flex-1">
        {children}
      </div>
    </div>
  );
}
