export function parseProductSlug(pathname: string, locale: string): string | null {
  const prefix = `/${locale}/product/`;
  if (!pathname.startsWith(prefix)) return null;
  const slug = pathname.slice(prefix.length).split("/")[0];
  return slug || null;
}

export function isProductPath(pathname: string, locale: string): boolean {
  return parseProductSlug(pathname, locale) !== null;
}
