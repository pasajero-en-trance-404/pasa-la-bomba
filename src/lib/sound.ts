export type SoundEvent =
  | "tap"
  | "pass"
  | "tick"
  | "explode"
  | "next"
  | "win";

// TODO: enlazar audios reales (public/sounds/*.mp3) y reproducirlos acá.
export function play(_event: SoundEvent) {
  void _event;
  // no-op intencional: mantiene la API estable para cuando haya assets.
}
