"use client";

interface SortControlsProps {
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
}

export default function SortControls({ onSortChange }: SortControlsProps) {
  return (
    <select
      className="input"
      style={{ width: "auto" }}
      onChange={(e) => {
        const [sortBy, order] = e.target.value.split("-");
        onSortChange(sortBy, order as "asc" | "desc");
      }}
    >
      <option value="">Sort by: Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating-desc">Rating: High to Low</option>
      <option value="title-asc">Title: A-Z</option>
    </select>
  );
}
