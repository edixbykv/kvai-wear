"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { PRODUCTS, imagesFor, COLORS } from "@/lib/products";
import { formatPrice, cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
] as const;

type Tab = (typeof TABS)[number]["id"];

// sample order history (frontend demo)
const ORDERS = [
  { id: "KV842190", date: "12 May 2026", status: "Delivered", items: ["kvai-01", "kvai-07"], total: 6280 },
  { id: "KV839004", date: "28 Apr 2026", status: "Delivered", items: ["kvai-21"], total: 3890 },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("profile");
  const { wishlist, ready } = useStore();
  const saved = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex items-center gap-4 border-b pb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-lg font-medium text-background">
          AK
        </div>
        <div>
          <h1 className="font-display text-3xl font-medium">Hello, Arjun</h1>
          <p className="text-sm text-muted-foreground">arjun.kapoor@example.com</p>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* sidebar */}
        <aside>
          <nav className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-3 whitespace-nowrap border px-4 py-2.5 text-sm transition-colors lg:border-0 lg:border-l-2 lg:px-3",
                  tab === t.id
                    ? "border-foreground bg-muted font-medium lg:bg-muted"
                    : "border-transparent text-foreground/75 hover:bg-muted/60",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
            <Link
              href="/login"
              className="flex shrink-0 items-center gap-3 whitespace-nowrap border border-transparent px-4 py-2.5 text-sm text-foreground/75 transition-colors hover:bg-muted/60 lg:border-l-2 lg:px-3"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Link>
          </nav>
        </aside>

        {/* content */}
        <div className="min-h-[400px]">
          {tab === "profile" && (
            <Card title="Profile details">
              <form className="grid max-w-xl gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <Field label="First name" defaultValue="Arjun" />
                <Field label="Last name" defaultValue="Kapoor" />
                <div className="sm:col-span-2"><Field label="Email" defaultValue="arjun.kapoor@example.com" type="email" /></div>
                <div className="sm:col-span-2"><Field label="Phone" defaultValue="+91 98201 22334" /></div>
                <div className="sm:col-span-2">
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </Card>
          )}

          {tab === "orders" && (
            <Card title="Order history">
              <ul className="space-y-4">
                {ORDERS.map((o) => (
                  <li key={o.id} className="border p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Order #{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date} · {o.status}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      {o.items.map((pid) => {
                        const p = PRODUCTS.find((x) => x.id === pid);
                        if (!p) return null;
                        return (
                          <Link key={pid} href={`/product/${p.slug}`} className="product-surface relative h-20 w-16 overflow-hidden">
                            <Image src={imagesFor(p.color).front} alt={p.name} fill sizes="64px" className="object-contain p-1" />
                          </Link>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {tab === "wishlist" && (
            <Card title="Saved pieces">
              {ready && saved.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved pieces yet. <Link href="/shop" className="underline">Browse polos</Link>.
                </p>
              ) : (
                <ul className="divide-y">
                  {saved.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} className="flex items-center gap-4 py-3">
                        <div className="product-surface relative h-16 w-14 overflow-hidden">
                          <Image src={imagesFor(p.color).front} alt={p.name} fill sizes="56px" className="object-contain p-1" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{COLORS[p.color].name}</p>
                        </div>
                        <span className="text-sm">{formatPrice(p.price)}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {tab === "addresses" && (
            <Card title="Saved addresses">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border p-5">
                  <p className="text-xs font-medium uppercase tracking-luxe text-muted-foreground">Default</p>
                  <p className="mt-2 text-sm font-medium">Arjun Kapoor</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    402, Linden Apartments, Bandra West<br />Mumbai, Maharashtra 400050<br />+91 98201 22334
                  </p>
                </div>
                <button className="flex min-h-[140px] items-center justify-center border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
                  + Add new address
                </button>
              </div>
            </Card>
          )}

          {tab === "payment" && (
            <Card title="Payment methods">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between border p-5">
                  <div>
                    <p className="text-sm font-medium">Visa ending 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 08 / 28</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <button className="flex min-h-[80px] items-center justify-center border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
                  + Add payment method
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-6 font-display text-2xl font-medium">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label, defaultValue, type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}
