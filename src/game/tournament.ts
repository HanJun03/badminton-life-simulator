import type { Tournament } from "../data/tournaments";
import type { Player } from "./player";
import type { RNG } from "./rng";
import { simulateMatch, type MatchResult } from "./match";
import { awardPoints } from "./ranking";
export interface TournamentRound {
  name: string;
  opponent: Player;
  result: MatchResult;
}
export interface TournamentResult {
  tournamentId: string;
  playerId: string;
  rounds: TournamentRound[];
  placement:
    | "winner"
    | "finalist"
    | "semifinal"
    | "quarterfinal"
    | "round16"
    | "round32";
  points: number;
}
export function canEnterTournament(
  player: Player,
  tournament: Tournament,
): boolean {
  if (player.age < 13 || player.age > 18) return false;
  if (player.rankingPoints < tournament.requiredPoints || player.reputation < tournament.requiredReputation) return false;
  return tournament.level === "youth" || tournament.level === "local" || tournament.level === "national" || tournament.level === "international-series" || tournament.level === "international-challenge";
}
export function runTournament(
  player: Player,
  opponents: Player[],
  tournament: Tournament,
  rng: RNG,
): { player: Player; result: TournamentResult } {
  const rounds: TournamentRound[] = [];
  const names = ["32强", "16强", "八强", "四强", "决赛"];
  const points = tournament.rankingPoints;
  let wins = 0;
  for (let i = 0; i < Math.min(5, opponents.length); i++) {
    const opponent = opponents[i];
    const result = simulateMatch(
      player,
      opponent,
      { tournamentLevel: tournament.difficulty, round: i },
      rng,
    );
    rounds.push({
      name: names[
        Math.max(0, names.length - Math.min(5, opponents.length) + i)
      ],
      opponent,
      result,
    });
    if (result.loserId === player.id) {
      const placement =
        i === 0
          ? "round32"
          : i === 1
            ? "round16"
            : i === 2
              ? "quarterfinal"
              : i === 3
                ? "semifinal"
                : "finalist";
      const stats = {
        ...player.careerStats,
        matches: player.careerStats.matches + i + 1,
        wins: player.careerStats.wins + wins,
        finals:
          placement === "finalist"
            ? player.careerStats.finals + 1
            : player.careerStats.finals,
      };
      return {
        player: awardPoints(
          { ...player, careerStats: stats },
          points[placement],
        ),
        result: {
          tournamentId: tournament.id,
          playerId: player.id,
          rounds,
          placement,
          points: points[placement],
        },
      };
    }
    wins++;
  }
  const stats = {
    ...player.careerStats,
    matches: player.careerStats.matches + rounds.length,
    wins: player.careerStats.wins + wins,
    titles: player.careerStats.titles + 1,
    finals: player.careerStats.finals + 1,
  };
  return {
    player: awardPoints({ ...player, careerStats: stats }, points.winner),
    result: {
      tournamentId: tournament.id,
      playerId: player.id,
      rounds,
      placement: "winner",
      points: points.winner,
    },
  };
}
