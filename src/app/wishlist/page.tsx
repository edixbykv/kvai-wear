"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

export default function WishlistPage() {
  const { wishlist, ready } = useStore();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 border-b pb-8">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
          Saved for later
        </p>
        <h1 className="font-display text-4xl font-medium sm:text-5xl">Wishlist</h1>
        {ready && items.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "piece" : "pieces"} you love.
          </p>
        )}
      </header>

      {ready && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
          <Heart className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
          <h2 className="font-display text-2xl font-medium">No saved pieces yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tap the heart on any polo to save it here for later.
          </p>
          <Button asChild size="lg">
            <Link href="/shop">Browse Polos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
