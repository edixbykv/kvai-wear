import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "All Polos", href: "/shop" },
      { label: "Classic", href: "/shop?line=Classic+Polo" },
      { label: "Luxe", href: "/shop?line=Luxe+Polo" },
      { label: "New In", href: "/shop?sort=new" },
    ],
  },
  {
    title: "Brand",
    links: [
      { label: "Our Story", href: "/shop" },
      { label: "Materials", href: "/shop" },
      { label: "Sustainability", href: "/shop" },
      { label: "Stores", href: "/shop" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "Shipping", href: "/shop" },
      { label: "Returns", href: "/shop" },
      { label: "Contact", href: "/shop" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Wordmark href={null} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Luxury basics, made to last. Considered polos in honest fabrics — clean,
              timeless and quietly refined.
            </p>
            <form className="mt-6 flex max-w-sm gap-2">
              <Input type="email" placeholder="Email address" aria-label="Email address" />
              <Button type="submit" size="default" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-foreground/80 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} KVAI Wear. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://kvai.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              KVAI.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
