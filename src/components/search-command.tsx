"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { PRODUCTS, imagesFor, COLORS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.line.toLowerCase().includes(term) ||
        COLORS[p.color].name.toLowerCase().includes(term),
    ).slice(0, 6);
  }, [q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <>
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="text-foreground/80 transition-colors hover:text-foreground"
      >
        <Search className="h-5 w-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="max-w-lg p-0">
          <form onSubmit={submit} className="flex items-center gap-3 border-b px-6 py-5">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search polos, colours, collections…"
              className="h-8 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </form>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {q.trim() === "" && (
              <p className="px-3 py-6 text-sm text-muted-foreground">
                Try “Navy”, “Luxe” or “Classic”.
              </p>
            )}
            {q.trim() !== "" && results.length === 0 && (
              <p className="px-3 py-6 text-sm text-muted-foreground">
                No matches for “{q}”.
              </p>
            )}
            <ul className="space-y-1">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-muted">
                      <Image src={imagesFor(p.color).front} alt={p.name} fill className="object-contain" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.line}</p>
                    </div>
                    <span className="text-sm">{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
