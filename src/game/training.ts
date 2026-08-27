import type { Player } from "./player";
import type { RNG } from "./rng";
import { growPlayer } from "./progression";
import { checkForInjury } from "./injury";
export function trainPlayer(
  player: Player,
  category: "technical" | "physical" | "mental" | "recovery",
  intensity: "low" | "normal" | "high",
  rng: RNG,
): Player {
  if (category === "recovery")
    return {
      ...player,
      fatigue: Math.max(0, player.fatigue - (intensity === "high" ? 30 : 18)),
      confidence: Math.min(100, player.confidence + 2),
    };
  return checkForInjury(
    growPlayer(player, category, intensity, rng),
    intensity,
    rng,
  );
}
