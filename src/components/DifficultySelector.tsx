"use client";

import { motion } from "framer-motion";
import { setDifficulty, useGameStore } from "@/lib/gameStore";
import { DIFFICULTIES } from "@/types/game";

export default function DifficultySelector() {
  const { difficulty } = useGameStore();

  return (
    <div className="flex flex-col gap-2">
      {DIFFICULTIES.map((d) => {
        const active = difficulty === d.id;
        return (
          <motion.button
            key={d.id}
            onClick={() => setDifficulty(d.id)}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ${
              active
                ? "border-orange-400/70 bg-orange-500/10 shadow-lg shadow-orange-600/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="text-2xl">{d.emoji}</span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-white">
                {d.name}
              </span>
              <span className="block text-xs text-zinc-400">
                {d.description}
              </span>
            </span>
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                active
                  ? "border-orange-400 bg-orange-500 text-black"
                  : "border-white/20 text-transparent"
              }`}
            >
              ✓
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
