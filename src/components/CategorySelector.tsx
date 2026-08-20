"use client";

import { motion } from "framer-motion";
import { toggleCategory, useGameStore } from "@/lib/gameStore";
import { CATEGORIES } from "@/types/game";

export default function CategorySelector() {
  const { categories } = useGameStore();

  return (
    <div className="grid grid-cols-2 gap-2">
      {CATEGORIES.map((c) => {
        const active = categories.includes(c.id);
        return (
          <motion.button
            key={c.id}
            onClick={() => toggleCategory(c.id)}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className={`rounded-2xl border p-3 text-left transition-colors duration-200 ${
              active
                ? "border-orange-400/70 bg-orange-500/10 shadow-lg shadow-orange-600/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="mb-1 block text-xl">{c.emoji}</span>
            <span className="block text-sm font-semibold text-white">
              {c.name}
            </span>
            <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500">
              {c.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
