"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { imagesFor, COLORS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP = 4999;

export function CartDrawer() {
  const {
    cartOpen, setCartOpen, cartDetailed, cartTotal, cartCount,
    setQty, removeFromCart,
  } = useStore();

  const remaining = Math.max(0, FREE_SHIP - cartTotal);
  const progress = Math.min(100, (cartTotal / FREE_SHIP) * 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="p-0">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-sm font-medium uppercase tracking-luxe">
            Your Bag {cartCount > 0 && `(${cartCount})`}
          </h2>
        </div>

        {cartDetailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="border-b px-6 py-4">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  You&apos;re {formatPrice(remaining)} away from free shipping.
                </p>
              ) : (
                <p className="text-xs font-medium text-foreground">
                  You&apos;ve unlocked complimentary shipping.
                </p>
              )}
              <div className="mt-2 h-1 w-full overflow-hidden bg-muted">
                <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y overflow-y-auto px-6">
              {cartDetailed.map(({ line, product }) => (
                <li key={`${line.id}-${line.size}`} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="product-surface relative h-24 w-20 shrink-0 overflow-hidden"
                  >
                    <Image src={imagesFor(product.color).front} alt={product.name} fill className="object-contain p-1" sizes="80px" />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {COLORS[product.color].name} · Size {line.size}
                        </p>
                      </div>
                      <button
                        aria-label="Remove"
                        onClick={() => removeFromCart(line.id, line.size)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border">
                        <button
                          aria-label="Decrease quantity"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                          onClick={() => setQty(line.id, line.size, line.qty - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{line.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                          onClick={() => setQty(line.id, line.size, line.qty + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                <SheetClose asChild>
                  <Button asChild size="lg">
                    <Link href="/checkout">Checkout · {formatPrice(cartTotal)}</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/cart">View Bag</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
