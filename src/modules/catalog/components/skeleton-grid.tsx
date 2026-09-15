export function SkeletonGrid() {
  return (
    <div
      aria-label="Carregando produtos"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-lg mx-auto sm:max-w-none"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-canal-border overflow-hidden animate-pulse flex flex-col justify-between"
        >
          {/* Image skeleton (3:4 ratio) */}
          <div className="w-full aspect-3/4 bg-neutral-200" />

          {/* Details skeleton */}
          <div className="p-3 sm:p-4 space-y-2.5">
            <div className="h-3 bg-neutral-200 w-4/5" />
            <div className="h-4 bg-neutral-200 w-1/2" />
            <div className="h-8 bg-neutral-200 w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  )
}
