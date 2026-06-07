import type { Category, Product, Review } from "@/types";

import { catalogProductSeeds } from "@/lib/mock-products-data";



export const categories: Category[] = [

  {

    id: "1",

    slug: "sets",

    name: { ru: "Комплекты", tj: "Комплектҳо" },

    image: "/categories/category-sets.png",

    sortOrder: 1,

  },

  {

    id: "2",

    slug: "t-shirts",

    name: { ru: "Футболки", tj: "Футболкаҳо" },

    image: "/categories/category-t-shirts.png",

    sortOrder: 2,

  },

  {

    id: "3",

    slug: "shirts",

    name: { ru: "Рубашки", tj: "Куртаҳо" },

    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",

    sortOrder: 3,

  },

  {

    id: "4",

    slug: "pants",

    name: { ru: "Брюки", tj: "Шимҳо" },

    image: "/categories/category-pants.png",

    sortOrder: 4,

  },

  {

    id: "5",

    slug: "shoes",

    name: { ru: "Обувь", tj: "Пойафзол" },

    image: "/categories/category-shoes.png",

    sortOrder: 5,

  },

  {

    id: "6",

    slug: "accessories",

    name: { ru: "Аксессуары", tj: "Лавозимот" },

    image: "/categories/category-accessories.png",

    sortOrder: 6,

  },

];



export const products: Product[] = catalogProductSeeds;



export const reviews: Review[] = [

  {

    id: "1",

    author: "Алишер М.",

    rating: 5,

    text: {

      ru: "Отличное качество и быстрая доставка. Костюм сидит идеально!",

      tj: "Сифати аъло ва расонидани зуд. Костюм комил ҷойгир шуд!",

    },

    date: "2026-05-12",

  },

  {

    id: "2",

    author: "Дилафруз К.",

    rating: 5,

    text: {

      ru: "Премиальный сервис и стильный ассортимент. Рекомендую!",

      tj: "Хизматрасонии премиум ва асортименти зебо!",

    },

    date: "2026-05-08",

  },

  {

    id: "3",

    author: "Фаррух С.",

    rating: 4,

    text: {

      ru: "Качество на высоте. Буду заказывать ещё.",

      tj: "Сифат дар сатҳи баланд. Боз фармоиш медиҳам.",

    },

    date: "2026-04-28",

  },

  {

    id: "4",

    author: "Сорбон К.",

    rating: 5,

    text: {

      ru: "Кроссовки Urban Runner — лучшая покупка этого сезона.",

      tj: "Кроссовкаҳои Urban Runner — беhtarin харid.",

    },

    date: "2026-05-20",

  },

  {

    id: "5",

    author: "Джамшед Р.",

    rating: 5,

    text: {

      ru: "Oxford рубашки от Golib — идеальная посадка и ткань.",

      tj: "Куртаҳои Oxford аз Golib — бури ва матои комил.",

    },

    date: "2026-05-18",

  },

];



export function getProductBySlug(slug: string): Product | undefined {

  return products.find((p) => p.slug === slug);

}



export function getNewProducts(): Product[] {

  return products.filter((p) => p.isNew);

}



export function getPopularProducts(): Product[] {

  return products.filter((p) => p.isPopular);

}



export function getSimilarProducts(product: Product, limit = 4): Product[] {

  return products

    .filter((p) => p.category === product.category && p.id !== product.id)

    .slice(0, limit);

}



export interface Promotion {

  id: string;

  title: { ru: string; tj: string };

  subtitle: { ru: string; tj: string };

  code: string;

  discount: string;

  image: string;

  href: string;

  accent?: boolean;

}



export interface Look {

  id: string;

  slug: string;

  emoji: string;

  name: { ru: string; tj: string };

  tagline: { ru: string; tj: string };

  image: string;

  productIds: string[];

  bundlePrice: number;

  oldBundlePrice: number;

}



export const looks: Look[] = [

  {

    id: "1",

    slug: "business",

    emoji: "🔥",

    name: { ru: "Бизнес стиль", tj: "Усули тиҷорӣ" },

    tagline: { ru: "Костюм + рубашка + галстук", tj: "Костюм + курта + галстук" },

    image:

      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=85",

    productIds: ["1", "21", "54"],

    bundlePrice: 3970,

    oldBundlePrice: 4770,

  },

  {

    id: "2",

    slug: "casual",

    emoji: "🔥",

    name: { ru: "Повседневный", tj: "Рӯзмарра" },

    tagline: { ru: "Футболка + chino + кеды", tj: "Футболка + chino + кед" },

    image:

      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85",

    productIds: ["11", "32", "44"],

    bundlePrice: 2470,

    oldBundlePrice: 2870,

  },

  {

    id: "3",

    slug: "youth",

    emoji: "🔥",

    name: { ru: "Молодёжный", tj: "Ҷавонон" },

    tagline: { ru: "Oversized + high-top", tj: "Oversized + high-top" },

    image:

      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=85",

    productIds: ["12", "47"],

    bundlePrice: 1780,

    oldBundlePrice: 2080,

  },

  {

    id: "4",

    slug: "sport",

    emoji: "🔥",

    name: { ru: "Спортивный", tj: "Вarzишӣ" },

    tagline: { ru: "Dry-fit + running pro", tj: "Dry-fit + running pro" },

    image:

      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85",

    productIds: ["49", "19"],

    bundlePrice: 2140,

    oldBundlePrice: 2480,

  },

  {

    id: "5",

    slug: "evening",

    emoji: "✨",

    name: { ru: "Вечерний", tj: "Шabona" },

    tagline: { ru: "Бархат + атлас + монки", tj: "Barxat + atlas + monki" },

    image:

      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&q=85",

    productIds: ["8", "30", "48"],

    bundlePrice: 5670,

    oldBundlePrice: 6570,

  },

];



export interface CustomerVideo {

  id: string;

  username: string;

  video: string;

  poster: string;

  productSlug: string;

  likes: string;

}



export const customerVideos: CustomerVideo[] = [

  {

    id: "1",

    username: "@alisher_golib",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-walking-on-a-city-street-424-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",

    productSlug: "sets-premium-black",

    likes: "12.4K",

  },

  {

    id: "2",

    username: "@dila_style",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-young-woman-walking-through-the-city-424-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",

    productSlug: "t-shirts-essential-white",

    likes: "8.1K",

  },

  {

    id: "3",

    username: "@farrukh_fit",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-344-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",

    productSlug: "shoes-urban-runner",

    likes: "15.2K",

  },

  {

    id: "4",

    username: "@golib_official",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-a-studio-34496-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",

    productSlug: "pants-tailored-fit",

    likes: "9.7K",

  },

  {

    id: "5",

    username: "@jamsh_ed",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-man-in-a-suit-walking-on-a-city-street-424-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",

    productSlug: "shoes-chelsea-boot-black",

    likes: "11.3K",

  },

  {

    id: "6",

    username: "@style_dush",

    video:

      "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-walking-in-a-studio-344-large.mp4",

    poster:

      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",

    productSlug: "shirts-oxford-classic",

    likes: "6.8K",

  },

];



export const promotions: Promotion[] = [

  {

    id: "1",

    title: { ru: "−30% на костюмы", tj: "−30% барои кostюmҳо" },

    subtitle: { ru: "Промокод SUIT30", tj: "Промokod SUIT30" },

    code: "SUIT30",

    discount: "30%",

    image:

      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",

    href: "/catalog?category=sets",

    accent: true,

  },

  {

    id: "2",

    title: { ru: "2+1 на футболки", tj: "2+1 барои футболkaҳо" },

    subtitle: { ru: "Третья в подарок", tj: "Сebуми tӯҳfa" },

    code: "TEE21",

    discount: "2+1",

    image:

      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",

    href: "/catalog?category=t-shirts",

  },

  {

    id: "3",

    title: { ru: "Бесплатная доставка", tj: "Рasonидani ройгон" },

    subtitle: { ru: "От 1500 TJS", tj: "Аз 1500 TJS" },

    code: "FREESHIP",

    discount: "FREE",

    image:

      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",

    href: "/catalog",

  },

  {

    id: "4",

    title: { ru: "−20% на обувь", tj: "−20% барои пойafзол" },

    subtitle: { ru: "Промокод SHOE20", tj: "Промokod SHOE20" },

    code: "SHOE20",

    discount: "20%",

    image:

      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",

    href: "/catalog?category=shoes",

  },

];

