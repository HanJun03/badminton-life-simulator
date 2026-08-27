import type { Player, Attributes } from "./player";
import type { RNG } from "./rng";

export function advanceAge(player: Player): Player {
  const attributes = { ...player.attributes };
  if (player.age >= 31)
    for (const key of ["speed", "explosiveness", "stamina", "agility"] as const)
      attributes[key] = Math.max(1, attributes[key] - 1);
  return {
    ...player,
    attributes,
    age: player.age + 1,
    currentSeason: player.currentSeason + 1,
    fatigue: Math.max(0, player.fatigue - 25),
    confidence: Math.max(35, player.confidence - 2),
  };
}
export function growPlayer(
  player: Player,
  category: "technical" | "physical" | "mental",
  intensity: "low" | "normal" | "high",
  rng: RNG,
): Player {
  const groups: Record<string, (keyof Attributes)[]> = {
    technical: [
      "serve",
      "receive",
      "netPlay",
      "clear",
      "dropShot",
      "smash",
      "defense",
      "drive",
      "footwork",
    ],
    physical: [
      "speed",
      "explosiveness",
      "strength",
      "stamina",
      "agility",
      "recovery",
    ],
    mental: [
      "consistency",
      "composure",
      "clutch",
      "concentration",
      "matchIQ",
      "workEthic",
    ],
  };
  const ageFactor =
    player.age < 19
      ? 1.4
      : player.age < 24
        ? 1.15
        : player.age < 30
          ? 0.8
          : 0.45;
  const intensityFactor =
    intensity === "high" ? 1.35 : intensity === "low" ? 0.55 : 1;
  const attributes = { ...player.attributes };
  for (const key of groups[category]) {
    const room = Math.max(0, player.potential - attributes[key]);
    const delta = Math.min(
      room,
      Math.max(
        0,
        Math.round(
          (0.5 + rng.random() * 1.5) *
            ageFactor *
            intensityFactor *
            (attributes[key] < player.potential ? 1 : 0),
        ),
      ),
    );
    attributes[key] = Math.min(99, attributes[key] + delta);
  }
  return {
    ...player,
    attributes,
    fatigue: Math.min(
      100,
      player.fatigue +
        (intensity === "high" ? 14 : intensity === "normal" ? 8 : 3),
    ),
  };
}
