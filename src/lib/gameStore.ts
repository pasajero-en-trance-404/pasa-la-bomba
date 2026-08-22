import { useEffect, useSyncExternalStore } from "react";
import type {
  CategoryId,
  Difficulty,
  GameStats,
  Phase,
  Player,
} from "@/types/game";
import { MAX_PLAYERS, MIN_PLAYERS, PLAYER_COLORS } from "@/types/game";
import { allCategoryIds } from "./content";
import { drawBombTiming } from "./bombTiming";
import {
  buildPromptSource,
  drawFromDeck,
  shuffle,
} from "./gameLogic";

const STORAGE_KEY = "pasa-la-bomba:state";
const STORAGE_VERSION = 1;

interface StoreState {
  players: Player[];
  categories: CategoryId[];
  difficulty: Difficulty;
  roundsTotal: number; // cantidad total de bombas de la sesión
  playing: boolean;
  phase: Phase;
  turnIndex: number;
  round: number;
  startedAt: number;
  explodeAt: number;
  currentPrompt: string;
  promptDeck: string[];
  promptSource: string[];
  stats: GameStats;
}

function makeDefaultPlayers(): Player[] {
  return [0, 1, 2].map((i) => ({
    id: `p${i + 1}`,
    name: `Jugador ${i + 1}`,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
  }));
}

function emptyStats(): GameStats {
  return { explosions: 0, perPlayer: {} };
}

let state: StoreState = {
  players: makeDefaultPlayers(),
  categories: allCategoryIds(),
  difficulty: "normal",
  roundsTotal: 5,
  playing: false,
  phase: "passing",
  turnIndex: 0,
  round: 0,
  startedAt: 0,
  explodeAt: 0,
  currentPrompt: "",
  promptDeck: [],
  promptSource: [],
  stats: emptyStats(),
};

const listeners = new Set<() => void>();

let hydrated = false;

function readStorage(): Partial<StoreState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STORAGE_VERSION) return null;
    return parsed.state as Partial<StoreState>;
  } catch {
    return null;
  }
}

function writeStorage() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, state }),
    );
  } catch {
    // almacenamiento no disponible
  }
}

export function hydrate() {
  if (hydrated) return;
  hydrated = true;
  if (typeof window === "undefined") return;
  const saved = readStorage();
  if (!saved) return;
  state = { ...state, ...saved };

  if (state.categories.length === 0) state.categories = allCategoryIds();
  if (state.promptSource.length === 0) {
    state.promptSource = buildPromptSource(state.categories);
  }

  // Si se recargó después de la explosión, resolverla apenas vuelve.
  if (
    state.playing &&
    state.phase === "passing" &&
    state.explodeAt > 0 &&
    Date.now() >= state.explodeAt
  ) {
    state = explodeState(state);
  }

  if (state.playing && state.currentPrompt === "") {
    const { text, deck } = drawFromDeck(state.promptDeck, state.promptSource);
    state.currentPrompt = text;
    state.promptDeck = deck;
  }

  emit();
}

function emit() {
  writeStorage();
  for (const fn of listeners) fn();
}

let nextId = 4;
function makePlayer(name: string): Player {
  const color = PLAYER_COLORS[state.players.length % PLAYER_COLORS.length];
  return { id: `p${nextId++}`, name, color };
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return state;
}

export function getServerSnapshot() {
  return state;
}

export function useGameStore() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    hydrate();
  }, []);
  return value;
}

// ayuda de depuración: inspeccionar el estado desde la consola del navegador
if (typeof window !== "undefined") {
  (window as unknown as { __bomba?: { state: () => StoreState } }).__bomba = {
    state: () => state,
  };
}

// ---------- configuración ----------

export function addPlayer() {
  if (state.players.length >= MAX_PLAYERS || state.playing) return;
  state = {
    ...state,
    players: [
      ...state.players,
      makePlayer(`Jugador ${state.players.length + 1}`),
    ],
  };
  emit();
}

export function removePlayer() {
  if (state.players.length <= MIN_PLAYERS || state.playing) return;
  state = { ...state, players: state.players.slice(0, -1) };
  emit();
}

export function setPlayerCount(count: number) {
  if (state.playing) return;
  const target = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, count));
  const next = [...state.players];
  while (next.length < target) {
    next.push({
      id: `p${nextId++}`,
      name: `Jugador ${next.length + 1}`,
      color: PLAYER_COLORS[next.length % PLAYER_COLORS.length],
    });
  }
  state = { ...state, players: next.slice(0, target) };
  emit();
}

export function setPlayerName(index: number, name: string) {
  if (state.playing) return;
  const players = state.players.map((p, i) =>
    i === index ? { ...p, name } : p,
  );
  state = { ...state, players };
  emit();
}

export function setDifficulty(difficulty: Difficulty) {
  if (state.playing) return;
  state = { ...state, difficulty };
  emit();
}

export function toggleCategory(category: CategoryId) {
  if (state.playing) return;
  const active = state.categories.includes(category);
  if (active && state.categories.length === 1) return;
  const categories = active
    ? state.categories.filter((c) => c !== category)
    : [...state.categories, category];
  state = {
    ...state,
    categories,
    promptDeck: [],
    promptSource: buildPromptSource(categories),
  };
  emit();
}

export function setRounds(roundsTotal: number) {
  if (state.playing) return;
  state = { ...state, roundsTotal };
  emit();
}

// ---------- sesión ----------

function drawPrompt(current: StoreState): Pick<
  StoreState,
  "currentPrompt" | "promptDeck"
> {
  const { text, deck } = drawFromDeck(current.promptDeck, current.promptSource);
  return { currentPrompt: text, promptDeck: deck };
}

function startRound(current: StoreState, round: number, turnIndex: number) {
  const timing = drawBombTiming(current.difficulty);
  const prompt = drawPrompt(current);
  return {
    ...current,
    phase: "passing" as const,
    turnIndex,
    round,
    startedAt: timing.startedAt,
    explodeAt: timing.explodeAt,
    ...prompt,
  };
}

export function startGame() {
  if (state.players.length < MIN_PLAYERS) return;
  const promptSource = buildPromptSource(state.categories);
  const promptDeck = shuffle(promptSource);
  const firstTurn = Math.floor(Math.random() * state.players.length);
  state = startRound(
    {
      ...state,
      playing: true,
      round: 0,
      turnIndex: firstTurn,
      currentPrompt: "",
      promptDeck,
      promptSource,
      stats: emptyStats(),
    },
    1,
    firstTurn,
  );
  emit();
}

export function passBomb() {
  if (!state.playing || state.phase !== "passing") return;
  if (Date.now() >= state.explodeAt) {
    explode();
    return;
  }
  const turnIndex = (state.turnIndex + 1) % state.players.length;
  state = {
    ...state,
    turnIndex,
    ...drawPrompt(state),
  };
  emit();
}

function explodeState(current: StoreState): StoreState {
  const player = current.players[current.turnIndex];
  const perPlayer = { ...current.stats.perPlayer };
  if (player) perPlayer[player.id] = (perPlayer[player.id] ?? 0) + 1;
  return {
    ...current,
    phase: "exploded",
    stats: {
      explosions: current.stats.explosions + 1,
      perPlayer,
    },
  };
}

export function explode() {
  if (!state.playing || state.phase !== "passing") return;
  state = explodeState(state);
  emit();
}

/** ¿Se alcanzó el límite de rondas? Solo se resuelve después de una explosión. */
export function isSessionOver(): boolean {
  return (
    state.roundsTotal > 0 &&
    state.round >= state.roundsTotal &&
    state.phase === "exploded"
  );
}

export function nextRound() {
  if (!state.playing || state.phase !== "exploded" || isSessionOver()) return;
  const turnIndex = (state.turnIndex + 1) % state.players.length;
  state = startRound(state, state.round + 1, turnIndex);
  emit();
}

/** Sigue la fiesta sumando 5 bombas más (desde /result). */
export function continuePlaying() {
  state = {
    ...state,
    roundsTotal: Math.max(state.roundsTotal, state.round) + 5,
  };
  emit();
}

export function quitToSetup() {
  state = {
    ...state,
    playing: false,
    phase: "passing",
    turnIndex: 0,
    round: 0,
    startedAt: 0,
    explodeAt: 0,
    currentPrompt: "",
    promptDeck: [],
  };
  emit();
}

export function resetGame() {
  state = {
    ...state,
    players: makeDefaultPlayers(),
    difficulty: "normal",
    roundsTotal: 5,
    playing: false,
    phase: "passing",
    turnIndex: 0,
    round: 0,
    startedAt: 0,
    explodeAt: 0,
    currentPrompt: "",
    promptDeck: [],
    stats: emptyStats(),
  };
  emit();
}
