"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct, Product } from "@/services/api";
import Modal from "@/components/Modal";

import { toast } from "react-toastify";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
}: EditProductModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: product.title,
    price: product.price,
    description: product.description,
    brand: product.brand,
  });

  // Reset form when product changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        brand: product.brand,
      });
    }
  }, [isOpen, product]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Product>) =>
      updateProduct(product.id.toString(), data),
    onSuccess: (updatedProduct) => {
      // In a real app we would update the cache with returned data
      // Since DumnmyJSON doesn't actually persist, we simulate it or just let the user know

      // Optimistically update or invalidate query
      // queryClient.invalidateQueries({ queryKey: ['product', product.id.toString()] });

      // For demo purposes, we can manually set query data to show the update locally
      queryClient.setQueryData(
        ["product", product.id.toString()],
        (oldData: Product) => ({
          ...oldData,
          ...updatedProduct,
          // Ensure form data sticks if API return is partial or mocked
          title: formData.title,
          price: formData.price,
          description: formData.description,
          brand: formData.brand,
        }),
      );

      toast.success(`Product ${product.id} updated successfully!`);
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update product: " + (error as Error).message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
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
              setFormData((prev) => ({
                ...prev,
                price: parseFloat(e.target.value),
              }))
            }
            className="input"
            required
            min="0"
            step="0.01"
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
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="input"
            style={{ minHeight: "100px", resize: "vertical" }}
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
            {mutation.isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
