"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface DialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  width?: "md" | "lg" | "xl"; // Accept only these three
}

const widthClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-7xl", // You can change this to max-w-3xl or larger if needed
};

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  width = "md", // Default to "md"
}) => {
  // Manage body scroll when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function to re-enable scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Don't render the portal on the server
  if (typeof window === "undefined") {
    return null;
  }

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className={`bg-white rounded-2xl max-h-[80vh] overflow-auto shadow-lg w-full ${widthClasses[width]} p-6 relative`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
        {title && (
          <h2 className="text-xl text-center font-semibold mb-2">{title}</h2>
        )}
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}
        {children}
      </motion.div>
    </div>,
    document.body
  );
};

export default Dialog;
