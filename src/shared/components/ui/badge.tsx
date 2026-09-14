import * as React from "react";
import { cn } from "@/shared/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "sale" | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-[1.5px] uppercase transition-colors select-none",
        {
          "bg-black text-white": variant === "default",
          "bg-neutral-100 text-neutral-800": variant === "secondary",
          "border border-black text-black bg-transparent": variant === "outline",
          "bg-black text-white font-bold": variant === "sale",
          "bg-[#FF005C] text-white": variant === "accent",
        },
        className
      )}
      {...props}
    />
  );
}
