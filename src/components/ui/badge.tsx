import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-foreground px-2.5 py-1 text-[10px] font-medium uppercase tracking-luxe text-background",
        className,
      )}
      {...props}
    />
  );
}
