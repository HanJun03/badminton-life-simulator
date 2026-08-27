export interface RNG {
  random(): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<T>(items: T[]): T;
}
export function createRNG(seed: string | number): RNG {
  let state =
    typeof seed === "number"
      ? seed >>> 0
      : [...seed].reduce(
          (h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619),
          2166136261,
        ) >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  return {
    random,
    int: (min, max) => Math.floor(random() * (max - min + 1)) + min,
    chance: (p) => random() < p,
    pick: (items) => items[Math.floor(random() * items.length)],
  };
}
