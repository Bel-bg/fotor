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
    <div className="flex flex-wrap gap-6">
      <FilterItem
        label="Tout"
        isActive={activeCategory === null}
        onClick={() => onSelect(null)}
      />

      {categories.map((category) => (
        <FilterItem
          key={category.id}
          label={category.name}
          isActive={activeCategory === category.slug}
          onClick={() => onSelect(category.slug)}
        />
      ))}
    </div>
  );
}

function FilterItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-1 text-sm font-medium transition-colors ${
        isActive ? "text-ink" : "text-ink-muted hover:text-ink"
      }`}
      aria-current={isActive}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent transition-transform duration-200 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </button>
  );
}