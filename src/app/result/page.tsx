"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import GameCard from "@/components/GameCard";
import PrimaryButton from "@/components/PrimaryButton";
import Confetti from "@/components/Confetti";
import {
  continuePlaying,
  nextRound,
  quitToSetup,
  startGame,
  useGameStore,
} from "@/lib/gameStore";
import { mostExplodedPlayer } from "@/lib/gameLogic";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function ResultPage() {
  const { playing, players, round, stats } = useGameStore();
  const router = useRouter();

  if (!playing) {
    return (
      <PageShell className="items-center justify-center gap-4 text-center">
        <p className="text-zinc-400">No hay partida activa…</p>
        <Link
          href="/setup"
          className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/40"
        >
          Ir a configuración
        </Link>
      </PageShell>
    );
  }

  const favorite = mostExplodedPlayer(players, stats.perPlayer);

  return (
    <PageShell className="justify-center">
      <Confetti />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5"
      >
        <motion.div variants={item} className="text-center">
          <span className="mb-3 block animate-float text-6xl">🏆</span>
          <h1 className="font-display text-3xl font-bold text-white">
            ¡Se apagó la mecha!
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            La mesa sobrevivió a {round}{" "}
            {round === 1 ? "explosión" : "explosiones"}
          </p>
        </motion.div>

        <motion.div variants={item}>
          <GameCard>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="font-display text-3xl font-bold text-orange-300">
                  {round}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">💥 explosiones</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-amber-300">
                  {stats.explosions}
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">🧨 bombas</p>
              </div>
            </div>
          </GameCard>
        </motion.div>

        {favorite && (
          <motion.div variants={item}>
            <GameCard className="text-center">
              <p className="text-xs text-zinc-500">
                La bomba lo/la buscó más a
              </p>
              <p
                className="mt-1 font-display text-2xl font-bold"
                style={{ color: favorite.player.color }}
              >
                🎯 {favorite.player.name}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                le explotó {favorite.count}{" "}
                {favorite.count === 1 ? "vez" : "veces"}
              </p>
            </GameCard>
          </motion.div>
        )}

        <motion.div variants={item} className="flex flex-col gap-2 pb-4">
          <PrimaryButton
            onClick={() => {
              continuePlaying();
              nextRound();
              router.push("/play");
            }}
          >
            🔁 Seguir jugando
          </PrimaryButton>
          <PrimaryButton
            variant="ghost"
            onClick={() => {
              startGame();
              router.push("/play");
            }}
          >
            🔄 Nueva partida con la misma mesa
          </PrimaryButton>
          <PrimaryButton
            variant="ghost"
            onClick={() => {
              quitToSetup();
              router.push("/setup");
            }}
          >
            ⚙️ Volver a configuración
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
