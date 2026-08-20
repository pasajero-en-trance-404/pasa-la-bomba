"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import BombHUD from "@/components/BombHUD";
import { useGameStore } from "@/lib/gameStore";

const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
});

export default function PlayPage() {
  const { playing } = useGameStore();

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

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0">
        <Scene />
      </div>
      <BombHUD />
    </div>
  );
}
