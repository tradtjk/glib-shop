import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Redis } from "@upstash/redis";

const REDIS_KEYS = {
  users: "golib:users",
  orders: "golib:orders",
  tokens: "golib:tokens",
} as const;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();

function getDataDir() {
  if (process.env.VERCEL) {
    return path.join("/tmp", "golibshop-data");
  }
  return path.join(process.cwd(), ".data");
}

const DATA_DIR = getDataDir();

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

async function readStore<T>(redisKey: string, file: string, fallback: T): Promise<T> {
  if (redis) {
    const data = await redis.get<T>(redisKey);
    return data ?? fallback;
  }
  return readJsonFile(file, fallback);
}

async function writeStore<T>(redisKey: string, file: string, data: T): Promise<void> {
  if (redis) {
    await redis.set(redisKey, data);
    return;
  }
  await writeJsonFile(file, data);
}

export interface ServerUser {
  id: string;
  phone: string;
  password: string;
  name: string;
}

export interface ServerOrderItem {
  productSlug?: string;
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface ServerOrder {
  id: string;
  number: string;
  userId: string | null;
  status: string;
  total: number;
  subtotal: number;
  customerName: string;
  customerPhone: string;
  city?: string;
  address?: string;
  comment?: string;
  deliveryType: "pickup" | "delivery";
  promoCode?: string;
  items: ServerOrderItem[];
  createdAt: string;
}

interface TokenRecord {
  token: string;
  userId: string;
  createdAt: string;
}

export function generateOrderNumber(): string {
  return `GLB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function getUsers(): Promise<ServerUser[]> {
  return readStore(REDIS_KEYS.users, "users.json", []);
}

export async function saveUsers(users: ServerUser[]): Promise<void> {
  await writeStore(REDIS_KEYS.users, "users.json", users);
}

export async function getOrders(): Promise<ServerOrder[]> {
  return readStore(REDIS_KEYS.orders, "orders.json", []);
}

export async function saveOrders(orders: ServerOrder[]): Promise<void> {
  await writeStore(REDIS_KEYS.orders, "orders.json", orders);
}

export async function getTokens(): Promise<TokenRecord[]> {
  return readStore(REDIS_KEYS.tokens, "tokens.json", []);
}

export async function saveTokens(tokens: TokenRecord[]): Promise<void> {
  await writeStore(REDIS_KEYS.tokens, "tokens.json", tokens);
}

export async function createToken(userId: string): Promise<string> {
  const tokens = await getTokens();
  const token = randomUUID();
  tokens.push({ token, userId, createdAt: new Date().toISOString() });
  await saveTokens(tokens);
  return token;
}

export async function resolveUserId(token: string | null): Promise<string | null> {
  if (!token) return null;
  const tokens = await getTokens();
  const record = tokens.find((t) => t.token === token);
  return record?.userId ?? null;
}

export function formatOrderResponse(order: ServerOrder) {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    total: order.total,
    created_at: order.createdAt,
    customer_name: order.customerName,
    delivery_type: order.deliveryType,
    items: order.items.map((item) => ({
      product_name: item.productName,
      size: item.size ?? null,
      color: item.color ?? null,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}
