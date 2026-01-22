"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "0.5rem", flex: "1", minWidth: "300px" }}
    >
      <input
        type="text"
        className="input"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
