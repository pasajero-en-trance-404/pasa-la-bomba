"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { explode, useGameStore } from "@/lib/gameStore";
import { bombProgress } from "@/lib/bombTiming";
import { useQuality } from "./useQuality";
import Explosion from "./Explosion";

export default function Bomb() {
  const q = useQuality();
  const { phase, startedAt, explodeAt } = useGameStore();

  const group = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const explodedOnce = useRef(false);

  const fuseCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.62, 0),
        new THREE.Vector3(0.12, 0.85, 0.1),
        new THREE.Vector3(0.05, 1.05, -0.08),
        new THREE.Vector3(0, 1.17, 0.02),
      ]),
    [],
  );

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;

    if (phase === "passing") {
      if (!explodedOnce.current && Date.now() >= explodeAt) {
        explodedOnce.current = true;
        explode();
      }
      const p = bombProgress(startedAt, explodeAt);
      const t = clock.elapsedTime;
      const pulse = 1 + p * 0.12 + Math.sin(t * 8) * 0.02 * (1 + p * 2);
      g.scale.setScalar(pulse);
      g.rotation.z = Math.sin(t * 6) * 0.02 * (1 + p);
      g.rotation.x = Math.cos(t * 5) * 0.015 * (1 + p);

      if (spark.current) {
        spark.current.scale.setScalar(1 + Math.sin(t * 26) * 0.4);
        const mat = spark.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.6 + Math.sin(t * 26) * 0.6 + p * 2.4;
      }
      if (glow.current) {
        glow.current.intensity = 6 + p * 26 + Math.sin(t * 18) * 2 * (1 + p);
        glow.current.color.setHSL(0.06, 1, 0.5 + p * 0.15);
      }
    } else if (phase === "exploded") {
      g.visible = false;
    }
  });

  if (phase === "exploded") return <Explosion />;

  return (
    <group ref={group}>
      {/* cuerpo */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <sphereGeometry args={[0.6, q === 2 ? 48 : 32, q === 2 ? 32 : 24]} />
        <meshStandardMaterial
          color="#25252e"
          roughness={0.35}
          metalness={0.55}
        />
      </mesh>
      {/* cuello */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.18, 0.3, 0.5, q === 2 ? 24 : 16]} />
        <meshStandardMaterial color="#3a3a46" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* tapa */}
      <mesh position={[0, 1.12, 0]}>
        <sphereGeometry
          args={[0.16, q === 2 ? 24 : 16, q === 2 ? 16 : 12, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial color="#4b4b57" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* mecha */}
      <mesh>
        <tubeGeometry args={[fuseCurve, q === 2 ? 16 : 10, 0.045, q === 2 ? 10 : 6]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.9} />
      </mesh>
      {/* chispa */}
      <mesh ref={spark} position={[0, 1.18, 0.02]}>
        <sphereGeometry args={[0.09, q === 2 ? 16 : 12, q === 2 ? 12 : 8]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#ff9d3d"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        ref={glow}
        position={[0, 1.2, 0]}
        intensity={8}
        color="#ff6a00"
        distance={4}
        decay={2}
      />
    </group>
  );
}