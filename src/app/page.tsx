"use client";

import { useState } from "react";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import SortControls from "../components/SortControls";
import CategoryFilter from "../components/CategoryFilter";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCategory(""); // Clear category on search
  };

  const handleSortChange = (newSortBy: string, newOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearchQuery(""); // Clear search on category select
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: "300px" }}>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <CategoryFilter onCategoryChange={handleCategoryChange} />
          <SortControls onSortChange={handleSortChange} />
        </div>
      </div>
      <ProductList
        searchQuery={searchQuery}
        sortBy={sortBy}
        order={order}
        category={category}
      />
    </div>
  );
}
