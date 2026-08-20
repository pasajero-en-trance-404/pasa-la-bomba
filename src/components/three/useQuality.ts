"use client";

import { useSyncExternalStore } from "react";

export type Quality = 0 | 1 | 2; // low | medium | high

function detectCap(): Quality {
  if (typeof window === "undefined") return 2;
  const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const mem =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (mobile) return mem >= 6 ? 1 : 0;
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores >= 4 && mem >= 4 ? 2 : 1;
}

const CAP = detectCap();
let current: Quality = CAP;
const listeners = new Set<() => void>();

export function getQuality(): Quality {
  return current;
}

export function getCap(): Quality {
  return CAP;
}

function emit() {
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return current;
}

export function degrade() {
  if (current > 0) {
    current = (current - 1) as Quality;
    emit();
  }
}

export function upgrade() {
  if (current < CAP) {
    current = (current + 1) as Quality;
    emit();
  }
}

/** Calidad actual del dispositivo, con degradación dinámica. */
export function useQuality(): Quality {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}