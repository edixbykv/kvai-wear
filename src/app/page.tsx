import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCcw, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { ColorRail } from "@/components/color-rail";
import { HeroPolo } from "@/components/hero-polo";
import { PRODUCTS, imagesFor } from "@/lib/products";

const bestsellers = PRODUCTS.filter((p) => p.badge === "Bestseller" || p.badge === "Premium").slice(0, 4);
const newIn = PRODUCTS.filter((p) => p.badge === "New" || p.badge === "Limited").slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8 lg:py-14">
          <Reveal className="order-1">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
              The Polo, Perfected
            </p>
            <h1 className="font-display text-5xl font-medium leading-[1.02] sm:text-6xl lg:text-7xl">
              Luxury basics,
              <br />
              made to last.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Garment-dyed cotton piqué polos in eleven considered shades. Clean lines,
              honest fabric, and a discreet tonal signature — nothing more, nothing less.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop the Collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shop?line=Luxe+Polo">Discover Luxe</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-2">
            <HeroPolo color="navy" name="Signature Polo · Navy" />
          </Reveal>
        </div>

        {/* marquee */}
        <div className="overflow-hidden border-t bg-foreground py-3 text-background">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {["Long-staple cotton piqué", "Garment dyed", "Tonal KVAI embroidery", "Eleven shades", "Made to last", "Quiet luxury"].map((t) => (
                  <span key={t} className="mx-6 text-[11px] uppercase tracking-luxe">
                    {t} <span className="ml-12 opacity-40">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
              Most Wanted
            </p>
            <h2 className="font-display text-4xl font-medium sm:text-5xl">Bestsellers</h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center px-4 py-14 sm:px-6 lg:px-12 lg:py-24">
            <Sparkles className="mb-6 h-6 w-6" strokeWidth={1.25} />
            <h2 className="font-display text-4xl font-medium leading-tight sm:text-5xl">
              Considered design,<br />quietly executed.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              We start with the fabric — a dense, long-staple cotton piqué — and remove
              everything that doesn&apos;t serve it. A clean collar, a two-button placket,
              and a single tonal KVAI signature at the chest. The result is a polo that
              feels as good in its tenth year as its first.
            </p>
            <Button asChild variant="link" className="mt-6 h-auto justify-start px-0">
              <Link href="/shop">Explore the craft <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </Reveal>
          <div className="product-surface relative min-h-[360px] lg:min-h-[560px]">
            <Image
              src={imagesFor("olive").side}
              alt="KVAI polo side profile"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>

      {/* COLOR STORY */}
      <section className="py-16 lg:py-24">
        <Reveal className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
            The Palette
          </p>
          <h2 className="font-display text-4xl font-medium sm:text-5xl">Eleven shades, one cut.</h2>
        </Reveal>
        <ColorRail />
      </section>

      {/* NEW IN */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
              Just Landed
            </p>
            <h2 className="font-display text-4xl font-medium sm:text-5xl">New In</h2>
          </div>
          <Link href="/shop?sort=new" className="hidden items-center gap-1 text-sm text-foreground/80 transition-colors hover:text-foreground sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {newIn.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-px overflow-hidden border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Complimentary Shipping", d: "On all orders over ₹4,999, delivered with care." },
            { icon: RefreshCcw, t: "30-Day Returns", d: "Changed your mind? Return it, no questions asked." },
            { icon: Leaf, t: "Responsible Cotton", d: "Long-staple cotton, garment dyed for longevity." },
            { icon: Sparkles, t: "Tonal Signature", d: "A discreet KVAI embroidery on every polo." },
          ].map((f) => (
            <div key={f.t} className="bg-background p-8">
              <f.icon className="h-6 w-6" strokeWidth={1.25} />
              <h3 className="mt-4 text-sm font-medium">{f.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
