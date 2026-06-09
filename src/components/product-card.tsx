"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { type Product, imagesFor, COLORS } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/wishlist-button";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatPrice, cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const img = imagesFor(product.color);
  const { addToCart } = useStore();
  const { toast } = useToast();

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product.id, "M", 1);
    toast("Added to bag");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: "easeOut" }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="product-surface relative aspect-[4/5] overflow-hidden">
          {product.badge && (
            <Badge className="absolute left-3 top-3 z-10">{product.badge}</Badge>
          )}
          <WishlistButton id={product.id} className="absolute right-3 top-3 z-10" />

          <Image
            src={img.front}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={img.back}
            alt={`${product.name} back view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          <button
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 z-10 flex h-11 translate-y-3 items-center justify-center gap-2 bg-foreground text-xs font-medium uppercase tracking-luxe text-background opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </button>
        </div>

        <div className="mt-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">{product.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{product.line}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span
            className="h-3.5 w-3.5 rounded-full border border-black/10"
            style={{ backgroundColor: COLORS[product.color].hex }}
            title={COLORS[product.color].name}
          />
          <span className="text-xs text-muted-foreground">{COLORS[product.color].name}</span>
        </div>
      </Link>
    </motion.div>
  );
}
