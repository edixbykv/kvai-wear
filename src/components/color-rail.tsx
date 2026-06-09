"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { COLOR_LIST, imagesFor } from "@/lib/products";

export function ColorRail() {
  return (
    <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:grid lg:grid-cols-11 lg:gap-3 lg:px-8">
      {COLOR_LIST.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
          className="shrink-0 snap-start"
        >
          <Link href={`/shop?color=${c.key}`} className="group block">
            <div className="product-surface relative aspect-[3/4] w-32 overflow-hidden lg:w-full">
              <Image
                src={imagesFor(c.key).front}
                alt={c.name}
                fill
                sizes="140px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              {c.name}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
