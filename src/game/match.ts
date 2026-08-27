import type { Player } from "./player";
import type { RNG } from "./rng";
import { calculateSinglesOverall } from "./player";

export interface MatchContext {
  tournamentLevel?: number;
  round?: number;
}
export interface MatchResult {
  winnerId: string;
  loserId: string;
  score: { playerA: number[]; playerB: number[] };
  duration: number;
  performance: { playerA: number; playerB: number };
}

function matchup(a: Player, b: Player): number {
  if (a.archetype === "attacking" && b.archetype === "defensive") return 1.5;
  if (a.archetype === "technical" && b.archetype === "attacking") return 1.2;
  if (
    a.archetype === "speed" &&
    (b.archetype === "attacking" || b.archetype === "all-round")
  )
    return 0.8;
  return 0;
}

export function simulateMatch(
  playerA: Player,
  playerB: Player,
  context: MatchContext,
  rng: RNG,
): MatchResult {
  const overallA =
    calculateSinglesOverall(playerA) +
    playerA.confidence * 0.035 -
    playerA.fatigue * 0.06 +
    matchup(playerA, playerB);
  const overallB =
    calculateSinglesOverall(playerB) +
    playerB.confidence * 0.035 -
    playerB.fatigue * 0.06 +
    matchup(playerB, playerA);
  const probabilityA = Math.max(
    0.08,
    Math.min(
      0.92,
      0.5 +
        (overallA - overallB) * 0.018 +
        (context.tournamentLevel ?? 0) * 0.002,
    ),
  );
  const aWins = rng.chance(probabilityA);
  const games = rng.chance(0.24) ? 3 : 2;
  const aGames = aWins ? (games === 3 ? 2 : 2) : games === 3 ? 1 : 0;
  const scoreA: number[] = [];
  const scoreB: number[] = [];
  for (let i = 0; i < games; i++) {
    const winnerA = i < aGames;
    const margin = rng.int(2, 7);
    const close = rng.chance(0.22);
    const winnerScore = 21;
    const loserScore = close ? 19 + rng.int(0, 1) : 21 - margin;
    scoreA.push(winnerA ? winnerScore : loserScore);
    scoreB.push(winnerA ? loserScore : winnerScore);
  }
  return {
    winnerId: aWins ? playerA.id : playerB.id,
    loserId: aWins ? playerB.id : playerA.id,
    score: { playerA: scoreA, playerB: scoreB },
    duration: rng.int(28, 78) + (games - 2) * 18,
    performance: {
      playerA: Math.max(
        1,
        Math.min(10, +(overallA / 10 + rng.random()).toFixed(1)),
      ),
      playerB: Math.max(
        1,
        Math.min(10, +(overallB / 10 + rng.random()).toFixed(1)),
      ),
    },
  };
}
