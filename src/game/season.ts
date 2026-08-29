export interface DiceRoll {
  dice: number[];
  total: number;
  allocated: number;
  remaining: number;
}
export interface SeasonEventState {
  eventId: string;
  resolved: boolean;
  choiceId?: string;
  success?: boolean;
}
export interface SeasonStats {
  season: number;
  championships: number;
  rankingPoints: number;
  eventScore: number;
  finalScore: number;
  tournamentLevel: string;
}
export interface SeasonState {
  phase:
    | "off-season-roll"
    | "off-season-allocation"
    | "events"
    | "settlement"
    | "retired";
  dice: DiceRoll | null;
  eventIndex: number;
  events: SeasonEventState[];
  stats: SeasonStats;
}
export function createSeasonState(season: number): SeasonState {
  return {
    phase: "off-season-roll",
    dice: null,
    eventIndex: 0,
    events: [],
    stats: {
      season,
      championships: 0,
      rankingPoints: 0,
      eventScore: 0,
      finalScore: 0,
      tournamentLevel: "青年赛事",
    },
  };
}
export function rollOffSeasonDice(random: () => number): DiceRoll {
  const count = Math.floor(random() * 4) + 3;
  const dice = Array.from(
    { length: count },
    () => Math.floor(random() * 6) + 1,
  );
  return {
    dice,
    total: dice.reduce((sum, value) => sum + value, 0),
    allocated: 0,
    remaining: dice.reduce((sum, value) => sum + value, 0),
  };
}
export function allocateSeasonPoint(dice: DiceRoll, amount = 1): DiceRoll {
  const used = Math.min(amount, dice.remaining);
  return {
    ...dice,
    allocated: dice.allocated + used,
    remaining: dice.remaining - used,
  };
}
