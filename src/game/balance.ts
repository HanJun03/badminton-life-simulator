import { calculateSinglesOverall, coreAttributeKeys, createPlayer, type Player } from "./player";
import { createRNG } from "./rng";

export interface BalanceReport {
  sampleSize: number;
  overall: { min: number; max: number; average: number };
  attributes: Record<string, { min: number; max: number; average: number }>;
  ceilings: { min: number; max: number; average: number };
  body: { heightMin: number; heightMax: number; weightMin: number; weightMax: number };
  standoutRate: number;
}

function summary(values: number[]) {
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    average: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100,
  };
}

export function generateBalanceSample(size: number, seed = "V1-BALANCE") {
  const rng = createRNG(seed);
  const players: Player[] = Array.from({ length: Math.max(1, size) }, (_, index) => {
    const nationality = rng.pick(["MAS", "INA", "CHN", "JPN", "DEN", "KOR", "IND", "THA", "TPE", "ENG"]);
    const height = rng.int(145, 180);
    const weight = rng.int(38, 80);
    return createPlayer(`Sample ${index + 1}`, "all-round", nationality, "right", height, weight, `${seed}-${index}`);
  });
  return players;
}

export function analyzeBalance(size: number, seed?: string): BalanceReport {
  const players = generateBalanceSample(size, seed);
  const overalls = players.map(calculateSinglesOverall);
  const ceilingValues = players.flatMap((player) => coreAttributeKeys.map((key) => player.potentialDetails[key].effectiveCeiling));
  const attributes = Object.fromEntries(coreAttributeKeys.map((key) => [key, summary(players.map((player) => player.attributes[key]))]));
  return {
    sampleSize: players.length,
    overall: summary(overalls),
    attributes,
    ceilings: summary(ceilingValues),
    body: {
      heightMin: Math.min(...players.map((player) => player.height)),
      heightMax: Math.max(...players.map((player) => player.height)),
      weightMin: Math.min(...players.map((player) => player.weight)),
      weightMax: Math.max(...players.map((player) => player.weight)),
    },
    standoutRate: Math.round((players.filter((player) => coreAttributeKeys.some((key) => player.attributes[key] >= 60)).length / players.length) * 10000) / 100,
  };
}

export async function analyzeBalanceAsync(size: number, seed?: string): Promise<BalanceReport> {
  if (size <= 1000) return analyzeBalance(size, seed);
  if (size === 10000) {
    const reports: BalanceReport[] = [];
    for (let batch = 0; batch < 10; batch += 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      reports.push(analyzeBalance(1000, `${seed ?? "V1-BALANCE"}-batch-${batch}`));
    }
    const total = reports.reduce((sum, report) => sum + report.sampleSize, 0);
    const weightedAverage = (get: (report: BalanceReport) => number) => Math.round((reports.reduce((sum, report) => sum + get(report) * report.sampleSize, 0) / total) * 100) / 100;
    const attributes = Object.fromEntries(coreAttributeKeys.map((key) => [key, {
      min: Math.min(...reports.map((report) => report.attributes[key].min)),
      max: Math.max(...reports.map((report) => report.attributes[key].max)),
      average: weightedAverage((report) => report.attributes[key].average),
    }]));
    return {
      sampleSize: total,
      overall: { min: Math.min(...reports.map((report) => report.overall.min)), max: Math.max(...reports.map((report) => report.overall.max)), average: weightedAverage((report) => report.overall.average) },
      attributes,
      ceilings: { min: Math.min(...reports.map((report) => report.ceilings.min)), max: Math.max(...reports.map((report) => report.ceilings.max)), average: weightedAverage((report) => report.ceilings.average) },
      body: { heightMin: Math.min(...reports.map((report) => report.body.heightMin)), heightMax: Math.max(...reports.map((report) => report.body.heightMax)), weightMin: Math.min(...reports.map((report) => report.body.weightMin)), weightMax: Math.max(...reports.map((report) => report.body.weightMax)) },
      standoutRate: weightedAverage((report) => report.standoutRate),
    };
  }
  // 将大样本拆成小批次，让浏览器有机会处理渲染和用户输入。
  const first = generateBalanceSample(Math.min(500, size), `${seed ?? "V1-BALANCE"}-0`);
  const players = [...first];
  for (let offset = 500; offset < size; offset += 500) {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    players.push(...generateBalanceSample(Math.min(500, size - offset), `${seed ?? "V1-BALANCE"}-${offset}`));
  }
  const overalls = players.map(calculateSinglesOverall);
  const ceilingValues = players.flatMap((player) => coreAttributeKeys.map((key) => player.potentialDetails[key].effectiveCeiling));
  const attributes = Object.fromEntries(coreAttributeKeys.map((key) => [key, summary(players.map((player) => player.attributes[key]))]));
  return {
    sampleSize: players.length,
    overall: summary(overalls),
    attributes,
    ceilings: summary(ceilingValues),
    body: { heightMin: Math.min(...players.map((player) => player.height)), heightMax: Math.max(...players.map((player) => player.height)), weightMin: Math.min(...players.map((player) => player.weight)), weightMax: Math.max(...players.map((player) => player.weight)) },
    standoutRate: Math.round((players.filter((player) => coreAttributeKeys.some((key) => player.attributes[key] >= 60)).length / players.length) * 10000) / 100,
  };
}
