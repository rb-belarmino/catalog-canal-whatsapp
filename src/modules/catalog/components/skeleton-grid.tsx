export function SkeletonGrid() {
  return (
    <div
      aria-label="Carregando produtos"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-xs animate-pulse flex flex-col"
        >
          {/* Image skeleton */}
          <div className="w-full aspect-3/4 bg-stone-200/70" />

          {/* Details skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-stone-200 rounded-md w-4/5" />
            <div className="h-4 bg-stone-200 rounded-md w-2/5" />
            <div className="h-9 bg-stone-200/80 rounded-xl w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
