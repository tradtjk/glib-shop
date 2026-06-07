"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface CartModalItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartModalContextValue {
  open: boolean;
  lastItem: CartModalItem | null;
  showAfterAdd: (item: CartModalItem) => void;
  close: () => void;
}

const CartModalContext = createContext<CartModalContextValue | null>(null);

export function CartModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [lastItem, setLastItem] = useState<CartModalItem | null>(null);

  const showAfterAdd = useCallback((item: CartModalItem) => {
    setLastItem(item);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <CartModalContext.Provider value={{ open, lastItem, showAfterAdd, close }}>
      {children}
    </CartModalContext.Provider>
  );
}

export function useCartModal() {
  const ctx = useContext(CartModalContext);
  if (!ctx) {
    throw new Error("useCartModal must be used within CartModalProvider");
  }
  return ctx;
}
