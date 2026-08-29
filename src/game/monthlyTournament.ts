import type { Tournament } from "../data/tournaments";
import type { Player, Injury } from "./player";
import { calculateSinglesOverall } from "./player";
import type { RNG } from "./rng";

export interface MonthlyTournamentResult {
  tournamentId: string;
  tournamentName: string;
  tier: string;
  placement: "winner" | "finalist" | "semifinal" | "quarterfinal" | "round16" | "round32";
  placementName: string;
  rankingPointsEarned: number;
  reputationEarned: number;
  fatigueAdded: number;
  moraleChange: number;
  confidenceChange: number;
  injurySustained?: Injury;
}

export function simulateMonthlyTournament(
  player: Player,
  tournament: Tournament,
  rng: RNG,
): { player: Player; result: MonthlyTournamentResult } {
  const overall = calculateSinglesOverall(player);
  // 难度对比差值：正数说明玩家有优势，负数说明对手/赛事难度极高
  const diff = overall - tournament.difficulty;
  const roll = rng.int(1, 100) + diff * 1.5;

  let placement: MonthlyTournamentResult["placement"] = "round32";
  let placementName = "首轮出局";
  let pointsRatio = 0.1;
  let repRatio = 0.1;
  let moraleChange = -5;
  let confidenceChange = -5;

  if (roll >= 85) {
    placement = "winner";
    placementName = "🏆 冠军";
    pointsRatio = 1.0;
    repRatio = 1.0;
    moraleChange = 15;
    confidenceChange = 15;
  } else if (roll >= 68) {
    placement = "finalist";
    placementName = "🥈 亚军";
    pointsRatio = 0.75;
    repRatio = 0.75;
    moraleChange = 10;
    confidenceChange = 8;
  } else if (roll >= 50) {
    placement = "semifinal";
    placementName = "🥉 四强";
    pointsRatio = 0.5;
    repRatio = 0.5;
    moraleChange = 5;
    confidenceChange = 5;
  } else if (roll >= 35) {
    placement = "quarterfinal";
    placementName = "八强";
    pointsRatio = 0.3;
    repRatio = 0.3;
    moraleChange = 2;
    confidenceChange = 2;
  } else if (roll >= 20) {
    placement = "round16";
    placementName = "十六强";
    pointsRatio = 0.15;
    repRatio = 0.15;
    moraleChange = 0;
    confidenceChange = 0;
  }

  const rankingPointsEarned = Math.round(
    tournament.rankingPoints.winner > 0
      ? tournament.rankingPoints.winner * pointsRatio
      : (tournament.rankingPoints.semifinal || 30) * pointsRatio,
  );
  const reputationEarned = Math.round(
    tournament.reputationRewards.winner > 0
      ? tournament.reputationRewards.winner * repRatio
      : (tournament.reputationRewards.semifinal || 30) * repRatio,
  );

  const fatigueAdded = 18 + rng.int(0, 10);

  // 检查受伤概率（疲劳高或高强度对抗）
  let injurySustained: Injury | undefined;
  const injuryChance = Math.max(0.02, (player.fatigue + fatigueAdded - 40) * 0.003);
  if (rng.chance(injuryChance)) {
    const injuryTypes: Injury["type"][] = ["ankle", "knee", "shoulder", "wrist", "muscle"];
    const severity: 1 | 2 | 3 = rng.chance(0.7) ? 1 : rng.chance(0.8) ? 2 : 3;
    injurySustained = {
      id: `${player.id}-${player.currentSeason}-tourney-injury`,
      type: rng.pick(injuryTypes),
      severity,
      remainingWeeks: severity * 4, // 1级4周(1月)，2级8周(2月)，3级12周(3月)
    };
  }

  // 结算给 player 的数据
  const newInjuries = injurySustained
    ? [...player.injuries, injurySustained]
    : player.injuries;

  const healthPenalty = injurySustained ? injurySustained.severity * 15 : 0;

  const updatedPlayer: Player = {
    ...player,
    rankingPoints: player.rankingPoints + rankingPointsEarned,
    reputation: player.reputation + reputationEarned,
    fatigue: Math.min(100, player.fatigue + fatigueAdded),
    morale: Math.max(0, Math.min(100, player.morale + moraleChange - healthPenalty)),
    confidence: Math.max(0, Math.min(100, player.confidence + confidenceChange - healthPenalty)),
    injuries: newInjuries,
    careerStats: {
      ...player.careerStats,
      matches: player.careerStats.matches + (placement === "winner" ? 5 : placement === "finalist" ? 4 : 2),
      wins: player.careerStats.wins + (placement === "winner" ? 5 : placement === "finalist" ? 3 : 1),
      titles: player.careerStats.titles + (placement === "winner" ? 1 : 0),
      finals: player.careerStats.finals + (placement === "winner" || placement === "finalist" ? 1 : 0),
    },
  };

  const result: MonthlyTournamentResult = {
    tournamentId: tournament.id,
    tournamentName: tournament.name,
    tier: tournament.tier,
    placement,
    placementName,
    rankingPointsEarned,
    reputationEarned,
    fatigueAdded,
    moraleChange,
    confidenceChange,
    injurySustained,
  };

  return { player: updatedPlayer, result };
}
