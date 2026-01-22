"use client";


import { useCart } from "@/providers/CartProvider";

export default function CartDrawer() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    isDrawerOpen, 
    toggleDrawer, 
    totalAmount 
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "var(--card-bg)",
        boxShadow: "-4px 0 15px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Shopping Cart</h2>
        <button onClick={toggleDrawer} style={{ fontSize: "1.5rem" }}>&times;</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
        {cartItems.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--secondary)", marginTop: "2rem" }}>Your cart is empty.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img src={item.image} alt={item.title} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "0.25rem" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "0.875rem", fontWeight: "600" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: "bold" }}>${item.price}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn" style={{ padding: "0.25rem 0.5rem", border: "1px solid var(--border)" }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn" style={{ padding: "0.25rem 0.5rem", border: "1px solid var(--border)" }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--error)", fontSize: "1.25rem" }}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontWeight: "bold" }}>
          <span>Total:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", padding: "1rem" }} disabled={cartItems.length === 0}>
          Checkout
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
