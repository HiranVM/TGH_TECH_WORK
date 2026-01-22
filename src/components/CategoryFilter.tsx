"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories, Category } from "@/services/api";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div className="skeleton" style={{ width: "200px", height: "42px" }} />;

  return (
    <select
      className="input"
      style={{ width: "auto" }}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="">All Categories</option>
      {categories?.map((category: Category) => (
        <option key={category.slug} value={category.slug}>
          {category.name}
        </option>
      ))}
    </select>
  );
}
