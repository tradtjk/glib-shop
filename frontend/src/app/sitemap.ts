import type { MetadataRoute } from "next";
import { products } from "@/lib/mock-data";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://golibshop.tj";
const locales = ["ru", "tj"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/catalog", "/cart", "/checkout", "/account"];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${base}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1 : 0.8,
      });
    }
    for (const product of products) {
      entries.push({
        url: `${base}/${locale}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
