import { coreAttributeKeys, type Player, type Attributes } from "./player";
import type { RNG } from "./rng";

export function advanceAge(player: Player): Player {
  const attributes = { ...player.attributes };
  const years = player.age - 12;
  const heightGap = Math.max(0, player.bodyPotential.heightCeiling - player.height);
  const weightTarget = Math.min(player.bodyPotential.weightCeiling, Math.round((player.height - 100) * 0.42));
  const nextHeight = Math.min(player.bodyPotential.heightCeiling, player.height + Math.max(0, Math.round(heightGap * player.bodyPotential.heightGrowthRate / 100 * 0.32)));
  const nextWeight = Math.min(player.bodyPotential.weightCeiling, player.weight + Math.max(0, Math.round((weightTarget - player.weight) * player.bodyPotential.weightGrowthRate / 100 * 0.3)));
  const potentialDetails = { ...player.potentialDetails };
  for (const key of coreAttributeKeys) {
    const detail = potentialDetails[key];
    if (!detail) continue;
    const physicalModifier = key === "agility" ? -(nextHeight - 175) * 0.35 - (nextWeight - (nextHeight - 100) * 0.42) * 0.45 : key === "power" ? (nextHeight - 175) * 0.12 + (nextWeight - (nextHeight - 100) * 0.42) * 0.7 : key === "reaction" ? -(nextHeight - 175) * 0.1 : 0;
    const effectiveCeiling = Math.min(detail.trueCeiling, Math.max(1, Math.round(detail.trueCeiling + physicalModifier)));
    const ageFactor = player.age < player.peakAge ? 1 : player.age === player.peakAge ? 0.55 : -0.15;
    const gain = ageFactor > 0 ? Math.max(0, Math.round((effectiveCeiling - detail.current) * (detail.growthRate / 100) * 0.08 * ageFactor)) : Math.min(0, Math.round(ageFactor));
    potentialDetails[key] = { ...detail, effectiveCeiling, current: Math.max(1, Math.min(effectiveCeiling, detail.current + gain)) };
    attributes[key] = potentialDetails[key].current;
  }
  if (player.age >= 31)
    for (const key of ["speed", "explosiveness", "stamina", "agility"] as const)
      attributes[key] = Math.max(1, attributes[key] - 1);
  return {
    ...player,
    attributes,
    age: player.age + 1,
    height: nextHeight,
    weight: nextWeight,
    potentialDetails,
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
