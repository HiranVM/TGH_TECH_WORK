"use client";

import Link from "next/link";
import { Product } from "@/services/api";
import { useCart } from "@/providers/CartProvider";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1,
    });
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div 
        style={{
          backgroundColor: "var(--card-bg)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "var(--card-shadow)",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "var(--card-hover-shadow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--card-shadow)";
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingTop: "75%", backgroundColor: "#f3f4f6" }}>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        
        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--foreground)" }}>
              {product.title}
            </h3>
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--primary)" }}>
              ${product.price}
            </span>
          </div>
          
          <p style={{ 
            fontSize: "0.875rem", 
            color: "var(--secondary)", 
            marginBottom: "1.25rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1
          }}>
            {product.description}
          </p>
          
          <button 
            onClick={handleAddToCart}
            className="btn btn-primary"
            style={{ 
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
