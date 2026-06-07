"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  city: string;
  street: string;
  phone: string;
  isDefault: boolean;
}

interface AddressesState {
  items: Address[];
  add: (data: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddressesStore = create<AddressesState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (data) => {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `addr-${Date.now()}`;
        const isDefault = data.isDefault ?? get().items.length === 0;
        set((state) => {
          let items = [...state.items, { ...data, id, isDefault }];
          if (isDefault) {
            items = items.map((a) => ({ ...a, isDefault: a.id === id }));
          }
          return { items };
        });
      },
      remove: (id) => {
        set((state) => {
          const items = state.items.filter((a) => a.id !== id);
          if (items.length && !items.some((a) => a.isDefault)) {
            items[0].isDefault = true;
          }
          return { items };
        });
      },
      setDefault: (id) => {
        set((state) => ({
          items: state.items.map((a) => ({ ...a, isDefault: a.id === id })),
        }));
      },
    }),
    { name: "golib-addresses" }
  )
);
