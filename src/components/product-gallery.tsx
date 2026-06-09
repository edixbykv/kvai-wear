"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: { front: string; side: string; back: string };
  alt: string;
  badge?: string;
}) {
  const views: { key: keyof typeof images; label: string }[] = [
    { key: "front", label: "Front" },
    { key: "side", label: "Side" },
    { key: "back", label: "Back" },
  ];
  const [active, setActive] = useState<keyof typeof images>("front");

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* thumbnails */}
      <div className="flex gap-3 lg:flex-col">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActive(v.key)}
            aria-label={`View ${v.label}`}
            className={cn(
              "product-surface relative aspect-[4/5] w-20 shrink-0 overflow-hidden border transition-colors lg:w-24",
              active === v.key ? "border-foreground" : "border-transparent hover:border-foreground/30",
            )}
          >
            <Image src={images[v.key]} alt={`${alt} ${v.label}`} fill sizes="96px" className="object-contain p-1.5" />
          </button>
        ))}
      </div>

      {/* main */}
      <div className="product-surface relative aspect-[4/5] flex-1 overflow-hidden">
        {badge && (
          <span className="absolute left-4 top-4 z-10 bg-foreground px-2.5 py-1 text-[10px] font-medium uppercase tracking-luxe text-background">
            {badge}
          </span>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${alt} ${active}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain p-6 sm:p-10"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
