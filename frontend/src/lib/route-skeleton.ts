import type { MobileTabId } from "@/lib/mobile-tabs";

export function getRouteSkeletonType(
  pathname: string,
  locale: string
): "product" | "profile" | "generic" | "tab-home" | "tab-catalog" | "tab-cart" | "tab-account" {
  const base = `/${locale}`;
  if (pathname.includes("/product/")) return "product";
  if (pathname.startsWith(`${base}/account/`)) return "profile";
  if (pathname === base || pathname === `${base}/`) return "tab-home";
  if (pathname === `${base}/catalog`) return "tab-catalog";
  if (pathname === `${base}/cart`) return "tab-cart";
  if (pathname === `${base}/account`) return "tab-account";
  return "generic";
}

export function getTabSkeletonType(tab: MobileTabId) {
  return `tab-${tab}` as const;
}
