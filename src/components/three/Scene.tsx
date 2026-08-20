"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Lights from "./Lights";
import Table from "./Table";
import Bomb from "./Bomb";
import Effects from "./Effects";
import CameraRig from "./CameraRig";
import QualityController from "./QualityController";
import { useQuality } from "./useQuality";

export default function Scene() {
  const q = useQuality();

  return (
    <Canvas
      shadows={q >= 1}
      dpr={[1, q === 2 ? 2 : 1.5]}
      performance={{ min: 0.5, max: 1, debounce: 250 }}
      camera={{ position: [0, 3.4, 7.2], fov: 42, near: 0.1, far: 60 }}
      gl={{
        antialias: q === 2,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#0b0608"]} />
      <fog attach="fog" args={["#0b0608", 14, 34]} />
      <Suspense fallback={null}>
        <Lights />
        <Table />
        <Bomb />
        <Effects />
        <CameraRig />
        <QualityController />
      </Suspense>
    </Canvas>
  );
}