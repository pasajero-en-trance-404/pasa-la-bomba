"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/gameStore";
import { bombProgress } from "@/lib/bombTiming";

export default function CameraRig() {
  const { phase, startedAt, explodeAt } = useGameStore();
  const shake = useRef(0);

  useFrame(({ clock, camera, size }, delta) => {
    const t = clock.elapsedTime;
    const aspect = size.width / size.height;
    const boost = THREE.MathUtils.clamp(1 / aspect, 1, 1.6);
    const cam = camera as THREE.PerspectiveCamera;

    const targetFov = THREE.MathUtils.clamp(42 / Math.sqrt(aspect), 42, 56);
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }

    const baseX = Math.sin(t * 0.25) * 0.12;
    const baseY = 3.1 * boost + Math.sin(t * 0.4) * 0.06;
    const baseZ = 6.6 * boost;

    const k = 1 - Math.exp(-2.4 * delta);
    camera.position.x += (baseX - camera.position.x) * k;
    camera.position.y += (baseY - camera.position.y) * k;
    camera.position.z += (baseZ - camera.position.z) * k;

    if (phase === "passing") {
      const p = bombProgress(startedAt, explodeAt);
      shake.current = p > 0.75 ? (p - 0.75) * 0.35 : 0;
    } else if (phase === "exploded") {
      shake.current = 0.5;
    }

    if (shake.current > 0.001) {
      camera.position.x += (Math.random() - 0.5) * shake.current * 0.12;
      camera.position.y += (Math.random() - 0.5) * shake.current * 0.12;
      shake.current *= Math.exp(-3.2 * delta);
    }

    camera.lookAt(0, 0.7, 0);
  });

  return null;
}