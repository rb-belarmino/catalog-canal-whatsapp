"use client";

import * as React from "react";
import { Search, Heart, X } from "lucide-react";
import { CanalLogo } from "./canal-logo";
import { useSearch } from "../search-context";
import { useWishlist } from "@/modules/wishlist/context";

export function CanalHeader() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { totalCount, setIsDrawerOpen } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  function handleOpenSearch() {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  }

  function handleClearSearch() {
    setSearchQuery("");
    setIsSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E2E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <CanalLogo />
        </div>

        {/* Center / Right: Desktop Search Field */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="BUSCAR NO CATÁLOGO..."
              className="w-full bg-transparent border-b border-[#E2E2E2] focus:border-black pl-6 pr-6 py-1.5 text-[11px] tracking-[2px] uppercase text-black placeholder:text-neutral-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black cursor-pointer"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions (Mobile search trigger & Wishlist Bag button) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="md:hidden p-2 text-neutral-700 hover:text-black cursor-pointer"
            aria-label="Abrir pesquisa"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Lista de Desejos Trigger */}
          <button
            type="button"
            data-testid="wishlist-trigger"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 text-black hover:opacity-80 transition-opacity cursor-pointer select-none"
            aria-label={`Abrir Lista de Desejos com ${totalCount} itens`}
          >
            <div className="relative">
              <Heart className="w-5 h-5 sm:w-5 sm:h-5 text-black" strokeWidth={1.75} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-[11px] tracking-[2px] uppercase font-medium">
              Desejos {totalCount > 0 && `(${totalCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Full-Width Overlay */}
      {isSearchOpen && (
        <div className="md:hidden border-t border-[#E2E2E2] bg-white px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="BUSCAR NO CATÁLOGO..."
            className="flex-1 bg-transparent border-none text-[12px] tracking-[1.8px] uppercase text-black placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClearSearch}
            className="p-1 text-neutral-400 hover:text-black"
            aria-label="Fechar busca"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
