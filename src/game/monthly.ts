import type { Player, Injury } from "./player";
import type { RNG } from "./rng";
import type { MonthlyTournamentResult } from "./monthlyTournament";

// 9 种训练分类
export type MonthlyTraining =
  // 身体
  | "endurance" // 体能（+体能、+敏捷）
  | "power"     // 力量（+力量）
  | "reaction"  // 反应（+反应）
  // 技术
  | "top"       // 专项补强（+最高2项）
  | "weak"      // 补足弱点（+最低2项）
  | "all"       // 全面训练（+随机4项）
  // 心理
  | "IQ"        // 研究影片（+球商）
  | "pressure"  // 极限训练（+抗压、+意志）
  | "mentality"; // 接受辅导（+心态）

export interface SeasonLog {
  trainingMonths: number;
  tournamentResults: MonthlyTournamentResult[];
  restMonths: number;
}

export const initialSeasonLog: SeasonLog = {
  trainingMonths: 0,
  tournamentResults: [],
  restMonths: 0,
};

export function applyMonthlyTraining(
  player: Player,
  kind: MonthlyTraining,
  rng: RNG,
): { player: Player; injurySustained?: Injury } {
  const attributes = { ...player.attributes };
  const keys = Object.keys(attributes);

  if (kind === "endurance") {
    attributes.endurance = Math.min(100, (attributes.endurance ?? 45) + 2);
    attributes.agility = Math.min(100, (attributes.agility ?? 45) + 1);
  } else if (kind === "power") {
    attributes.power = Math.min(100, (attributes.power ?? 45) + 2);
  } else if (kind === "reaction") {
    attributes.reaction = Math.min(100, (attributes.reaction ?? 45) + 2);
  } else if (kind === "top") {
    const sorted = [...keys].sort((a, b) => attributes[b] - attributes[a]);
    const top2 = sorted.slice(0, 2);
    top2.forEach((k) => {
      attributes[k] = Math.min(100, attributes[k] + 1);
    });
  } else if (kind === "weak") {
    const sorted = [...keys].sort((a, b) => attributes[a] - attributes[b]);
    const weak2 = sorted.slice(0, 2);
    weak2.forEach((k) => {
      attributes[k] = Math.min(100, attributes[k] + 1);
    });
  } else if (kind === "all") {
    // 随机挑 4 个属性各 +1
    const shuffled = [...keys].sort(() => rng.int(-1, 1));
    shuffled.slice(0, 4).forEach((k) => {
      attributes[k] = Math.min(100, attributes[k] + 1);
    });
  } else if (kind === "IQ") {
    attributes.IQ = Math.min(100, (attributes.IQ ?? 45) + 2);
  } else if (kind === "pressure") {
    attributes.pressure = Math.min(100, (attributes.pressure ?? 45) + 1);
    attributes.willpower = Math.min(100, (attributes.willpower ?? 45) + 1);
  } else if (kind === "mentality") {
    attributes.mentality = Math.min(100, (attributes.mentality ?? 45) + 2);
  }

  // 疲劳增长与伤病检查
  const fatigueAdd = 10;
  let injurySustained: Injury | undefined;
  const injuryChance = Math.max(0.01, (player.fatigue + fatigueAdd - 50) * 0.002);
  if (rng.chance(injuryChance)) {
    const injuryTypes: Injury["type"][] = ["ankle", "knee", "muscle", "wrist"];
    injurySustained = {
      id: `${player.id}-${player.currentSeason}-training-injury`,
      type: rng.pick(injuryTypes),
      severity: 1,
      remainingWeeks: 4, // 1个月
    };
  }

  const newInjuries = injurySustained ? [...player.injuries, injurySustained] : player.injuries;
  const healthPenalty = injurySustained ? 15 : 0;

  const updatedPlayer: Player = {
    ...player,
    attributes,
    fatigue: Math.min(100, player.fatigue + fatigueAdd),
    // 训练选什么都能 +状态 & 信心
    morale: Math.max(0, Math.min(100, (player.morale ?? 70) + 3 - healthPenalty)),
    confidence: Math.max(0, Math.min(100, (player.confidence ?? 60) + 3 - healthPenalty)),
    injuries: newInjuries,
  };

  return { player: updatedPlayer, injurySustained };
}

// 休息：+健康，-疲劳，-状态
export function applyMonthlyRest(player: Player): Player {
  // 恢复伤病周期
  const recoveredInjuries = player.injuries
    .map((i) => ({ ...i, remainingWeeks: i.remainingWeeks - 4 }))
    .filter((i) => i.remainingWeeks > 0);

  return {
    ...player,
    fatigue: Math.max(0, (player.fatigue ?? 0) - 25),
    // 休息改善身体/健康，但稍许降低比赛紧绷感（-状态）
    morale: Math.max(0, (player.morale ?? 70) - 2),
    confidence: Math.max(0, (player.confidence ?? 60)),
    injuries: recoveredInjuries,
  };
}

export interface AchievementItem {
  label: string;
  points: number;
}

export interface AnnualReport {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  achievements: AchievementItem[];
}

export function computeAnnualReport(player: Player, seasonLog: SeasonLog): AnnualReport {
  const basePoints = 10;
  const achievements: AchievementItem[] = [];

  const titles = seasonLog.tournamentResults.filter((r) => r.placement === "winner").length;
  const finals = seasonLog.tournamentResults.filter((r) => r.placement === "finalist").length;
  const totalTournaments = seasonLog.tournamentResults.length;

  if (titles > 0) {
    achievements.push({ label: `斩获 ${titles} 座赛事冠军`, points: titles * 4 });
  }
  if (finals > 0) {
    achievements.push({ label: `打入 ${finals} 次赛事决赛`, points: finals * 2 });
  }
  if (totalTournaments >= 3) {
    achievements.push({ label: "赛季高频参赛 (≥3场)", points: 2 });
  }
  if (seasonLog.trainingMonths >= 6) {
    achievements.push({ label: "勤勉苦练 (训练≥6个月)", points: 3 });
  }
  if (player.fatigue < 40 && player.injuries.length === 0) {
    achievements.push({ label: "健康管理大师 (无伤病且低疲劳)", points: 2 });
  }

  const bonusPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const totalPoints = basePoints + bonusPoints;

  return {
    basePoints,
    bonusPoints,
    totalPoints,
    achievements,
  };
}

export function applyAnnualSettlement(
  player: Player,
  allocatedAttributes: Record<string, number>,
): Player {
  return {
    ...player,
    attributes: {
      ...player.attributes,
      ...allocatedAttributes,
    } as typeof player.attributes,
    age: player.age + 1,
    currentSeason: player.currentSeason + 1,
    fatigue: Math.max(0, player.fatigue - 30),
    injuries: player.injuries
      .map((i) => ({ ...i, remainingWeeks: i.remainingWeeks - 4 }))
      .filter((i) => i.remainingWeeks > 0),
  };
}

