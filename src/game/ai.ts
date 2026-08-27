import type { Archetype, Player } from "./player";
import { createPlayer } from "./player";
import type { RNG } from "./rng";

const names = [
  "林俊杰",
  "陈浩宇",
  "张天佑",
  "李明轩",
  "王子豪",
  "赵宇辰",
  "佐藤健",
  "田中翔",
  "安德斯·尼尔森",
  "卢卡斯·马丁",
];
const countries = ["MAS", "CHN", "JPN", "DEN", "INA", "KOR", "THA", "TPE"];
const archetypes: Archetype[] = [
  "attacking",
  "defensive",
  "all-round",
  "technical",
  "speed",
];

export function createAIPlayer(index: number, rng: RNG): Player {
  const archetype = rng.pick(archetypes);
  const player = createPlayer(
    `${rng.pick(names)} ${index + 1}`,
    archetype,
    rng.pick(countries),
  );
  const level = Math.max(35, 82 - Math.floor(index * 0.22) + rng.int(-7, 7));
  const attributes = Object.fromEntries(
    Object.entries(player.attributes).map(([key, value]) => [
      key,
      Math.max(1, Math.min(99, value + level - 45 + rng.int(-4, 4))),
    ]),
  ) as unknown as Player["attributes"];
  return {
    ...player,
    id: `ai-${index + 1}`,
    age: rng.int(17, 32),
    attributes,
    potential: Math.min(99, level + rng.int(3, 17)),
    rankingPoints: Math.max(0, (300 - index) * 180 + rng.int(-500, 500)),
    confidence: rng.int(45, 85),
  };
}

export function createAIPool(size: number, rng: RNG): Player[] {
  return Array.from({ length: size }, (_, i) => createAIPlayer(i, rng));
}
