import type { Player } from "./player";
import type { RNG } from "./rng";

export interface EventOption {
  text: string;
  baseRate: number;
  checkAttributes: string[];
  success: EventOutcome;
  failure: EventOutcome;
}
export interface EventOutcome {
  effects: Record<string, number>;
  log: string;
}
export interface ResolvedEvent {
  isSuccess: boolean;
  finalRate: number;
  finalRateDisplay: string;
  log: string;
  player: Player;
}

const aliases: Record<string, keyof Player["attributes"]> = {
  power: "power",
  endurance: "endurance",
  stamina: "stamina",
  explosiveness: "explosiveness",
  reaction: "reaction",
  footwork: "footwork",
  smash: "smash",
  netPlay: "netPlay",
  receive: "receive",
  clear: "clear",
  feint: "dropShot",
  mindset: "mentality",
  pressure: "pressure",
  willpower: "willpower",
  IQ: "IQ",
};
export function getNestedAttribute(
  attributes: Player["attributes"],
  path: string,
): number {
  const key = aliases[path.split(".").pop() ?? ""];
  return key ? Math.max(0, Math.min(100, attributes[key] ?? 0)) : 0;
}
export function applyEffects(
  player: Player,
  effects: Record<string, number>,
): Player {
  const attributes = { ...player.attributes };
  for (const [path, delta] of Object.entries(effects)) {
    const key = aliases[path.split(".").pop() ?? ""];
    if (key)
      attributes[key] = Math.max(
        0,
        Math.min(45, (attributes[key] ?? 0) + delta),
      );
  }
  return { ...player, attributes };
}
export function resolveEventOption(
  player: Player,
  option: EventOption,
  rng: RNG,
): ResolvedEvent {
  const attr1 = getNestedAttribute(
    player.attributes,
    option.checkAttributes[0],
  );
  const attr2 = getNestedAttribute(
    player.attributes,
    option.checkAttributes[1],
  );
  const attrBonus = ((attr1 + attr2 - 100) / 2) * 0.01;
  const finalRate = Math.min(0.95, Math.max(0.05, option.baseRate + attrBonus));
  const isSuccess = rng.chance(finalRate);
  const outcome = isSuccess ? option.success : option.failure;
  return {
    isSuccess,
    finalRate,
    finalRateDisplay: `${(finalRate * 100).toFixed(1)}%`,
    log: outcome.log,
    player: applyEffects(player, outcome.effects),
  };
}
