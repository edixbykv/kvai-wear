import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import {
  PRODUCTS, getProduct, relatedProducts, imagesFor, COLORS,
} from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { images: [imagesFor(product.color).front] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const images = imagesFor(product.color);
  const related = relatedProducts(product);

  // colour variants = other products in the same line (unique colour)
  const sameLine = PRODUCTS.filter((p) => p.line === product.line);
  const variants = sameLine.map((p) => ({
    color: p.color,
    slug: p.slug,
    hex: COLORS[p.color].hex,
    name: COLORS[p.color].name,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={images} alt={product.name} badge={product.badge} />
        </div>
        <ProductDetail product={product} variants={variants} />
      </div>

      {/* related */}
      <section className="mt-20 border-t pt-14 lg:mt-28">
        <Reveal className="mb-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
            You may also like
          </p>
          <h2 className="font-display text-3xl font-medium sm:text-4xl">Related Polos</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
