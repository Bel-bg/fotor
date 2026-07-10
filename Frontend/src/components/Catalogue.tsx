"use client";

import { useMemo, useState } from "react";
import { MasonryGrid } from "./MasonryGrid";
import { SkeletonGrid } from "./SkeletonGrid";
import { CategoryFilter } from "./CategoryFilter";
import { useInfiniteImages } from "@/hooks/useInfiniteImages";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import type { Category } from "@/types/graphql";
import Lightbox from "./Lightbox";
import { useSearchStore } from "@/store/useSearchStore";

export function Catalogue({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const search = useSearchStore((s) => s.query);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteImages({ category: activeCategory, search });

  const images = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const sentinelRef = useInfiniteScrollTrigger({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    enabled: !isLoading,
  });

  const selectedImage = useMemo(() => {
    if (activeImageIndex === null) return null;
    return images[activeImageIndex] ?? null;
  }, [activeImageIndex, images]);

  const handleNext = () => {
    if (activeImageIndex !== null && activeImageIndex < images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex !== null && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-6">
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={(cat) => {
            setActiveCategory(cat);
            setActiveImageIndex(null);
          }}
        />
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          Impossible de charger le catalogue.
        </p>
      )}

      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : (
        <>
          <MasonryGrid
            images={images}
            onImageClick={(index) => setActiveImageIndex(index)}
          />
          {isFetchingNextPage && <SkeletonGrid count={4} />}
        </>
      )}

      {/* Sentinelle invisible : dès qu'elle apparaît dans le viewport, on charge la page suivante */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {!hasNextPage && images.length > 0 && (
        <p className="py-4 text-center text-sm text-ink-muted/80">
          Pus aucune image disponible
        </p>
      )}

      {/* Lightbox d'affichage en grand */}
      {selectedImage && activeImageIndex !== null && (
        <Lightbox
          image={selectedImage}
          currentIndex={activeImageIndex}
          totalCount={images.length}
          onClose={() => setActiveImageIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
