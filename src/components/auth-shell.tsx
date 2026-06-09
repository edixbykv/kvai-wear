import Link from "next/link";
import Image from "next/image";
import { Wordmark } from "@/components/brand";
import { imagesFor } from "@/lib/products";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  image = "charcoal" as const,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  image?: "charcoal" | "maroon" | "forest";
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-6.25rem)] max-w-7xl items-stretch lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Wordmark href="/" />
          </div>
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>

      <div className="product-surface relative hidden lg:block">
        <Image
          src={imagesFor(image).front}
          alt="KVAI polo"
          fill
          sizes="50vw"
          className="object-contain p-16"
        />
        <div className="absolute bottom-10 left-12 max-w-xs">
          <p className="font-display text-2xl font-medium leading-snug">
            “The quiet confidence of a perfect polo.”
          </p>
          <Link href="/shop" className="mt-3 inline-block text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground">
            Explore the collection →
          </Link>
        </div>
      </div>
    </div>
  );
}
