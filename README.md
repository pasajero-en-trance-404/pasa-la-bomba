# 💣 Pasá la Bomba 3D

El clásico juego de fiesta, ahora con una bomba 3D: respondé rápido, pasá el
teléfono y que no te explote a vos.

## Stack

- **Next.js 16 + React 19 + TypeScript** (App Router)
- **Tailwind CSS v4** (CSS-first, `@theme`)
- **Three.js + React Three Fiber + drei** (escena 3D WebGL)
- **@react-three/postprocessing** (bloom, solo si el dispositivo se lo banca)
- **framer-motion** (UI 2D)

## Correrlo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Cómo se juega

1. **👥 Sumá a tu gente** (3 a 12 jugadores)
2. **🎲 Elegí dificultad y rondas**
3. **💣 Pasá la bomba**: respondé la consigna y pasá el teléfono antes de que explote
4. **🏆 Al final se ve quién se bancó menos explosiones**

## Estructura

- `src/app` — rutas: `/` home, `/setup`, `/play`, `/result`
- `src/components/three` — escena 3D (bomba, mecha, chispas, humo, explosión)
- `src/lib` — store global, timing de la bomba, contenido de consignas
- `src/types` — contratos y constantes

## Performance mobile

La escena usa calidad adaptativa: si el dispositivo no sostiene FPS, baja DPR,
apaga bloom/sombras y reduce partículas automáticamente.
