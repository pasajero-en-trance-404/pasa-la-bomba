"use client";

import { motion } from "framer-motion";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}

export default function PrimaryButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: PrimaryButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-600/40 hover:shadow-xl hover:shadow-red-600/50"
      : variant === "danger"
        ? "bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/50"
        : "border border-white/10 bg-white/5 text-white backdrop-blur hover:bg-white/10";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`group relative w-full min-h-14 overflow-hidden rounded-2xl px-4 text-base font-semibold transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none ${styles} ${className}`}
    >
      {variant !== "ghost" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      )}
      <span className="relative flex w-full items-center justify-center py-3 text-center leading-snug">
        {children}
      </span>
    </motion.button>
  );
}
