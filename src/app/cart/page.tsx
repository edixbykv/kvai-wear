"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { imagesFor, COLORS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP = 4999;

export default function CartPage() {
  const { cartDetailed, cartTotal, setQty, removeFromCart, ready } = useStore();

  if (ready && cartDetailed.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-4 py-28 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
        <h1 className="font-display text-3xl font-medium">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Discover our garment-dyed polos — one perfect cut in eleven considered shades.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">Shop the Collection</Link>
        </Button>
      </div>
    );
  }

  const shipping = cartTotal >= FREE_SHIP || cartTotal === 0 ? 0 : 199;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-medium sm:text-5xl">Shopping Bag</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {cartDetailed.length} {cartDetailed.length === 1 ? "item" : "items"} in your bag
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* items */}
        <ul className="divide-y border-y">
          {cartDetailed.map(({ line, product }) => (
            <li key={`${line.id}-${line.size}`} className="flex gap-5 py-6">
              <Link href={`/product/${product.slug}`} className="product-surface relative h-36 w-28 shrink-0 overflow-hidden sm:h-40 sm:w-32">
                <Image src={imagesFor(product.color).front} alt={product.name} fill sizes="128px" className="object-contain p-2" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${product.slug}`} className="text-sm font-medium hover:underline sm:text-base">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{product.line}</p>
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

                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="flex items-center border">
                    <button
                      aria-label="Decrease"
                      className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted"
                      onClick={() => setQty(line.id, line.size, line.qty - 1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm">{line.qty}</span>
                    <button
                      aria-label="Increase"
                      className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted"
                      onClick={() => setQty(line.id, line.size, line.qty + 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(product.price * line.qty)}</p>
                    {line.qty > 1 && (
                      <p className="text-xs text-muted-foreground">{formatPrice(product.price)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border bg-card p-6">
            <h2 className="text-sm font-medium uppercase tracking-luxe">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(cartTotal + shipping)}</dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="link" className="mt-2 w-full">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
