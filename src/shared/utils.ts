import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines Tailwind CSS class names safely with duplicate removal.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats integer cents into Brazilian Real (BRL) string.
 * Example: 18990 -> "R$ 189,90"
 */
export function formatCurrencyBRL(cents: number): string {
  const amount = cents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

/**
 * Parses user input string (e.g. "189,90" or "189.90") into integer cents.
 * Returns null if invalid or <= 0.
 */
export function parseBRLToCents(val: string): number | null {
  if (!val) return null
  const sanitized = val.replace(/\s+/g, '').replace('R$', '').trim()
  const normalized = sanitized.replace('.', '').replace(',', '.')
  const num = parseFloat(normalized)
  if (isNaN(num) || num <= 0) return null
  return Math.round(num * 100)
}
