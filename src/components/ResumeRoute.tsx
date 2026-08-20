"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/lib/gameStore";

const GAME_ROUTES = ["/play", "/result"];

function readSavedRoute(): string | null {
  try {
    return sessionStorage.getItem("route");
  } catch {
    return null;
  }
}

function saveRoute(route: string) {
  try {
    sessionStorage.setItem("route", route);
  } catch {
    // almacenamiento no disponible
  }
}

export default function ResumeRoute() {
  const { playing } = useGameStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    saveRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    const saved = readSavedRoute();
    if (!saved) return;
    const isValid = GAME_ROUTES.includes(saved) ? playing : true;
    if (isValid && saved !== pathname) {
      router.replace(saved);
    }
  }, [playing, pathname, router]);

  return null;
}
