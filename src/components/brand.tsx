import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const inner = (
    <span className={cn("font-display text-2xl font-semibold tracking-[0.3em] leading-none", className)}>
      KVAI
    </span>
  );
  if (href === null) return inner;
  return (
    <Link href={href} aria-label="KVAI Wear home" className="inline-flex items-baseline gap-2">
      {inner}
      <span className="hidden text-[9px] font-medium uppercase tracking-luxe text-muted-foreground sm:inline">
        Wear
      </span>
    </Link>
  );
}
