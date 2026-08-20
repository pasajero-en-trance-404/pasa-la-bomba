"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import GameCard from "@/components/GameCard";
import PrimaryButton from "@/components/PrimaryButton";
import PlayersEditor from "@/components/PlayersEditor";
import DifficultySelector from "@/components/DifficultySelector";
import CategorySelector from "@/components/CategorySelector";
import { setRounds, startGame, useGameStore } from "@/lib/gameStore";
import { MIN_PLAYERS, ROUNDS_OPTIONS } from "@/types/game";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const section = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26 },
  },
};

function SectionHeader({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-xl">{emoji}</span>
      <div>
        <h2 className="font-display text-base font-semibold text-white">
          {title}
        </h2>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function SetupPage() {
  const { players, roundsTotal, categories } = useGameStore();
  const router = useRouter();

  const canStart = players.length >= MIN_PLAYERS && categories.length > 0;

  const start = () => {
    if (!canStart) return;
    startGame();
    router.push("/play");
  };

  return (
    <PageShell>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5"
      >
        <motion.div variants={section} className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm text-zinc-300 transition-colors hover:bg-white/10"
            aria-label="Volver"
          >
            ←
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Armá la ronda
            </h1>
            <p className="text-xs text-zinc-500">
              Prepará todo antes de encender la mecha 💣
            </p>
          </div>
        </motion.div>

        <motion.div variants={section}>
          <SectionHeader
            emoji="👥"
            title="Jugadores"
            subtitle="¿Quiénes se animan a pasar la bomba?"
          />
          <GameCard>
            <PlayersEditor />
          </GameCard>
        </motion.div>

        <motion.div variants={section}>
          <SectionHeader
            emoji="🔥"
            title="Dificultad"
            subtitle="¿Cuánto tiempo tienen para pensar?"
          />
          <DifficultySelector />
        </motion.div>

        <motion.div variants={section}>
          <SectionHeader
            emoji="🎲"
            title="Categorías"
            subtitle="Elegí de dónde salen las consignas"
          />
          <CategorySelector />
        </motion.div>

        <motion.div variants={section}>
          <SectionHeader
            emoji="💥"
            title="Explosiones"
            subtitle="¿Cuántas bombas aguanta la mesa?"
          />
          <div className="grid grid-cols-3 gap-2">
            {ROUNDS_OPTIONS.map((r) => {
              const active = roundsTotal === r;
              return (
                <motion.button
                  key={r}
                  onClick={() => setRounds(r)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  className={`min-h-12 rounded-2xl border text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "border-orange-400/70 bg-orange-500/10 text-orange-200 shadow-lg shadow-orange-600/20"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {r === 0 ? "∞" : r}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={section} className="mt-1 pb-4">
          <PrimaryButton onClick={start} disabled={!canStart}>
            🧨 Encender la mecha
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
