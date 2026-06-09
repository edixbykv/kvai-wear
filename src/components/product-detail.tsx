"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Star, Truck, RefreshCcw, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { type Product, COLORS } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductDetail({
  product,
  variants,
}: {
  product: Product;
  variants: { color: string; slug: string; hex: string; name: string }[];
}) {
  const { addToCart } = useStore();
  const { toast } = useToast();
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("details");

  function add() {
    addToCart(product.id, size, qty);
    toast("Added to bag");
  }

  return (
    <div className="flex flex-col">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{product.line}</span>
      </nav>

      <p className="text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
        {product.line}
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium sm:text-4xl">{product.name}</h1>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("h-3.5 w-3.5", i < Math.round(product.rating) ? "fill-foreground text-foreground" : "text-foreground/25")}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {product.rating.toFixed(1)} · {product.reviews} reviews
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
        {product.compareAt && (
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.compareAt)}
          </span>
        )}
        <span className="text-xs text-muted-foreground">MRP incl. of all taxes</span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.tagline}</p>

      {/* colour variants */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider">
            Colour — <span className="text-muted-foreground">{COLORS[product.color].name}</span>
          </span>
          <span className="text-xs text-muted-foreground">{variants.length} shades</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {variants.map((v) => {
            const active = v.color === product.color;
            return (
              <Link
                key={v.color}
                href={`/product/${v.slug}`}
                title={v.name}
                aria-label={v.name}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full border transition-all",
                  active ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hover:scale-110",
                )}
                style={{ backgroundColor: v.hex, borderColor: "rgba(0,0,0,0.12)" }}
              />
            );
          })}
        </div>
      </div>

      {/* size */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider">Size</span>
          <button className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            Size guide
          </button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                "flex h-11 items-center justify-center border text-sm transition-colors",
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-input hover:border-foreground/40",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* qty + add */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-12 items-center justify-between border sm:w-32">
          <button
            aria-label="Decrease"
            className="flex h-full w-11 items-center justify-center transition-colors hover:bg-muted"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-sm">{qty}</span>
          <button
            aria-label="Increase"
            className="flex h-full w-11 items-center justify-center transition-colors hover:bg-muted"
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={add}>
          Add to Bag — {formatPrice(product.price * qty)}
        </Button>
        <WishlistButton id={product.id} variant="full" className="sm:w-auto" />
      </div>

      {/* assurances */}
      <div className="mt-6 grid grid-cols-3 gap-3 border-y py-5">
        {[
          { icon: Truck, t: "Free shipping", d: "Over ₹4,999" },
          { icon: RefreshCcw, t: "30-day returns", d: "Easy & free" },
          { icon: ShieldCheck, t: "Secure checkout", d: "Encrypted" },
        ].map((f) => (
          <div key={f.t} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2.5 sm:text-left">
            <f.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-medium">{f.t}</p>
              <p className="text-[11px] text-muted-foreground">{f.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* accordions */}
      <div className="mt-2 divide-y">
        {[
          { id: "details", title: "Description", body: <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p> },
          {
            id: "features",
            title: "Details & Care",
            body: (
              <ul className="space-y-2">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    {d}
                  </li>
                ))}
              </ul>
            ),
          },
          { id: "fabric", title: "Fabric", body: <p className="text-sm leading-relaxed text-muted-foreground">{product.fabric}</p> },
        ].map((sec) => {
          const open = openSection === sec.id;
          return (
            <div key={sec.id}>
              <button
                onClick={() => setOpenSection(open ? null : sec.id)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-medium"
              >
                {sec.title}
                <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
              </button>
              <div className={cn("overflow-hidden transition-all", open ? "max-h-96 pb-5" : "max-h-0")}>
                {sec.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
