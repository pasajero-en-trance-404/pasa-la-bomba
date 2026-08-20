"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/lib/gameStore";
import { useQuality } from "./useQuality";

export default function Explosion() {
  const q = useQuality();
  const { explodeAt } = useGameStore();
  const ring = useRef<THREE.Mesh>(null);
  const flash = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const age = (Date.now() - explodeAt) / 1000;
    const p = THREE.MathUtils.clamp(age / 1.1, 0, 1);
    if (ring.current) {
      const s = 0.5 + p * 4;
      ring.current.scale.set(s, s, s);
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - p) * 0.9;
    }
    if (flash.current) {
      flash.current.intensity = Math.max(0, 1 - p) * 60;
    }
  });

  return (
    <>
      <pointLight
        ref={flash}
        position={[0, 1, 0]}
        color="#fff5d0"
        intensity={40}
        distance={12}
        decay={2}
      />
      <mesh ref={ring}>
        <sphereGeometry args={[0.6, q === 2 ? 32 : 20, q === 2 ? 24 : 16]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>
      <Sparkles
        count={q >= 1 ? 50 : 24}
        scale={[3, 3, 3]}
        position={[0, 1, 0]}
        size={3}
        speed={1.4}
        color="#ffd27a"
        opacity={0.9}
      />
    </>
  );
}