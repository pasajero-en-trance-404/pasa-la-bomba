"use client";

import { PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { degrade, upgrade } from "./useQuality";

/** Baja la calidad si el FPS cae y la sube si vuelve a estabilizarse. */
export default function QualityController() {
  return (
    <PerformanceMonitor
      iterations={24}
      ms={30}
      flipflops={3}
      onDecline={degrade}
      onIncline={upgrade}
    >
      <AdaptiveDpr />
    </PerformanceMonitor>
  );
}