# KVAI Wear

A premium, frontend-only e-commerce experience for **KVAI Wear** — luxury basics, made to last. Built around a single supplied polo mockup that is cropped (front / side / back) and recoloured into eleven garment-dyed shades, each carrying a discreet tonal **KVAI** embroidery at the left chest.

> Powered by [KVAI.in](https://kvai.in)

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **shadcn-style UI** primitives (Radix + CVA)
- **Framer Motion** for motion
- `localStorage`-backed **cart** and **wishlist**

## Features

- Home, Shop, Product Details, Cart, Wishlist, Checkout, Login, Register, Profile
- Add / remove from cart, quantity selector, cart drawer with free-shipping meter
- Wishlist with persistence
- Search, product filters, colour filters, sort
- Product gallery (front/side/back), colour variants, related products
- Mobile-first responsive across mobile / tablet / laptop / desktop

## Product imagery

All 33 product images (`public/products/*.png`) are generated from one master mockup —
no stock photos or external images are used.

```bash
# regenerate from scripts/master-polo-mockup.jpg
node scripts/recolor-assets.mjs
```

The pipeline crops each view, builds a luminance alpha mask (with interior hole-fill),
applies a per-colour duotone recolour that preserves the original fabric shading, and
composites a tonal embroidered KVAI logo on the front view.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```
