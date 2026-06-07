import { categories, products } from "@/lib/mock-data";
import { t as localized } from "@/lib/localized";
import type { Locale, Product } from "@/types";

const TYPO_FIXES: [RegExp, string][] = [
  [/ью/g, "ю"],
  [/ъ/g, ""],
  [/йо/g, "е"],
];

const SYNONYMS: Record<string, string[]> = {
  костюм: ["костюм", "комплект", "suit", "premium"],
  футболка: ["футболка", "футболки", "tshirt", "tee", "essential"],
  рубашка: ["рубашка", "рубашки", "oxford", "shirt"],
  брюки: ["брюки", "шим", "pants", "tailored"],
  обувь: ["обувь", "кроссовки", "shoes", "runner", "sneaker"],
  сумка: ["сумка", "аксессуар", "bag", "leather"],
};

function normalize(text: string): string {
  let s = text.toLowerCase().trim();
  for (const [pattern, replacement] of TYPO_FIXES) {
    s = s.replace(pattern, replacement);
  }
  return s.replace(/\s+/g, " ");
}

function tokens(query: string): string[] {
  const n = normalize(query);
  if (!n) return [];
  const base = n.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>(base);
  for (const token of base) {
    for (const [, words] of Object.entries(SYNONYMS)) {
      if (words.some((w) => w.includes(token) || token.includes(w))) {
        words.forEach((w) => expanded.add(w));
      }
    }
  }
  return [...expanded];
}

function scoreProduct(product: Product, locale: Locale, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;

  const haystack = normalize(
    [
      product.name.ru,
      product.name.tj,
      product.description.ru,
      product.sku,
      product.brand,
      product.category,
      categories.find((c) => c.slug === product.category)?.name.ru ?? "",
    ].join(" ")
  );

  let score = 0;
  for (const token of queryTokens) {
    if (haystack.includes(token)) score += 10;
    if (localized(product.name, locale).toLowerCase().includes(token)) score += 15;
    if (product.sku.toLowerCase().includes(token)) score += 8;
  }

  const fullQuery = queryTokens.join(" ");
  if (normalize(localized(product.name, locale)).includes(fullQuery)) score += 25;

  return score;
}

export interface SearchSuggestion {
  type: "product" | "category";
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  image?: string;
  price?: number;
}

export function searchProducts(
  query: string,
  locale: Locale,
  limit = 8
): Product[] {
  const queryTokens = tokens(query);
  if (queryTokens.length === 0) return [];

  return products
    .map((p) => ({ product: p, score: scoreProduct(p, locale, queryTokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.product);
}

export function getSearchSuggestions(
  query: string,
  locale: Locale,
  limit = 8
): SearchSuggestion[] {
  const q = normalize(query);
  if (!q) return [];

  const suggestions: SearchSuggestion[] = [];

  for (const cat of categories) {
    const name = normalize(localized(cat.name, locale));
    if (name.includes(q) || q.includes(name.slice(0, 3))) {
      suggestions.push({
        type: "category",
        id: cat.slug,
        label: localized(cat.name, locale),
        sublabel: "Категория",
        href: `/${locale}/catalog?category=${cat.slug}`,
        image: cat.image,
      });
    }
  }

  for (const product of searchProducts(query, locale, limit)) {
    suggestions.push({
      type: "product",
      id: product.id,
      label: localized(product.name, locale),
      sublabel: product.sku,
      href: `/${locale}/product/${product.slug}`,
      image: product.images[0],
      price: product.price,
    });
  }

  return suggestions.slice(0, limit);
}

export function filterProductsByQuery(
  list: Product[],
  query: string,
  locale: Locale
): Product[] {
  const q = normalize(query);
  if (!q) return list;

  const matched = searchProducts(query, locale, list.length);
  const ids = new Set(matched.map((p) => p.id));
  const fromSearch = list.filter((p) => ids.has(p.id));

  if (fromSearch.length > 0) return fromSearch;

  const queryTokens = tokens(query);
  return list.filter((p) => scoreProduct(p, locale, queryTokens) > 0);
}
