"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
} from "../services/api";
import ProductCard from "./ProductCard";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import { Fragment } from "react";

interface ProductListProps {
  searchQuery: string;
  sortBy: string;
  order: "asc" | "desc";
  category: string;
}

export default function ProductList({
  searchQuery,
  sortBy,
  order,
  category,
}: ProductListProps) {
  const limit = 20;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
  queryKey: ["products", searchQuery, sortBy, order, category],
  queryFn: ({ pageParam = 0 }) => {
    if (searchQuery?.trim()) {
      return searchProducts(searchQuery, limit, pageParam as number);
    }

    if (category && category !== "all") {
      return fetchProductsByCategory(
        category,
        limit,
        pageParam as number,
        sortBy,
        order
      );
    }

    return fetchProducts(limit, pageParam as number, sortBy, order);
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
  refetchOnMount: true,
  refetchOnWindowFocus: false,
});


  if (status === "pending") {
    return (
      <div className="grid-layout">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "400px" }} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{ color: "var(--error)", textAlign: "center", padding: "2rem" }}
      >
        Error: {(error as Error).message}
      </div>
    );
  }

  if (data?.pages[0].products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        No products found.
      </div>
    );
  }

  return (
    <Fragment>
      <div className="grid-layout">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Fragment>
        ))}
      </div>

      <InfiniteScrollTrigger
        onIntersect={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
      />

      {isFetchingNextPage && (
        <div className="grid-layout">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "400px" }} />
          ))}
        </div>
      )}
    </Fragment>
  );
}
