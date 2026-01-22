"use client";

import { useCart } from "@/providers/CartProvider";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { toggleDrawer, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggleDrawer}
      className="btn"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        marginRight: "1rem",
        color: "var(--foreground)",
      }}
      aria-label="Open Cart"
    >
      <ShoppingBag size={24} />
      {mounted && totalItems > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--card-bg)",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
