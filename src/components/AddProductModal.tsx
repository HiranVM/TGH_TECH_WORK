"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../services/api";
import Modal from "./Modal";
import { toast } from "react-toastify";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    tag: "",
    image: "",
    brand: "",
  });

  const mutation = useMutation({
    mutationFn: (data: any) => addProduct(data),
    onSuccess: (newProduct) => {
      // Since DummyJSON doesn't actually persist, we can't really re-fetch to see it.
      // But we can simulate UI feedback.
      toast.success("Product created successfully!");
      setFormData({
        title: "",
        price: "",
        tag: "",
        image: "",
        brand: "",
      });
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to create product: " + (error as Error).message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for API
    const payload = {
      title: formData.title,
      price: parseFloat(formData.price),
      brand: formData.brand,
      thumbnail: formData.image,
      tags: [formData.tag], // Wrap single tag in array
      // Add some defaults for required fields if needed, or api will handle
      description: "New product description",
      category: "general",
    };

    mutation.mutate(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="input"
            required
            placeholder="Product Title"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Price
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            className="input"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Brand
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, brand: e.target.value }))
            }
            className="input"
            required
            placeholder="Brand Name"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Tag
          </label>
          <input
            type="text"
            value={formData.tag}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tag: e.target.value }))
            }
            className="input"
            required
            placeholder="e.g. beauty"
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 500,
            }}
          >
            Image URL
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, image: e.target.value }))
            }
            className="input"
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
