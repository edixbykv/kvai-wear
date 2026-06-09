"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { imagesFor, COLORS } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

const FREE_SHIP = 4999;

export default function CheckoutPage() {
  const { cartDetailed, cartTotal, clearCart, ready } = useStore();
  const [placed, setPlaced] = useState(false);
  const [method, setMethod] = useState<"card" | "upi" | "cod">("card");

  const shipping = cartTotal >= FREE_SHIP || cartTotal === 0 ? 0 : 199;
  const total = cartTotal + shipping;

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-28 text-center">
        <CheckCircle2 className="h-14 w-14" strokeWidth={1.25} />
        <h1 className="font-display text-4xl font-medium">Order confirmed</h1>
        <p className="text-sm text-muted-foreground">
          Thank you for shopping with KVAI Wear. A confirmation has been sent to your email.
          Your order number is <span className="font-medium text-foreground">#KV{Math.floor(100000 + Math.random() * 899999)}</span>.
        </p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  if (ready && cartDetailed.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-medium">Your bag is empty</h1>
        <p className="text-sm text-muted-foreground">Add a polo before checking out.</p>
        <Button asChild size="lg"><Link href="/shop">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to bag
      </Link>
      <h1 className="mt-4 font-display text-4xl font-medium sm:text-5xl">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* form */}
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Email address" id="email">
              <Input id="email" type="email" required placeholder="you@example.com" />
            </Field>
            <Field label="Phone" id="phone">
              <Input id="phone" type="tel" required placeholder="+91 98765 43210" />
            </Field>
          </Section>

          <Section title="Shipping address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" id="fn"><Input id="fn" required /></Field>
              <Field label="Last name" id="ln"><Input id="ln" required /></Field>
            </div>
            <Field label="Address" id="addr"><Input id="addr" required placeholder="House no, street, area" /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" id="city"><Input id="city" required /></Field>
              <Field label="State" id="state"><Input id="state" required /></Field>
              <Field label="PIN code" id="pin"><Input id="pin" required inputMode="numeric" /></Field>
            </div>
          </Section>

          <Section title="Payment">
            <div className="grid grid-cols-3 gap-2">
              {([["card", "Card"], ["upi", "UPI"], ["cod", "Cash on Delivery"]] as const).map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={
                    "flex h-11 items-center justify-center border text-xs font-medium uppercase tracking-wide transition-colors " +
                    (method === m ? "border-foreground bg-foreground text-background" : "border-input hover:border-foreground/40")
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {method === "card" && (
              <div className="mt-4 space-y-4">
                <Field label="Card number" id="card"><Input id="card" placeholder="1234 5678 9012 3456" inputMode="numeric" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" id="exp"><Input id="exp" placeholder="MM / YY" /></Field>
                  <Field label="CVC" id="cvc"><Input id="cvc" placeholder="123" inputMode="numeric" /></Field>
                </div>
              </div>
            )}
            {method === "upi" && (
              <div className="mt-4">
                <Field label="UPI ID" id="upi"><Input id="upi" placeholder="name@bank" /></Field>
              </div>
            )}
            {method === "cod" && (
              <p className="mt-4 text-sm text-muted-foreground">
                Pay in cash when your order is delivered. A nominal handling fee may apply.
              </p>
            )}
          </Section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border bg-card p-6">
            <h2 className="text-sm font-medium uppercase tracking-luxe">Your order</h2>
            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto">
              {cartDetailed.map(({ line, product }) => (
                <li key={`${line.id}-${line.size}`} className="flex gap-3">
                  <div className="product-surface relative h-20 w-16 shrink-0 overflow-hidden">
                    <Image src={imagesFor(product.color).front} alt={product.name} fill sizes="64px" className="object-contain p-1" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] text-background">
                      {line.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{COLORS[product.color].name} · {line.size}</p>
                  </div>
                  <span className="text-sm">{formatPrice(product.price * line.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(cartTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd></div>
              <div className="flex justify-between border-t pt-3 text-base font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>

            <Button type="submit" size="lg" className="mt-6 w-full">
              <Lock className="h-4 w-4" /> Place Order · {formatPrice(total)}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Secure, encrypted checkout
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-sm font-medium uppercase tracking-luxe">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
