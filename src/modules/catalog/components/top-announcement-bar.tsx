'use client'

import * as React from 'react'

interface TopAnnouncementBarProps {
  announcement?: string
}

export function TopAnnouncementBar({
  announcement = 'CATÁLOGO DA CONSULTORA JÉSSICA LINDSEY'
}: TopAnnouncementBarProps) {
  const items = React.useMemo(() => {
    return announcement
      .split('|')
      .map(item => item.trim())
      .filter(Boolean)
  }, [announcement])

  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [items])

  if (items.length === 0) return null

  return (
    <div
      className="w-full bg-white border-b border-canal-border h-7 flex items-center justify-center px-4 overflow-hidden select-none"
      role="region"
      aria-label="Avisos e promoções"
    >
      <div className="relative w-full max-w-4xl text-center h-full flex items-center justify-center">
        {/* Mobile: Ticker cycling smoothly between items */}
        <div className="sm:hidden w-full flex items-center justify-center transition-opacity duration-300">
          <span className="text-[10px] tracking-[2px] font-normal uppercase text-black truncate">
            {items[currentIndex]}
          </span>
        </div>

        {/* Desktop: Horizontal list with bullet separators */}
        <div className="hidden sm:flex items-center justify-center gap-6 text-[10px] tracking-[2.2px] font-normal uppercase text-black">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-neutral-300">•</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
