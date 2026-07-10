"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ImageCardSkeletonProps {
  aspectRatio?: number;
}

export function ImageCardSkeleton({ aspectRatio = 1 }: ImageCardSkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mb-4 overflow-hidden rounded-card bg-surface shadow-sm">
      <div className="relative w-full" style={{ aspectRatio }}>
        <div
          className={`h-full w-full bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 ${
            prefersReducedMotion ? "" : "animate-pulse"
          }`}
        />
      </div>
    </div>
  );
}
