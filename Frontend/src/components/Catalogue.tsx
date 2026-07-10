"use client";

import { useMemo, useState } from "react";
import { MasonryGrid } from "./MasonryGrid";
import { CategoryFilter } from "./CategoryFilter";
import { useInfiniteImages } from "@/hooks/useInfiniteImages";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger";
import type { Category } from "@/types/graphql";

export function Catalogue({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteImages({ category: activeCategory });

  const images = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const sentinelRef = useInfiniteScrollTrigger({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    enabled: !isLoading,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {isError && (
        <p className="text-sm text-red-600">
          Impossible de charger le catalogue. Vérifie que le backend GraphQL
          tourne bien.
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement...</p>
      ) : (
        <MasonryGrid images={images} />
      )}

      {/* Sentinelle invisible : dès qu'elle apparaît dans le viewport, on charge la page suivante */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {isFetchingNextPage && (
        <p className="py-4 text-center text-sm text-neutral-500">
          Chargement de plus d&apos;images...
        </p>
      )}

      {!hasNextPage && images.length > 0 && (
        <p className="py-4 text-center text-sm text-neutral-400">
          Tu as atteint la fin du catalogue 🎉
        </p>
      )}
    </div>
  );
}
