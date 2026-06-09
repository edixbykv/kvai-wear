import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";

export const metadata: Metadata = {
  title: "Shop All Polos",
  description: "The full KVAI Wear collection of garment-dyed cotton piqué polos.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; color?: string; line?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  return <ShopClient initial={sp} />;
}
