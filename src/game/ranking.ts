import type { Player } from "./player";
export function updateRankings(players: Player[]): Player[] {
  return [...players]
    .sort((a, b) => b.rankingPoints - a.rankingPoints)
    .map((p, i) => ({
      ...p,
      worldRanking: p.rankingPoints > 0 ? i + 1 : null,
    }));
}
export function awardPoints(player: Player, points: number): Player {
  return {
    ...player,
    rankingPoints: Math.max(0, player.rankingPoints + points),
  };
}
