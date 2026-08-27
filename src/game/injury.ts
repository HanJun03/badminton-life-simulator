import type { Injury, Player } from "./player";
import type { RNG } from "./rng";
const types: Injury["type"][] = [
  "ankle",
  "knee",
  "shoulder",
  "wrist",
  "back",
  "muscle",
];
export function checkForInjury(
  player: Player,
  intensity: "low" | "normal" | "high",
  rng: RNG,
): Player {
  const risk = Math.max(
    0,
    (player.fatigue - 35) * 0.004 +
      (intensity === "high" ? 0.07 : intensity === "normal" ? 0.02 : 0) +
      Math.max(0, player.age - 30) * 0.003 -
      player.attributes.recovery * 0.0008,
  );
  if (!rng.chance(risk)) return player;
  const severity =
    player.fatigue > 80 && intensity === "high" ? 3 : rng.chance(0.65) ? 1 : 2;
  const injury: Injury = {
    id: `${player.id}-${player.currentSeason}-${player.injuries.length}`,
    type: rng.pick(types),
    severity: severity as 1 | 2 | 3,
    remainingWeeks: severity * 2 + rng.int(1, 4),
  };
  return { ...player, injuries: [...player.injuries, injury] };
}
export function recoverFromInjuries(player: Player): Player {
  return {
    ...player,
    injuries: player.injuries
      .map((i) => ({ ...i, remainingWeeks: i.remainingWeeks - 4 }))
      .filter((i) => i.remainingWeeks > 0),
  };
}
