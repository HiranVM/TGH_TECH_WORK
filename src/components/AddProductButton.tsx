"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginRight: "1rem",
        }}
      >
        <Plus size={20} />
        <span>Add</span>
      </button>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
