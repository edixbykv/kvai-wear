"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function WishlistButton({
  id,
  className,
  variant = "icon",
}: {
  id: string;
  className?: string;
  variant?: "icon" | "full";
}) {
  const { inWishlist, toggleWishlist, ready } = useStore();
  const { toast } = useToast();
  const active = ready && inWishlist(id);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    toast(active ? "Removed from wishlist" : "Added to wishlist");
  }

  if (variant === "full") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 border border-foreground/20 px-6 text-sm font-medium transition-colors hover:bg-muted",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", active && "fill-foreground")} />
        {active ? "Saved" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle wishlist"
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center bg-background/80 backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 transition-all", active ? "fill-foreground text-foreground" : "text-foreground/70")} />
    </button>
  );
}
