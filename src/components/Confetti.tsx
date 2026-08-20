"use client";

import { useEffect, useRef } from "react";

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rot: number;
  vr: number;
}

const COLORS = ["#fbbf24", "#fb923c", "#ef4444", "#fde68a", "#f97316", "#fecaca"];

export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    const ctx: CanvasRenderingContext2D = ctx0;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const bits: Bit[] = Array.from({ length: 140 }, () => ({
      x: Math.random() * w,
      y: -20 * dpr - Math.random() * h * 0.3,
      vx: (Math.random() - 0.5) * 5 * dpr,
      vy: (Math.random() * 4 + 2) * dpr,
      w: (Math.random() * 8 + 4) * dpr,
      h: (Math.random() * 6 + 3) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    }));

    const t0 = performance.now();
    function tick(now: number) {
      ctx.clearRect(0, 0, w, h);
      let done = true;
      for (const b of bits) {
        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vr;
        if (b.y < h + 30) done = false;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      if (now - t0 < 2400 && !done) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    requestAnimationFrame(tick);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
