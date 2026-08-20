export type Difficulty = "chill" | "normal" | "picante";

export type Phase = "passing" | "exploded";

export type CategoryId =
  | "mixta"
  | "animales"
  | "comida"
  | "lugares"
  | "argentina"
  | "cosas";

export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface GameStats {
  explosions: number;
  perPlayer: Record<string, number>;
}

export interface DifficultyInfo {
  id: Difficulty;
  emoji: string;
  name: string;
  description: string;
}

export interface CategoryInfo {
  id: CategoryId;
  emoji: string;
  name: string;
  description: string;
}

export const DIFFICULTIES: DifficultyInfo[] = [
  {
    id: "chill",
    emoji: "🧉",
    name: "Tranquila",
    description: "Más tiempo para pensar y pasar",
  },
  {
    id: "normal",
    emoji: "🔥",
    name: "Normal",
    description: "La mecha acorta y hay que moverse",
  },
  {
    id: "picante",
    emoji: "⚡",
    name: "Picante",
    description: "Poco tiempo, muchas risas, cero piedad",
  },
];

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "mixta",
    emoji: "🎲",
    name: "Mixta",
    description: "Un poco de todo, como tiene que ser",
  },
  {
    id: "animales",
    emoji: "🦁",
    name: "Animales",
    description: "Bichos, mascotas y bicharracos varios",
  },
  {
    id: "comida",
    emoji: "🍕",
    name: "Comida",
    description: "Platos, gustos y cosas que dan hambre",
  },
  {
    id: "lugares",
    emoji: "🗺️",
    name: "Lugares",
    description: "Países, ciudades, barrios y rincones",
  },
  {
    id: "argentina",
    emoji: "🇦🇷",
    name: "Argentina",
    description: "Costumbres, comidas y cosas bien nuestras",
  },
  {
    id: "cosas",
    emoji: "📦",
    name: "Cosas",
    description: "Objetos, tecnología y cosas de todos los días",
  },
];

export const ROUNDS_OPTIONS = [5, 10, 0] as const; // 0 = infinitas

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;

export const PLAYER_COLORS = [
  "#f59e0b",
  "#fb7185",
  "#38bdf8",
  "#34d399",
  "#a78bfa",
  "#fb923c",
  "#2dd4bf",
  "#e879f9",
  "#a3e635",
  "#22d3ee",
  "#f472b6",
  "#facc15",
];
