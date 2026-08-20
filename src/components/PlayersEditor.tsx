"use client";

import { motion, AnimatePresence } from "framer-motion";
import { setPlayerCount, setPlayerName, useGameStore } from "@/lib/gameStore";
import Counter from "./Counter";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/types/game";

export default function PlayersEditor() {
  const { players } = useGameStore();

  return (
    <div className="flex flex-col gap-4">
      <Counter
        label="Jugadores"
        value={players.length}
        min={MIN_PLAYERS}
        max={MAX_PLAYERS}
        onChange={setPlayerCount}
      />
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -12, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 12, height: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: `${p.color}40`, color: p.color }}
              >
                {i + 1}
              </motion.span>
              <input
                value={p.name}
                onChange={(e) => setPlayerName(i, e.target.value)}
                placeholder={`Jugador ${i + 1}`}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-500 focus:bg-white/10"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
