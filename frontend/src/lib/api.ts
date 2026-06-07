import type { CartItem, OrderStatus } from "@/types";
import type { StoredOrder } from "@/stores/orders-store";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }
  return "http://localhost:3000/api";
}

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...init } = options || {};
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    let message = `API ${res.status}: ${path}`;
    try {
      const err = (await res.json()) as { message?: string };
      if (err.message) message = err.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export interface ApiUser {
  id: string;
  name: string;
  phone: string;
}

export interface ApiOrderItem {
  product_name: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  price?: number;
}

export interface ApiOrder {
  id: string | number;
  number: string;
  status: string;
  total: number;
  created_at: string;
  customer_name: string;
  delivery_type?: string;
  items?: ApiOrderItem[];
}

export const api = {
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? `?${new URLSearchParams(params)}` : "";
      return request<{ data: unknown[] }>(`/products${q}`);
    },
    get: (slug: string) => request<{ data: unknown }>(`/products/${slug}`),
    new: () => request<{ data: unknown[] }>("/products/new"),
    popular: () => request<{ data: unknown[] }>("/products/popular"),
  },
  orders: {
    create: (body: unknown, token?: string | null) =>
      request<{ data: { number: string; id: string | number; total: number } }>(
        "/orders",
        {
          method: "POST",
          body: JSON.stringify(body),
          token: token ?? undefined,
        }
      ),
    list: (token: string) => request<{ data: ApiOrder[] }>("/orders", { token }),
    listAll: () => request<{ data: ApiOrder[] }>("/admin/orders"),
  },
  auth: {
    login: (phone: string, password: string) =>
      request<{ access_token: string; user: ApiUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone, password }),
      }),
    register: (data: { name: string; phone: string; password: string }) =>
      request<{ access_token: string; user: ApiUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: (token: string) =>
      request<{ data: ApiUser }>("/auth/me", { token }),
  },
  favorites: {
    sync: (token: string, productIds: string[]) =>
      request("/favorites/sync", {
        method: "POST",
        token,
        body: JSON.stringify({ product_ids: productIds }),
      }),
  },
};

export function mapApiOrder(order: ApiOrder): StoredOrder {
  const items = order.items ?? [];
  const itemsSummary =
    items.length > 0
      ? items
          .map((i) =>
            i.quantity > 1 ? `${i.product_name} ×${i.quantity}` : i.product_name
          )
          .join(", ")
      : "";

  return {
    id: String(order.id),
    number: order.number,
    status: order.status as OrderStatus,
    total: Number(order.total),
    createdAt: order.created_at,
    customerName: order.customer_name,
    itemsSummary,
  };
}

export interface SubmitOrderInput {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  comment: string;
  deliveryType: "pickup" | "delivery";
  promoCode?: string | null;
  items: CartItem[];
  token?: string | null;
}

export async function submitOrderToApi(input: SubmitOrderInput): Promise<StoredOrder> {
  const res = await api.orders.create(
    {
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      city: input.city || undefined,
      address: input.address || undefined,
      comment: input.comment || undefined,
      delivery_type: input.deliveryType,
      promo_code: input.promoCode || undefined,
      items: input.items.map((item) => ({
        product_slug: item.slug,
        product_id: /^\d+$/.test(item.productId)
          ? Number(item.productId)
          : undefined,
        product_name: item.name.ru,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
    },
    input.token
  );

  const summary = input.items
    .map((i) => (i.quantity > 1 ? `${i.name.ru} ×${i.quantity}` : i.name.ru))
    .join(", ");

  return {
    id: String(res.data.id),
    number: res.data.number,
    status: "new",
    total: res.data.total,
    createdAt: new Date().toISOString(),
    customerName: input.customerName,
    itemsSummary: summary,
  };
}

export async function fetchOrdersFromApi(token: string): Promise<StoredOrder[]> {
  const res = await api.orders.list(token);
  return res.data.map(mapApiOrder);
}
