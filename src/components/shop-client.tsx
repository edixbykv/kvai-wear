"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Check, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PRODUCTS, COLOR_LIST, LINES, COLORS, type ColorKey } from "@/lib/products";
import { cn } from "@/lib/utils";

type Sort = "featured" | "new" | "price-asc" | "price-desc";

interface InitialFilters {
  q?: string;
  color?: string;
  line?: string;
  sort?: string;
}

export function ShopClient({ initial }: { initial: InitialFilters }) {
  const [q] = useState(initial.q ?? "");
  const [colors, setColors] = useState<ColorKey[]>(
    initial.color && COLORS[initial.color as ColorKey] ? [initial.color as ColorKey] : [],
  );
  const [lines, setLines] = useState<string[]>(
    initial.line && LINES.includes(initial.line) ? [initial.line] : [],
  );
  const [sort, setSort] = useState<Sort>(
    (["featured", "new", "price-asc", "price-desc"].includes(initial.sort ?? "")
      ? initial.sort
      : "featured") as Sort,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (colors.length && !colors.includes(p.color)) return false;
      if (lines.length && !lines.includes(p.line)) return false;
      if (term) {
        const hay = `${p.name} ${p.line} ${COLORS[p.color].name} ${p.tagline}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });

    const newSet = new Set(["New", "Limited"]);
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "new") {
        const an = newSet.has(a.badge ?? "") ? 0 : 1;
        const bn = newSet.has(b.badge ?? "") ? 0 : 1;
        return an - bn;
      }
      return 0;
    });
    return list;
  }, [q, colors, lines, sort]);

  function toggleColor(c: ColorKey) {
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
  function toggleLine(l: string) {
    setLines((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  }
  function clearAll() {
    setColors([]);
    setLines([]);
  }

  const activeCount = colors.length + lines.length;

  const FilterBody = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
          Colour
        </h3>
        <div className="grid grid-cols-6 gap-2.5 lg:grid-cols-5">
          {COLOR_LIST.map((c) => {
            const active = colors.includes(c.key);
            return (
              <button
                key={c.key}
                onClick={() => toggleColor(c.key)}
                title={c.name}
                aria-pressed={active}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-full border transition-all",
                  active ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "hover:scale-105",
                )}
                style={{ backgroundColor: c.hex, borderColor: "rgba(0,0,0,0.12)" }}
              >
                {active && (
                  <Check
                    className={cn("h-3.5 w-3.5", ["white", "cream", "beige"].includes(c.key) ? "text-black" : "text-white")}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
          Collection
        </h3>
        <ul className="space-y-1">
          {LINES.map((l) => {
            const active = lines.includes(l);
            return (
              <li key={l}>
                <button
                  onClick={() => toggleLine(l)}
                  className="flex w-full items-center gap-3 py-1.5 text-left text-sm"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center border transition-colors",
                      active ? "border-foreground bg-foreground text-background" : "border-foreground/30",
                    )}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className={cn(active ? "text-foreground" : "text-foreground/80")}>{l}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-xs text-muted-foreground underline-offset-4 hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 border-b pb-8">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-luxe text-muted-foreground">
          {q ? `Search · ${q}` : "The Collection"}
        </p>
        <h1 className="font-display text-4xl font-medium sm:text-5xl">All Polos</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "style" : "styles"} — one perfect cut,
          rendered in our full palette of garment-dyed shades.
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* desktop sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-28">{FilterBody}</div>
        </aside>

        <div className="flex-1">
          {/* toolbar */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              {colors.map((c) => (
                <Chip key={c} onClear={() => toggleColor(c)}>
                  {COLORS[c].name}
                </Chip>
              ))}
              {lines.map((l) => (
                <Chip key={l} onClear={() => toggleLine(l)}>
                  {l}
                </Chip>
              ))}
            </div>

            <label className="ml-auto flex items-center gap-2 text-sm">
              <span className="hidden text-muted-foreground sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-9 border border-input bg-card px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="featured">Featured</option>
                <option value="new">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <p className="text-sm text-muted-foreground">No polos match your filters.</p>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="max-w-xs">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <h2 className="text-sm font-medium uppercase tracking-luxe">Filters</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{FilterBody}</div>
          <div className="border-t px-6 py-4">
            <Button className="w-full" onClick={() => setMobileOpen(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-foreground/15 bg-muted px-2.5 py-1 text-xs">
      {children}
      <button onClick={onClear} aria-label="Remove filter" className="text-muted-foreground hover:text-foreground">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
