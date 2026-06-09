"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, useMemo,
} from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export interface CartLine {
  id: string; // product id
  size: string;
  qty: number;
}

interface StoreState {
  cart: CartLine[];
  wishlist: string[]; // product ids
  ready: boolean;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (id: string, size?: string, qty?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
  cartDetailed: { line: CartLine; product: Product }[];
}

const StoreContext = createContext<StoreState | null>(null);

const CART_KEY = "kvai_cart_v1";
const WISH_KEY = "kvai_wishlist_v1";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(load<CartLine[]>(CART_KEY, []));
    setWishlist(load<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);

  const addToCart = useCallback((id: string, size = "M", qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.id === id && l.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id, size, qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string, size: string) => {
    setCart((prev) => prev.filter((l) => !(l.id === id && l.size === size)));
  }, []);

  const setQty = useCallback((id: string, size: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id && l.size === size ? { ...l, qty: Math.max(1, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const inWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const cartDetailed = useMemo(
    () =>
      cart
        .map((line) => {
          const product = PRODUCTS.find((p) => p.id === line.id);
          return product ? { line, product } : null;
        })
        .filter(Boolean) as { line: CartLine; product: Product }[],
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cartDetailed.reduce((s, { line, product }) => s + product.price * line.qty, 0),
    [cartDetailed],
  );

  const value: StoreState = {
    cart, wishlist, ready, cartOpen, setCartOpen,
    addToCart, removeFromCart, setQty, clearCart,
    toggleWishlist, inWishlist,
    cartCount, cartTotal, cartDetailed,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
