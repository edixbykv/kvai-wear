"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { imagesFor, type ColorKey } from "@/lib/products";

const VIEWS: { key: "front" | "side" | "back"; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "side", label: "Side" },
  { key: "back", label: "Back" },
];

export function HeroPolo({
  color = "navy" as ColorKey,
  name = "Signature Polo · Navy",
}: {
  color?: ColorKey;
  name?: string;
}) {
  const images = imagesFor(color);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % VIEWS.length), 2400);
    return () => clearInterval(id);
  }, []);

  const view = VIEWS[i];

  return (
    <div className="product-surface relative mx-auto aspect-[5/6] w-full max-w-xs overflow-hidden sm:max-w-sm lg:max-w-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={view.key}
          initial={{ opacity: 0, scale: 0.96, rotateY: 12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.98, rotateY: -12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ transformPerspective: 1000 }}
        >
          <Image
            src={images[view.key]}
            alt={`KVAI signature polo — ${view.label}`}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 480px"
            className="object-contain p-2"
          />
        </motion.div>
      </AnimatePresence>

      <span className="absolute bottom-5 left-5 text-[11px] uppercase tracking-luxe text-muted-foreground">
        {name}
      </span>

      {/* view dots */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {VIEWS.map((v, idx) => (
          <button
            key={v.key}
            aria-label={`Show ${v.label}`}
            onClick={() => setI(idx)}
            className={
              "h-1.5 rounded-full transition-all " +
              (idx === i ? "w-4 bg-foreground" : "w-1.5 bg-foreground/30")
            }
          />
        ))}
      </div>
    </div>
  );
}
