"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CounterProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: CounterProps) {
  const btn =
    "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-2xl text-white transition-colors duration-150";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <div className="flex items-center gap-4">
        <motion.button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          whileTap={value <= min ? undefined : { scale: 0.85 }}
          aria-label="Menos"
          className={`${btn} hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none`}
        >
          <span className="relative">−</span>
        </motion.button>
        <div className="relative w-10 overflow-hidden text-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="block font-display text-3xl font-bold tabular-nums text-white"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          whileTap={value >= max ? undefined : { scale: 0.85 }}
          aria-label="Más"
          className={`${btn} hover:border-orange-500/60 hover:bg-orange-600/25 hover:text-orange-100 disabled:opacity-25 disabled:pointer-events-none`}
        >
          <span className="relative">+</span>
        </motion.button>
      </div>
    </div>
  );
}
