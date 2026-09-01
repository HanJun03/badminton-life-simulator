export type Archetype =
  | "attacking"
  | "defensive"
  | "all-round"
  | "technical"
  | "speed";
export type Discipline =
  | "mens-singles"
  | "womens-singles"
  | "mens-doubles"
  | "womens-doubles"
  | "mixed-doubles";
export interface Injury {
  id: string;
  type: "ankle" | "knee" | "shoulder" | "wrist" | "back" | "muscle";
  severity: 1 | 2 | 3;
  remainingWeeks: number;
}
export interface CareerStats {
  matches: number;
  wins: number;
  titles: number;
  finals: number;
  highestRanking: number | null;
}

import { createRNG } from "./rng";
export interface Attributes {
  [key: string]: number
  endurance: number;
  power: number;
  agility: number;
  reaction: number;
  footwork: number;
  receive: number;
  netPlay: number;
  clear: number;
  smash: number;
  dropShot: number;
  drive: number;
  reverse: number;
  IQ: number;
  pressure: number;
  mentality: number;
  willpower: number;
}

export interface Player {
  id: string;
  name: string;
  nationality: string;
  gender: "male" | "female";
  discipline: Discipline;
  handedness: "left" | "right";
  age: number;
  height: number;
  weight: number;
  archetype: Archetype;
  attributes: Attributes;
  potential: number;
  fatigue: number;
  confidence: number;
  morale: number;
  reputation: number;
  rankingPoints: number;
  worldRanking: number | null;
  currentSeason: number;
  retired: boolean;
  injuries: Injury[];
  careerStats: CareerStats;
  characterSeed: string;
  peakAge: number;
  aptitude: { physical: number; technical: number; mental: number; coordination: number };
  bodyPotential: { heightCeiling: number; heightGrowthRate: number; weightCeiling: number; weightGrowthRate: number };
  potentialDetails: Record<string, AttributePotential>;
}

export interface AttributePotential {
  current: number;
  trueCeiling: number;
  effectiveCeiling: number;
  growthRate: number;
}

export const coreAttributeKeys = [
  "endurance", "power", "agility", "reaction",
  "footwork", "receive", "netPlay", "clear", "smash", "dropShot", "drive", "reverse",
  "IQ", "pressure", "mentality", "willpower",
] as const;

const base: Attributes = {
  endurance: 45,
  power: 45,
  agility: 45,
  reaction: 45,
  footwork: 45,
  receive: 45,
  netPlay: 45,
  clear: 45,
  smash: 45,
  dropShot: 45,
  drive: 45,
  reverse: 45,
  IQ: 45,
  pressure: 45,
  mentality: 45,
  willpower: 45,
};
export function createPlayer(
  name: string,
  archetype: Archetype = "all-round",
  nationality = "MAS",
  handedness: "left" | "right" = "right",
  height = 165,
  weight = 65,
  seed?: string,
): Player {
  const characterSeed = seed?.trim() || `${name}-${nationality}-${height}-${weight}`;
  const rng = createRNG(characterSeed);
  const aptitude = { physical: rng.int(25, 75), technical: rng.int(25, 75), mental: rng.int(25, 75), coordination: rng.int(25, 75) };
  const bodyPotential = {
    heightCeiling: Math.max(height + 2, Math.min(200, height + rng.int(4, 18))),
    heightGrowthRate: rng.int(35, 85),
    weightCeiling: Math.max(
      weight + 8,
      Math.min(100, Math.round((height + rng.int(4, 12) - 100) * 0.8 + rng.int(-4, 5))),
    ),
    weightGrowthRate: rng.int(35, 85),
  };
  const countryBias: Record<string, number> = { MAS: 2, INA: 3, CHN: 2, JPN: 1, DEN: 1, KOR: 1, IND: 1, THA: 2, TPE: 1, ENG: 0 };
  const baseRanges: Record<string, [number, number]> = {
    endurance: [35, 55], power: [30, 50], agility: [40, 65], reaction: [40, 65],
    footwork: [20, 50], receive: [15, 45], netPlay: [15, 50], clear: [20, 50], smash: [20, 55], dropShot: [15, 50], drive: [15, 50], reverse: [10, 45],
    IQ: [20, 45], pressure: [20, 45], mentality: [25, 50], willpower: [25, 55],
  };
  const categoryFor = (key: string) => coreAttributeKeys.indexOf(key as typeof coreAttributeKeys[number]) < 4 ? "physical" : coreAttributeKeys.indexOf(key as typeof coreAttributeKeys[number]) < 12 ? "technical" : "mental";
  const potentialDetails: Record<string, AttributePotential> = {};
  const attributes = {
    ...base,
    ...Object.fromEntries(coreAttributeKeys.map((key) => {
      const [min, max] = baseRanges[key];
      const category = categoryFor(key) as "physical" | "technical" | "mental";
      const current = Math.max(1, Math.min(99, rng.int(min, max) + Math.round((aptitude[category] - 50) * 0.12) + (countryBias[nationality] ?? 0)));
      const trueCeiling = Math.max(current, Math.min(99, rng.int(60, 88) + Math.round((aptitude[category] - 50) * 0.2) + rng.int(-5, 5)));
      potentialDetails[key] = { current, trueCeiling, effectiveCeiling: trueCeiling, growthRate: rng.int(25, 95) };
      return [key, current];
    })),
  };
  return {
    id: crypto.randomUUID(),
    name,
    nationality,
    gender: "male",
    discipline: "mens-singles",
    handedness,
    age: 13,
    height,
    weight,
    archetype,
    attributes,
    potential: 70,
    fatigue: 0,
    confidence: 60,
    morale: 70,
    reputation: 0,
    rankingPoints: 0,
    worldRanking: null,
    currentSeason: 1,
    retired: false,
    injuries: [],
    careerStats: {
      matches: 0,
      wins: 0,
      titles: 0,
      finals: 0,
      highestRanking: null,
    },
    characterSeed,
    peakAge: rng.int(23, 30),
    aptitude,
    bodyPotential,
    potentialDetails,
  };
}

export function calculateSinglesOverall(
  player: Pick<Player, "attributes">,
): number {
  const a = player.attributes;
  const physical =
    (a.endurance + a.power + a.agility + a.reaction) / 4;
  const technical =
    a.footwork * 0.15 +
    a.receive * 0.1 +
    a.netPlay * 0.1 +
    a.clear * 0.15 +
    a.smash * 0.15 +
    a.dropShot * 0.15 +
    a.drive * 0.1 +
    a.reverse * 0.1;
  const mental = (a.IQ + a.pressure + a.mentality + a.willpower) / 4;
  return Math.max(
    1,
    Math.min(99, Math.round(physical * 0.25 + technical * 0.55 + mental * 0.2)),
  );
}
