"use client";

import { motion } from "framer-motion";

interface GameCardProps {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "success" | "danger";
}

const TONES = {
  default: "border-white/10 bg-[#190b08]/85",
  success: "border-emerald-500/30 bg-emerald-950/85",
  danger: "border-rose-500/30 bg-rose-950/85",
} as const;

export default function GameCard({
  children,
  className = "",
  tone = "default",
}: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`relative rounded-3xl border p-6 shadow-2xl shadow-black/40 backdrop-blur-xl ${TONES[tone]} ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"
      />
      {children}
    </motion.div>
  );
}
