"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, Heart, User } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { SearchCommand } from "@/components/search-command";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?line=Classic+Polo", label: "Classic" },
  { href: "/shop?line=Luxe+Polo", label: "Luxe" },
  { href: "/shop?sort=new", label: "New In" },
];

export function Navbar() {
  const { cartCount, wishlist, setCartOpen, ready } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        scrolled ? "border-border bg-background/90 backdrop-blur-md" : "border-transparent bg-background",
      )}
    >
      {/* announcement */}
      <div className="bg-foreground text-background">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-[11px] tracking-luxe">
          COMPLIMENTARY SHIPPING ON ORDERS OVER ₹4,999
        </div>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:flex-1">
          <button
            aria-label="Open menu"
            className="-ml-1 p-1 lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-xs font-medium uppercase tracking-luxe text-foreground/75 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center lg:flex-1">
          <Wordmark />
        </div>

        <div className="flex items-center justify-end gap-4 sm:gap-5 lg:flex-1">
          <SearchCommand />
          <Link href="/wishlist" aria-label="Wishlist" className="relative text-foreground/80 transition-colors hover:text-foreground">
            <Heart className="h-5 w-5" />
            {ready && wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/login" aria-label="Account" className="hidden text-foreground/80 transition-colors hover:text-foreground sm:block">
            <User className="h-5 w-5" />
          </Link>
          <button
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
            className="relative text-foreground/80 transition-colors hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {ready && cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="max-w-xs">
          <div className="px-6 py-6">
            <Wordmark href="/" />
          </div>
          <ul className="flex flex-col px-3">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/wishlist", label: "Wishlist" }, { href: "/profile", label: "Account" }].map((item) => (
              <li key={item.label}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "block px-3 py-3 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-muted",
                      pathname === item.href && "text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </header>
  );
}
