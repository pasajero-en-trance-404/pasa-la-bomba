import type { CategoryId, Player } from "@/types/game";
import { promptsFor } from "./content";

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function buildPromptSource(categories: CategoryId[]): string[] {
  return promptsFor(categories);
}

export function buildPromptDeck(categories: CategoryId[]): string[] {
  return shuffle(buildPromptSource(categories));
}

/** Saca la próxima consigna del mazo; si se agotó, lo rebaraja. Sin repetir hasta vaciar. */
export function drawFromDeck(
  deck: string[],
  source: string[],
): { text: string; deck: string[] } {
  const current = deck.length > 0 ? deck : shuffle(source);
  const [text, ...rest] = current;
  return { text, deck: rest };
}

/** Jugador al que más veces le explotó la bomba. */
export function mostExplodedPlayer(
  players: Player[],
  perPlayer: Record<string, number>,
): { player: Player; count: number } | null {
  let best: { player: Player; count: number } | null = null;
  for (const p of players) {
    const count = perPlayer[p.id] ?? 0;
    if (count > 0 && (!best || count > best.count)) {
      best = { player: p, count };
    }
  }
  return best;
}
