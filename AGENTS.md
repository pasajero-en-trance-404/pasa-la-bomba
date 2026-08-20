<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 3D notes (React Three Fiber)

- All 3D code lives in `src/components/three/` and runs ONLY on the client:
  the `<Canvas>` is always loaded with `next/dynamic` + `ssr: false`.
- Stack: three + @react-three/fiber v9 + @react-three/drei v10 +
  @react-three/postprocessing. Their docs live in each package folder under
  `node_modules/` — check them before guessing APIs.
- Game state never lives inside the Canvas; `src/lib/gameStore.ts` is the
  single source of truth and 3D components subscribe with `useGameStore()`.
- Bomb timing is deterministic: the explosion timestamp is drawn when the
  round starts, and the scene animates from remaining time. No physics engine.

# Mobile performance rules

- Mobile quality must degrade gracefully: DPR, bloom, shadows, transmission,
  particles and antialias are quality-dependent.
- Use `src/components/three/useQuality.ts` + `QualityController` instead of
  one-shot `navigator` checks.
- Do not put per-frame React state updates inside the Canvas; keep animation
  state in refs and emit store changes only on phase transitions.
