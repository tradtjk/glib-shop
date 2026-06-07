export type Locale = "ru" | "tj";

export interface LocalizedString {
  ru: string;
  tj: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: LocalizedString;
  description: LocalizedString;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  images: string[];
  videoUrl?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  isNew?: boolean;
  isPopular?: boolean;
  viewsCount?: number;
  boughtToday?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  image: string;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: LocalizedString;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: LocalizedString;
  date: string;
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  createdAt: string;
  deliveryType: "pickup" | "delivery";
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
    comment?: string;
  };
}
