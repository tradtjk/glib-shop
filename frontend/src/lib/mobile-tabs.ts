export type MobileTabId = "home" | "catalog" | "cart" | "account";

export const MOBILE_TABS: MobileTabId[] = ["home", "catalog", "cart", "account"];

export function tabPath(locale: string, tab: MobileTabId): string {
  if (tab === "home") return `/${locale}`;
  return `/${locale}/${tab}`;
}

export function pathnameToTab(pathname: string, locale: string): MobileTabId | null {
  const base = `/${locale}`;
  if (pathname === base || pathname === `${base}/`) return "home";
  if (pathname === `${base}/catalog`) return "catalog";
  if (pathname === `${base}/cart`) return "cart";
  if (
    pathname === `${base}/account` ||
    pathname.startsWith(`${base}/account/`)
  ) {
    return "account";
  }
  return null;
}

export function isMainTabPath(pathname: string, locale: string): boolean {
  return pathnameToTab(pathname, locale) !== null;
}
