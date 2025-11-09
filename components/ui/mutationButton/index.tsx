"use client";
import React from "react";
import { Loader2 } from "lucide-react";

type MutationButtonProps = {
  onClick: () => void;
  children: React.ReactNode | string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
};

const MutationButton: React.FC<MutationButtonProps> = ({
  onClick,
  children,
  className = "",
  loading = false,
  disabled = false,
  loadingText,
}) => {
  const handleClick = () => {
    if (loading || disabled) return;
    onClick();
  };

  const isDisabled = loading || disabled;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={
        className
          ? className
          : `flex cursor-pointer items-center justify-center gap-2 my-2 px-4 py-2 rounded-sm text-white text-base transition
        bg-primary hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed`
      }
    >
      {loading && <Loader2 className="animate-spin h-4 w-4" />}
      {loading ? loadingText || "Loading..." : children}
    </button>
  );
};

export default MutationButton;
