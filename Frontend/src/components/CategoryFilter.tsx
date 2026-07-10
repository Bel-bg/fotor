"use client";

import type { Category } from "@/types/graphql";

type CategoryFilterProps = {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          activeCategory === null
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        }`}
      >
        Tout
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === category.slug
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
