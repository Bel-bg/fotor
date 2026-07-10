"use client";

import Masonry from "react-masonry-css";
import { ImageCard } from "./ImageCard";
import type { FotorImage } from "@/types/graphql";

const BREAKPOINT_COLUMNS = {
  default: 4,
  1280: 4,
  1024: 3,
  768: 2,
  500: 2,
};

export function MasonryGrid({ images }: { images: FotorImage[] }) {
  return (
    <Masonry
      breakpointCols={BREAKPOINT_COLUMNS}
      className="flex w-full gap-4"
      columnClassName="flex flex-col"
    >
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </Masonry>
  );
}
