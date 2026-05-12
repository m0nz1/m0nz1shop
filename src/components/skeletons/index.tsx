"use client";

import { cn } from "@/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-brutal",
        className
      )}
    />
  );
}

export function GameCardSkeleton() {
  return (
    <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-3">
      <Skeleton className="w-full aspect-[4/3] rounded-brutal mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <Skeleton className="w-full h-[200px] md:h-[300px] rounded-brutal" />
  );
}

export function TransactionSkeleton() {
  return (
    <div className="bg-brutal-light-card dark:bg-brutal-dark-card border-2 border-black dark:border-brutal-border-dark rounded-brutal shadow-brutal dark:shadow-brutal-dark p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
