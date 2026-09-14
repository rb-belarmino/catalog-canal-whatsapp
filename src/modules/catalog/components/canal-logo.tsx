import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils";

interface CanalLogoProps {
  className?: string;
  variant?: "dark" | "light";
}

/**
 * Official Canal Concept typographic SVG brand logo
 */
export function CanalLogo({ className, variant = "dark" }: CanalLogoProps) {
  const fillColor = variant === "dark" ? "#000000" : "#FFFFFF";

  return (
    <Link
      href="/"
      aria-label="Canal Concept - Página Inicial"
      className={cn("inline-flex items-center transition-opacity hover:opacity-85", className)}
    >
      <div className="flex flex-col items-center">
        {/* Geometric CANAL typographic wordmark */}
        <span
          className="text-xl sm:text-2xl font-black tracking-[7px] uppercase leading-none font-sans"
          style={{ color: fillColor }}
        >
          CANAL
        </span>
        <span
          className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[4px] uppercase text-neutral-500 mt-1"
        >
          CONCEPT
        </span>
      </div>
    </Link>
  );
}
