"use client";

import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useQuality } from "./useQuality";

export default function Effects() {
  const q = useQuality();

  return (
    <>
      <Sparkles
        count={q === 2 ? 70 : q === 1 ? 40 : 18}
        scale={[8, 3, 8]}
        position={[0, 1.6, -2]}
        size={2.4}
        speed={0.3}
        color="#ffc98a"
        opacity={0.45}
      />
      {q === 2 && (
        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.2}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}