"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchProduct, deleteProduct } from "@/services/api";
import { useCart } from "@/providers/CartProvider";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Package, ShieldCheck, Truck, RotateCcw, Barcode, QrCode, Edit2, Trash2 } from "lucide-react";
import EditProductModal from "@/components/EditProductModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: !!id,
  });

  // Set initial selected image when product data is loaded
  useEffect(() => {
    if (product && !selectedImage) {
      setSelectedImage(product.images[0] || product.thumbnail);
    }
  }, [product, selectedImage]);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(id as string),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      router.push("/");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + (error as Error).message);
    },
  });

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <div className="skeleton" style={{ height: "400px", maxWidth: "800px", margin: "0 auto" }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--error)" }}>
        <h2>Product not found</h2>
        <button onClick={() => router.push("/")} className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: quantity,
    });
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomRef.current || !imgRef.current) return;
    
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
    imgRef.current.style.transform = "scale(2.5)";
  };

  const handleMouseLeave = () => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = "scale(1)";
    imgRef.current.style.transformOrigin = "center";
  };

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <button 
          onClick={() => router.back()}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem", 
            background: "none", 
            border: "none", 
            color: "var(--secondary)", 
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          <ArrowLeft size={20} /> Back to products
        </button>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="btn"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              border: "1px solid var(--border)",
              backgroundColor: "white",
              color: "var(--primary)"
            }}
          >
            <Edit2 size={18} /> Edit
          </button>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="btn"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              border: "1px solid #fee2e2",
              backgroundColor: "#fef2f2",
              color: "#ef4444"
            }}
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
        gap: "4rem",
        alignItems: "start"
      }}>
        {/* Product Images Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Main Image with Zoom */}
          <div 
            ref={zoomRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              backgroundColor: "#f3f4f6", 
              borderRadius: "1rem", 
              overflow: "hidden",
              boxShadow: "var(--card-shadow)",
              cursor: "zoom-in",
              position: "relative",
              aspectRatio: "1/1"
            }}
          >
            <img 
              ref={imgRef}
              src={selectedImage} 
              alt={product.title} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "contain",
                display: "block",
                transition: "transform 0.1s ease-out"
              }} 
            />
          </div>

          {/* Thumbnails */}
          <div style={{ 
            display: "flex", 
            gap: "0.75rem", 
            overflowX: "auto", 
            padding: "0.5rem 0",
            scrollbarWidth: "none"
          }}>
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border: selectedImage === img ? "2px solid var(--primary)" : "2px solid transparent",
                  padding: 0,
                  flexShrink: 0,
                  cursor: "pointer",
                  backgroundColor: "#f3f4f6",
                  transition: "all 0.2s"
                }}
              >
                <img 
                  src={img} 
                  alt={`${product.title} thumbnail ${idx}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              <span style={{ 
                backgroundColor: "var(--primary-light)", 
                color: "var(--primary)", 
                padding: "0.25rem 0.75rem", 
                borderRadius: "2rem", 
                fontSize: "0.875rem", 
                fontWeight: "600",
                textTransform: "capitalize"
              }}>
                {product.category}
              </span>
              {product.tags?.map(tag => (
                <span key={tag} style={{ 
                  backgroundColor: "#f3f4f6", 
                  color: "var(--secondary)", 
                  padding: "0.25rem 0.75rem", 
                  borderRadius: "2rem", 
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}>
                  #{tag}
                </span>
              ))}
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginTop: "0.75rem", lineHeight: "1.1" }}>
              {product.title}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#fbbf24" }}>
              <Star size={18} fill="#fbbf24" />
              <span style={{ fontWeight: "bold", color: "var(--foreground)" }}>{product.rating}</span>
            </div>
            <span style={{ color: "var(--secondary)" }}>|</span>
            <span style={{ color: "var(--secondary)" }}>{product.brand}</span>
            <span style={{ color: "var(--secondary)" }}>|</span>
            <span style={{ color: "var(--secondary)" }}>SKU: {product.sku}</span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: "800", color: "var(--primary)" }}>
              ${product.price}
            </span>
            {product.discountPercentage > 0 && (
              <span style={{ 
                color: "#ef4444", 
                fontSize: "1.125rem", 
                fontWeight: "600",
                backgroundColor: "#fef2f2",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem"
              }}>
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem",
            color: product.stock > 0 ? "#10b981" : "#ef4444",
            fontWeight: "600",
            fontSize: "1rem"
          }}>
            <div style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%", 
              backgroundColor: product.stock > 0 ? "#10b981" : "#ef4444",
              animation: product.stock > 0 ? "pulse 2s infinite" : "none"
            }} />
            {product.availabilityStatus} ({product.stock} units)
          </div>

          <p style={{ color: "var(--secondary)", fontSize: "1.125rem", lineHeight: "1.6" }}>
            {product.description}
          </p>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                backgroundColor: "var(--background)", 
                border: "1px solid var(--border)", 
                borderRadius: "0.75rem",
                padding: "0.5rem"
              }}>
                <button 
                  onClick={decrementQuantity}
                  style={{ padding: "0.5rem", background: "none", border: "none", cursor: "pointer" }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ minWidth: "3rem", textAlign: "center", fontWeight: "bold", fontSize: "1.125rem" }}>
                  {quantity}
                </span>
                <button 
                  onClick={incrementQuantity}
                  style={{ padding: "0.5rem", background: "none", border: "none", cursor: "pointer" }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn btn-primary"
                style={{ 
                  flex: 1, 
                  minWidth: "200px",
                  height: "3.5rem", 
                  fontSize: "1.125rem", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.75rem" 
                }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
            {product.minimumOrderQuantity > 1 && (
              <p style={{ fontSize: "0.875rem", color: "var(--secondary)", marginTop: "0.75rem" }}>
                * Minimum order quantity: {product.minimumOrderQuantity}
              </p>
            )}
          </div>
        </div>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={product} 
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        itemName={product.title}
        isDeleting={deleteMutation.isPending}
      />

      {/* Grid for Extended Details */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2rem", 
        marginTop: "4rem",
        borderTop: "1px solid var(--border)",
        paddingTop: "4rem"
      }}>
        {/* Specifications */}
        <section style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Package size={20} color="var(--primary)" /> Specifications
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}>
              <span style={{ color: "var(--secondary)" }}>Weight:</span>
              <span style={{ fontWeight: "500" }}>{product.weight}g</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}>
              <span style={{ color: "var(--secondary)" }}>Width:</span>
              <span style={{ fontWeight: "500" }}>{product.dimensions?.width}mm</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}>
              <span style={{ color: "var(--secondary)" }}>Height:</span>
              <span style={{ fontWeight: "500" }}>{product.dimensions?.height}mm</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}>
              <span style={{ color: "var(--secondary)" }}>Depth:</span>
              <span style={{ fontWeight: "500" }}>{product.dimensions?.depth}mm</span>
            </div>
          </div>
        </section>

        {/* Shipping & Warranty */}
        <section style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} color="var(--primary)" /> Policy & Shipping
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <Truck size={18} color="var(--primary)" style={{ marginTop: "0.25rem" }} />
              <div>
                <p style={{ fontWeight: "600", fontSize: "0.9375rem", margin: 0 }}>Shipping Info</p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary)", margin: "0.25rem 0 0" }}>{product.shippingInformation}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <ShieldCheck size={18} color="var(--primary)" style={{ marginTop: "0.25rem" }} />
              <div>
                <p style={{ fontWeight: "600", fontSize: "0.9375rem", margin: 0 }}>Warranty</p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary)", margin: "0.25rem 0 0" }}>{product.warrantyInformation}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <RotateCcw size={18} color="var(--primary)" style={{ marginTop: "0.25rem" }} />
              <div>
                <p style={{ fontWeight: "600", fontSize: "0.9375rem", margin: 0 }}>Return Policy</p>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary)", margin: "0.25rem 0 0" }}>{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand & Meta */}
        <section style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Barcode size={20} color="var(--primary)" /> Manufacturer Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "var(--secondary)", fontSize: "0.875rem", margin: 0 }}>Barcode</p>
                <p style={{ fontWeight: "600", margin: "0.25rem 0 0" }}>{product.meta?.barcode}</p>
              </div>
              {product.meta?.qrCode && (
                <div style={{ textAlign: "right" }}>
                  <img src={product.meta.qrCode} alt="Product QR Code" style={{ width: "60px", height: "60px", borderRadius: "0.25rem" }} />
                  <p style={{ fontSize: "0.75rem", color: "var(--secondary)", marginTop: "0.25rem" }}>QR Code</p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9375rem" }}>
              <span style={{ color: "var(--secondary)" }}>Last Updated:</span>
              <span style={{ fontWeight: "500" }}>{new Date(product.meta?.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Customer Reviews */}
      <section style={{ marginTop: "4rem" }}>
        <h3 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
          Customer Reviews
        </h3>
        {product.reviews?.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {product.reviews.map((review, idx) => (
              <div key={idx} style={{ 
                backgroundColor: "var(--card-bg)", 
                padding: "1.5rem", 
                borderRadius: "1rem", 
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.25rem", color: "#fbbf24" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "#fbbf24" : "none"} stroke={i < review.rating ? "none" : "#fbbf24"} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--secondary)" }}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: "1rem", fontWeight: "500", fontStyle: "italic", margin: 0 }}>"{review.comment}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "auto" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>
                    {review.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: "700", margin: 0 }}>{review.reviewerName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--secondary)", margin: 0 }}>{review.reviewerEmail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--secondary)", padding: "2rem" }}>No reviews yet for this product.</p>
        )}
      </section>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
