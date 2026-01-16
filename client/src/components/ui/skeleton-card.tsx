import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("rounded-md skeleton-shimmer", className)}
      data-testid="skeleton"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-card-border rounded-xl p-6 space-y-4" data-testid="skeleton-card">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

export function SkeletonScoreGauge() {
  return (
    <div className="flex flex-col items-center gap-4" data-testid="skeleton-score-gauge">
      <Skeleton className="w-48 h-24 rounded-t-full" />
      <Skeleton className="w-24 h-12 rounded-md" />
      <Skeleton className="w-40 h-8 rounded-full" />
    </div>
  );
}

export function SkeletonThumbnail() {
  return (
    <Skeleton className="w-64 h-36 rounded-lg" data-testid="skeleton-thumbnail" />
  );
}
