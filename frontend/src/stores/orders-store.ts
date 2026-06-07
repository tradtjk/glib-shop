"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderStatus } from "@/types";
import { fetchOrdersFromApi } from "@/lib/api";

export interface StoredOrder {
  id: string;
  number: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  customerName: string;
  itemsSummary: string;
}

interface OrdersState {
  orders: StoredOrder[];
  syncing: boolean;
  lastSyncedAt: string | null;
  addOrder: (order: StoredOrder) => void;
  setOrders: (orders: StoredOrder[]) => void;
  syncFromApi: (token: string) => Promise<boolean>;
}

function mergeOrders(local: StoredOrder[], remote: StoredOrder[]): StoredOrder[] {
  const map = new Map<string, StoredOrder>();
  for (const order of local) {
    map.set(order.number, order);
  }
  for (const order of remote) {
    map.set(order.number, order);
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      syncing: false,
      lastSyncedAt: null,
      addOrder: (order) =>
        set((s) => ({
          orders: [order, ...s.orders.filter((o) => o.number !== order.number)],
        })),
      setOrders: (orders) => set({ orders }),
      syncFromApi: async (token) => {
        set({ syncing: true });
        try {
          const remote = await fetchOrdersFromApi(token);
          set({
            orders: mergeOrders(get().orders, remote),
            lastSyncedAt: new Date().toISOString(),
            syncing: false,
          });
          return true;
        } catch {
          set({ syncing: false });
          return false;
        }
      },
    }),
    { name: "golib-orders" }
  )
);
