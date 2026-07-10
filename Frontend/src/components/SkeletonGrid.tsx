"use client";

import Masonry from "react-masonry-css";
import { ImageCardSkeleton } from "./ImageCardSkeleton";

const BREAKPOINT_COLUMNS = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  500: 2,
};

interface SkeletonGridProps {
  count?: number;
}

// Génère un aspect ratio aléatoire entre 0.7 et 1.4
function getRandomAspectRatio(): number {
  return Math.random() * 0.7 + 0.7;
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <Masonry
      breakpointCols={BREAKPOINT_COLUMNS}
      className="flex w-full gap-4"
      columnClassName="flex flex-col"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ImageCardSkeleton key={index} aspectRatio={getRandomAspectRatio()} />
      ))}
    </Masonry>
  );
}
