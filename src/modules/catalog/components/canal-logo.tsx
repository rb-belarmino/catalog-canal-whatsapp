import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/shared/utils'

interface CanalLogoProps {
  className?: string
  variant?: 'dark' | 'light'
}

/**
 * Official Catalogo By Jessica Lindsey brand logo & consultant signature
 */
export function CanalLogo({ className, variant = 'dark' }: CanalLogoProps) {
  const primaryColor = variant === 'dark' ? 'text-black' : 'text-white'
  const subtitleColor =
    variant === 'dark' ? 'text-neutral-500' : 'text-neutral-400'

  return (
    <Link
      href="/"
      aria-label="Catálogo By Jéssica Lindsey - Consultora Canal Concept Anália Franco"
      className={cn(
        'inline-flex flex-col items-start justify-center transition-opacity hover:opacity-85 select-none',
        className
      )}
    >
      {/* Main Brand Title */}
      <span
        className={cn(
          'text-xs sm:text-sm md:text-[15px] font-bold tracking-[1.5px] sm:tracking-[2px] uppercase leading-tight font-sans',
          primaryColor
        )}
      >
        Catálogo By Jéssica Lindsey
      </span>

      {/* Subtitle */}
      <span
        className={cn(
          'text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium tracking-[0.8px] sm:tracking-[1.2px] uppercase mt-0.5',
          subtitleColor
        )}
      >
        Consultora Canal Concept - Anália Franco
      </span>
    </Link>
  )
}
