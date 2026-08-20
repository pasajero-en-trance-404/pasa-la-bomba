"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";

const FEATURES = [
  "💣 Bomba 3D con mecha",
  "⚡ Tensión que sube",
  "👥 3 a 12 jugadores",
  "🎉 100% gratis",
];

const STEPS = [
  { emoji: "👥", text: "Sumá a tu gente" },
  { emoji: "💣", text: "Pasá la bomba" },
  { emoji: "🔥", text: "Que no explote" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function Home() {
  return (
    <PageShell className="justify-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div variants={item} className="relative">
          <span
            aria-hidden
            className="absolute inset-0 -m-6 animate-ping-slow rounded-full bg-orange-500/20"
          />
          <span className="relative block animate-float text-7xl">💣</span>
        </motion.div>

        <motion.div variants={item}>
          <h1 className="animate-gradient-x bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text font-display text-5xl font-bold text-transparent [background-size:200%_auto]">
            Pasá la Bomba
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-orange-100/70">
            Respondé rápido, pasá el teléfono
            <br />y que no te explote a vos.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {FEATURES.map((f) => (
            <span
              key={f}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-orange-100/80 backdrop-blur"
            >
              {f}
            </span>
          ))}
        </motion.div>

        <motion.div variants={item} className="w-full">
          <Link href="/setup" className="block">
            <motion.span
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="group relative block min-h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-4 text-base font-semibold text-white shadow-lg shadow-orange-600/40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              <span className="relative flex w-full items-center justify-center py-3.5">
                🎮 ¡A jugar!
              </span>
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-5"
        >
          {STEPS.map((s, i) => (
            <div
              key={s.text}
              className="flex items-center gap-2 text-xs text-zinc-400"
            >
              <span className="text-base">{s.emoji}</span>
              <span>{s.text}</span>
              {i < STEPS.length - 1 && (
                <span className="ml-3 text-zinc-600">→</span>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
