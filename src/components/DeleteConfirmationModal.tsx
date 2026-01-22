"use client";

import Modal from "@/components/Modal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <p style={{ fontSize: "1.1rem", color: "var(--foreground)" }}>
          Are you sure you want to delete <strong>{itemName}</strong>? <br />
          <span style={{ fontSize: "0.9rem", color: "var(--error)" }}>
            This action cannot be undone.
          </span>
        </p>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          <button
            onClick={onClose}
            className="btn"
            style={{
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              background: "var(--error)",
              color: "white",
              border: "none",
              opacity: isDeleting ? 0.7 : 1,
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
