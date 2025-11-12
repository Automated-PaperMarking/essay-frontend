"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Import createPortal
import { motion, AnimatePresence } from "framer-motion";

interface SideViewProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  width?: "md" | "lg" | "xl";
}

const widthClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
};

const SideView: React.FC<SideViewProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  width = "md",
}) => {
  // Manage body scroll when panel opens/closes
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

  // 4. Wrap your entire component JSX in createPortal
  // This teleports it to the document.body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 z-50 h-full w-full ${widthClasses[width]} overflow-y-auto bg-white p-6 shadow-lg`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "side-view-title" : undefined}
            aria-describedby={description ? "side-view-description" : undefined}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 p-1 transition-colors"
                aria-label="Close panel"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {title && (
              <h2
                id="side-view-title"
                className="text-xl font-semibold mb-2 pr-8"
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                id="side-view-description"
                className="text-gray-600 text-sm mb-4"
              >
                {description}
              </p>
            )}

            <div className="mt-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body // Teleport target
  );
};

export default SideView;
