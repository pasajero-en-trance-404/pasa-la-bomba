"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useQuality } from "./useQuality";

function makeWoodTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    12,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "#5b2f16");
  grad.addColorStop(0.7, "#451f0d");
  grad.addColorStop(1, "#2e1407");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 16; i++) {
    ctx.beginPath();
    const r = 12 + i * 9 + Math.random() * 5;
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = i % 2 ? "#241004" : "#6e3c1c";
    ctx.lineWidth = 1.2 + Math.random() * 1.6;
    ctx.stroke();
  }

  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 80; i++) {
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      size * 0.3,
      y + (Math.random() - 0.5) * 24,
      size * 0.7,
      y + (Math.random() - 0.5) * 24,
      size,
      y,
    );
    ctx.strokeStyle = Math.random() > 0.5 ? "#1c0e04" : "#7a4420";
    ctx.lineWidth = Math.random() * 1.1;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

export default function Table() {
  const q = useQuality();
  const wood = useMemo(() => makeWoodTexture(), []);
  const segs = q === 2 ? 64 : q === 1 ? 40 : 28;

  return (
    <group>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.7, 2.7, 0.2, segs]} />
        <meshStandardMaterial map={wood} roughness={0.8} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.7, 0.04, 12, segs]} />
        <meshStandardMaterial color="#8a5a2e" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh
        position={[0, -0.22, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[14, segs]} />
        <meshStandardMaterial color="#12060a" roughness={1} />
      </mesh>
    </group>
  );
}