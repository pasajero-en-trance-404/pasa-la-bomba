"use client";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffe0c2" />
      {/* luz principal cálida */}
      <spotLight
        position={[0, 6, 2]}
        angle={0.6}
        penumbra={0.7}
        intensity={120}
        color="#ffb35e"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      {/* contraluz rojo de la bomba */}
      <pointLight position={[-4, 3, -3]} intensity={30} color="#ef4444" />
      {/* relleno frontal suave */}
      <pointLight position={[0, 1.4, 3.5]} intensity={20} color="#ff6a3d" />
    </>
  );
}