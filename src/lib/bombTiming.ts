import type { Difficulty } from "@/types/game";

interface BombWindow {
  minMs: number;
  maxMs: number;
}

const WINDOWS: Record<Difficulty, BombWindow> = {
  chill: { minMs: 18_000, maxMs: 32_000 },
  normal: { minMs: 12_000, maxMs: 24_000 },
  picante: { minMs: 7_000, maxMs: 16_000 },
};

export interface BombTiming {
  startedAt: number;
  explodeAt: number;
  durationMs: number;
}

/** Sortea cuándo explota la bomba. El resultado queda guardado: la animación es determinista. */
export function drawBombTiming(
  difficulty: Difficulty,
  now = Date.now(),
): BombTiming {
  const { minMs, maxMs } = WINDOWS[difficulty];
  const durationMs = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  return {
    startedAt: now,
    explodeAt: now + durationMs,
    durationMs,
  };
}

export function remainingMs(explodeAt: number, now = Date.now()): number {
  return Math.max(0, explodeAt - now);
}

/** 0 = recién empieza, 1 = explota. */
export function bombProgress(
  startedAt: number,
  explodeAt: number,
  now = Date.now(),
): number {
  const total = Math.max(1, explodeAt - startedAt);
  const done = Math.min(total, Math.max(0, now - startedAt));
  return done / total;
}
