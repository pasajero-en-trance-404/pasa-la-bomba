"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  explode,
  isSessionOver,
  nextRound,
  passBomb,
  quitToSetup,
  useGameStore,
} from "@/lib/gameStore";
import { bombProgress } from "@/lib/bombTiming";
import { play } from "@/lib/sound";
import GameCard from "./GameCard";
import PrimaryButton from "./PrimaryButton";

function TimeBar() {
  const { startedAt, explodeAt, phase } = useGameStore();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = bombProgress(startedAt, explodeAt);
      const el = bar.current;
      if (el) {
        el.style.transform = `scaleX(${1 - p})`;
        el.style.background =
          p > 0.82
            ? "linear-gradient(90deg,#ef4444,#dc2626)"
            : p > 0.55
              ? "linear-gradient(90deg,#f97316,#ef4444)"
              : "linear-gradient(90deg,#fbbf24,#f97316)";
      }
      if (phase === "passing") raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startedAt, explodeAt, phase]);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        ref={bar}
        className="h-full w-full origin-left rounded-full"
        style={{ transform: "scaleX(1)" }}
      />
    </div>
  );
}

export default function BombHUD() {
  const {
    phase,
    players,
    turnIndex,
    currentPrompt,
    round,
    roundsTotal,
    explodeAt,
  } = useGameStore();
  const router = useRouter();

  const holder = players[turnIndex];

  // Explosión confiable al acabarse el tiempo, sin depender del loop del Canvas.
  useEffect(() => {
    if (phase !== "passing" || !explodeAt) return;
    const delay = Math.max(0, explodeAt - Date.now());
    const id = window.setTimeout(() => {
      explode();
    }, delay);
    return () => window.clearTimeout(id);
  }, [phase, explodeAt]);

  const continueAfterExplosion = () => {
    play("next");
    if (isSessionOver()) {
      router.push("/result");
      return;
    }
    nextRound();
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5">
      {/* barra superior */}
      <div className="flex items-center justify-between">
        <div className="rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-semibold text-orange-100 backdrop-blur">
          💣 Bomba {round}
          {roundsTotal > 0 ? ` / ${roundsTotal}` : ""}
        </div>
        <button
          onClick={() => {
            quitToSetup();
            router.push("/setup");
          }}
          className="pointer-events-auto rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-semibold text-zinc-300 backdrop-blur transition-colors hover:bg-black/70"
        >
          ✕ Salir
        </button>
      </div>

      {/* zona inferior */}
      <div className="flex flex-col items-center gap-3 pb-3">
        <AnimatePresence mode="wait">
          {phase === "passing" && holder && (
            <motion.div
              key="passing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <GameCard className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                      La tiene
                    </p>
                    <p
                      className="font-display text-xl font-bold"
                      style={{ color: holder.color }}
                    >
                      {holder.name}
                    </p>
                  </div>
                  <span className="animate-pulse-soft text-3xl">💣</span>
                </div>

                <p className="mb-4 font-display text-lg font-semibold leading-snug text-white">
                  {currentPrompt}
                </p>

                <div className="mb-4">
                  <TimeBar />
                </div>

                <PrimaryButton
                  onClick={() => {
                    play("pass");
                    passBomb();
                  }}
                >
                  ➡️ Respondí, ¡pasala!
                </PrimaryButton>
              </GameCard>
            </motion.div>
          )}

          {phase === "exploded" && holder && (
            <motion.div
              key="exploded"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-4"
            >
              <motion.span
                initial={{ scale: 0.4, rotate: -18 }}
                animate={{ scale: [0.4, 1.25, 1], rotate: [-18, 8, 0] }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="text-7xl"
              >
                💥
              </motion.span>
              <GameCard tone="danger" className="w-full text-center">
                <p className="text-sm text-rose-100/70">Le explotó a</p>
                <p
                  className="mt-1 font-display text-3xl font-bold"
                  style={{ color: holder.color }}
                >
                  ¡{holder.name}!
                </p>
                <p className="mt-2 text-xs text-zinc-400">
                  La bomba no perdona 😅
                </p>
              </GameCard>
              <div className="w-full max-w-xs">
                <PrimaryButton onClick={continueAfterExplosion}>
                  {isSessionOver() ? "Ver resultado 🏁" : "Siguiente bomba ▶"}
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
