import * as React from 'react'
import { cn } from '@/shared/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
          {
            'bg-black text-white hover:bg-neutral-800 active:scale-[0.99] uppercase text-xs tracking-[1.8px]':
              variant === 'default',
            'border border-canal-border bg-white text-black hover:bg-neutral-50 active:scale-[0.99] uppercase text-xs tracking-[1.8px]':
              variant === 'outline',
            'hover:bg-neutral-100 text-black': variant === 'ghost',
            'bg-neutral-100 text-black hover:bg-neutral-200':
              variant === 'secondary',
            'text-black underline-offset-4 hover:underline p-0 h-auto':
              variant === 'link'
          },
          {
            'h-11 px-5 py-2': size === 'default',
            'h-8 px-3 text-[11px]': size === 'sm',
            'h-12 px-8 text-sm': size === 'lg',
            'h-9 w-9 p-0': size === 'icon'
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
