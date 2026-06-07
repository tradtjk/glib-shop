import type { Product } from "@/types";

/** Verified Unsplash photo IDs — all return HTTP 200 */
const POOLS: Record<string, string[]> = {
  sets: [
    "photo-1594938298603-c8148c4dae35",
    "photo-1618886614638-80e3c103d31a",
    "photo-1617137968427-85924c800a22",
    "photo-1617137984095-74e4e5e3613f",
    "photo-1617127365659-c47fa864d8bc",
    "photo-1622497170185-5d668f816a56",
    "photo-1631052066165-9720608b36da",
    "photo-1623880840102-7df0a9f3545b",
    "photo-1519085360753-af0119f7cbe7",
    "photo-1546572797-e8c933a75a1f",
  ],
  "t-shirts": [
    "photo-1521572163474-6864f9cf17ab",
    "photo-1576566588028-4147f3842f27",
    "photo-1586363104862-3a5e2ab60d99",
    "photo-1503341504253-dff4815485f1",
    "photo-1620012253295-c15cc3e65df4",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1434389677669-e08b4cac3105",
    "photo-1618354691373-d851c5c3a990",
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1591047139829-d91aecb6caea",
  ],
  shirts: [
    "photo-1596755094514-f87e34085b2c",
    "photo-1602810318383-e386cc2a3ccf",
    "photo-1564257631407-4deb1f99d992",
    "photo-1622450180332-3da1126f10a4",
    "photo-1603394151492-5e9b974b090b",
    "photo-1620064881980-1023851173f3",
    "photo-1580411363668-4b59002b6962",
    "photo-1594938328870-9623159c8c99",
    "photo-1619533394727-57d522857f89",
    "photo-1649641988638-e683265dd9ca",
  ],
  pants: [
    "photo-1473966968600-fa801b869a1a",
    "photo-1506629082955-511b1aa562c8",
    "photo-1542272604-787c3835535d",
    "photo-1541099649105-f69ad21f3246",
    "photo-1630173250799-2813d34ed14b",
    "photo-1522968439036-e6338d0ed84f",
    "photo-1613181013804-1dcba09e6a9d",
    "photo-1560250097-0b93528c311a",
    "photo-1490367532201-b9bc1dc483f6",
    "photo-1548454782-15b189d129ab",
  ],
  shoes: [
    "photo-1549298916-b41d501d3772",
    "photo-1606107557195-0e29a4b5b4aa",
    "photo-1608256246200-53e635b5b65f",
    "photo-1608231387042-66d1773070a5",
    "photo-1542291026-7eec264c27ff",
    "photo-1601925260368-ae2f83cf8b7f",
    "photo-1543163521-1bf539c55dd2",
    "photo-1549298916-b41d501d3772",
    "photo-1606107557195-0e29a4b5b4aa",
    "photo-1608256246200-53e635b5b65f",
  ],
  accessories: [
    "photo-1553062407-98eeb64c6a62",
    "photo-1548036328-c9fa89d128fa",
    "photo-1524592094714-0f0654e20314",
    "photo-1511499767150-a48a237f0083",
    "photo-1590874103328-eac38a683ce7",
    "photo-1642886513531-5a1cf3ba164a",
    "photo-1623880840102-7df0a9f3545b",
    "photo-1580411363668-4b59002b6962",
    "photo-1553062407-98eeb64c6a62",
    "photo-1548036328-c9fa89d128fa",
  ],
};

const DEFAULT_PHOTO = "photo-1594938298603-c8148c4dae35";

export function unsplashProductUrl(
  photoId: string,
  variant: 0 | 1 = 0
): string {
  const params = new URLSearchParams({
    w: "800",
    h: "1067",
    auto: "format",
    fit: "crop",
    q: "80",
  });
  if (variant === 1) {
    params.set("crop", "entropy");
  }
  return `https://images.unsplash.com/${photoId}?${params.toString()}`;
}

export function getProductImages(
  category: string,
  indexInCategory: number
): string[] {
  const pool = POOLS[category] ?? POOLS.sets;
  const photoId = pool[indexInCategory % pool.length] ?? DEFAULT_PHOTO;

  return [unsplashProductUrl(photoId, 0), unsplashProductUrl(photoId, 1)];
}

export function withGuaranteedImages(products: Product[]): Product[] {
  const categoryCounters: Record<string, number> = {};

  return products.map((product) => {
    const idx = categoryCounters[product.category] ?? 0;
    categoryCounters[product.category] = idx + 1;
    return {
      ...product,
      images: getProductImages(product.category, idx),
    };
  });
}
