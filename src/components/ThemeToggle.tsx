"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="btn"
        style={{
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
        }}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn"
      style={{
        border: "1px solid var(--border)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        backgroundColor: "var(--card-bg)",
        color: "var(--foreground)",
      }}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
