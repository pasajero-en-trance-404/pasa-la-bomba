"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

export default function Backdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raw = canvasRef.current;
    if (!raw) return;
    const canvas = raw;
    const context0 = canvas.getContext("2d");
    if (!context0) return;
    const context: CanvasRenderingContext2D = context0;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const count = Math.min(28, Math.floor(window.innerWidth / 42));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.5 + 0.5) * dpr,
        vx: (Math.random() - 0.5) * 0.16 * dpr,
        vy: (Math.random() - 0.5) * 0.12 * dpr,
        a: Math.random() * 0.45 + 0.12,
      }));
    }

    function tick() {
      context.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const twinkle =
          0.4 + Math.sin(p.x * 0.01 + performance.now() * 0.0008) * 0.3;
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,183,120,${p.a * twinkle})`;
        context.shadowColor = "rgba(249,115,22,0.85)";
        context.shadowBlur = 7 * dpr;
        context.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -left-32 top-[-10%] h-[34rem] w-[34rem] animate-blob rounded-full bg-orange-600/25 blur-[120px]" />
      <div className="absolute right-[-15%] top-[5%] h-[28rem] w-[28rem] animate-blob rounded-full bg-red-600/20 blur-[110px] [animation-delay:-6s]" />
      <div className="absolute bottom-[-20%] left-[10%] h-[30rem] w-[30rem] animate-blob rounded-full bg-amber-600/15 blur-[120px] [animation-delay:-12s]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
