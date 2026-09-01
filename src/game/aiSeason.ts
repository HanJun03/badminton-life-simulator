import type { Player } from "./player";
import type { RNG } from "./rng";
import { advanceAge } from "./progression";
import { recoverFromInjuries } from "./injury";
export function advanceAISeason(player: Player, rng: RNG): Player {
  if (player.retired) return player;
  const aged = recoverFromInjuries(advanceAge(player));
  const attributes = { ...aged.attributes };
  const keys = [
    "smash",
    "reverse",
    "footwork",
    "endurance",
    "mentality",
  ] as const;
  const direction = aged.age >= 31 ? -1 : 1;
  for (const key of keys)
    attributes[key] = Math.max(
      1,
      Math.min(99, attributes[key] + direction * (rng.chance(0.65) ? 1 : 0)),
    );
  return { ...aged, attributes, retired: aged.age >= 38 && rng.chance(0.35) };
}
export function advanceAIWorld(players: Player[], rng: RNG): Player[] {
  return players.map((p) => advanceAISeason(p, rng));
}
