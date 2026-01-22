import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/providers/TanstackProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { CartProvider } from "@/providers/CartProvider";
import CartIcon from "@/components/CartIcon";
import CartDrawer from "../components/CartDrawer";
import AddProductButton from "@/components/AddProductButton";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium E-Commerce",
  description: "A premium product listing experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <TanstackProvider>
            <CartProvider>
              <div className="container">
                <header
                  style={{
                    padding: "2rem 0",
                    marginBottom: "2rem",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Premium Store
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <AddProductButton />
                    <CartIcon />
                    <ThemeToggle />
                  </div>
                </header>
                <CartDrawer />
                <main>{children}</main>
                <ToastContainer position="bottom-right" theme="colored" />
              </div>
            </CartProvider>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
