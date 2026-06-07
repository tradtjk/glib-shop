import {
  LayoutGrid,
  Shirt,
  Layers,
  Footprints,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  sets: Layers,
  "t-shirts": Shirt,
  shirts: Shirt,
  pants: LayoutGrid,
  shoes: Footprints,
  accessories: ShoppingBag,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIconMap[slug] ?? ShoppingBag;
}

export const allCategoriesIcon = Sparkles;
