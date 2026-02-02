export function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-5 bg-muted rounded w-2/3" />
      </div>
    </div>
  );
}
