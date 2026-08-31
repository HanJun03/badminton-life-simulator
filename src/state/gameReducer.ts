import type { Player } from "../game/player";
import { createPlayer } from "../game/player";
import { createRNG } from "../game/rng";
import { tournaments } from "../data/tournaments";
import { canEnterTournament } from "../game/tournament";
import {
  applyMonthlyTraining,
  applyMonthlyRest,
  applyAnnualSettlement,
  computeAnnualReport,
  initialSeasonLog,
  type MonthlyTraining,
  type SeasonLog,
  type AnnualReport,
} from "../game/monthly";
import {
  simulateMonthlyTournament,
  type MonthlyTournamentResult,
} from "../game/monthlyTournament";

export interface GameState {
  player: Player | null;
  seed: string;
  currentMonth: number; // 1 - 12
  seasonLog: SeasonLog;
  lastMonthlyTournament: MonthlyTournamentResult | null;
  annualReport: AnnualReport | null;
}

export type GameAction =
  | {
      type: "CREATE_PLAYER";
      payload: {
        name: string;
        nationality?: string;
        handedness?: "left" | "right";
        height?: number;
        weight?: number;
        seed?: string;
      };
    }
  | { type: "MONTHLY_ACTION_TRAIN"; payload: { kind: MonthlyTraining } }
  | { type: "MONTHLY_ACTION_REST" }
  | { type: "MONTHLY_ACTION_TOURNAMENT"; payload: { tournamentId: string } }
  | { type: "CLEAR_MONTHLY_TOURNAMENT_RESULT" }
  | { type: "START_ANNUAL_SETTLEMENT" }
  | {
      type: "APPLY_ANNUAL_SETTLEMENT";
      payload: { allocatedAttributes: Record<string, number> };
    }
  | {
      type: "UPDATE_ATTRIBUTES";
      payload: { attributes: Record<string, number> };
    }
  | { type: "RESET" };

export const initialState: GameState = {
  player: null,
  seed: "MALAYSIA2026",
  currentMonth: 1,
  seasonLog: initialSeasonLog,
  lastMonthlyTournament: null,
  annualReport: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  const p = state.player;

  if (action.type === "CREATE_PLAYER") {
    return {
      ...initialState,
      player: createPlayer(
        action.payload.name,
        "all-round",
        action.payload.nationality ?? "MAS",
        action.payload.handedness ?? "right",
        action.payload.height ?? 175,
        action.payload.weight ?? 70,
        action.payload.seed,
      ),
      currentMonth: 1,
      seasonLog: initialSeasonLog,
    };
  }

  if (!p) return action.type === "RESET" ? initialState : state;

  if (action.type === "UPDATE_ATTRIBUTES") {
    return {
      ...state,
      player: {
        ...p,
        attributes: {
          ...p.attributes,
          ...action.payload.attributes,
        } as typeof p.attributes,
      },
    };
  }

  // 1. 训练行动（身体、技术、心理 9 项）
  if (action.type === "MONTHLY_ACTION_TRAIN") {
    const rng = createRNG(`${state.seed}-${p.id}-${p.currentSeason}-${state.currentMonth}-train`);
    const { player: updatedPlayer } = applyMonthlyTraining(p, action.payload.kind, rng);
    const updatedSeasonLog: SeasonLog = {
      ...state.seasonLog,
      trainingMonths: state.seasonLog.trainingMonths + 1,
    };

    return {
      ...state,
      player: updatedPlayer,
      seasonLog: updatedSeasonLog,
      currentMonth: state.currentMonth + 1,
    };
  }

  // 2. 休息行动
  if (action.type === "MONTHLY_ACTION_REST") {
    const updatedPlayer = applyMonthlyRest(p);
    const updatedSeasonLog: SeasonLog = {
      ...state.seasonLog,
      restMonths: state.seasonLog.restMonths + 1,
    };

    return {
      ...state,
      player: updatedPlayer,
      seasonLog: updatedSeasonLog,
      currentMonth: state.currentMonth + 1,
    };
  }

  // 3. 参加比赛行动
  if (action.type === "MONTHLY_ACTION_TOURNAMENT") {
    const tourney = tournaments.find((t) => t.id === action.payload.tournamentId);
    if (!tourney || !canEnterTournament(p, tourney)) return state;

    const rng = createRNG(`${state.seed}-${p.id}-${p.currentSeason}-${state.currentMonth}-tourney`);
    const { player: updatedPlayer, result } = simulateMonthlyTournament(p, tourney, rng);
    const updatedSeasonLog: SeasonLog = {
      ...state.seasonLog,
      tournamentResults: [...state.seasonLog.tournamentResults, result],
    };

    return {
      ...state,
      player: updatedPlayer,
      seasonLog: updatedSeasonLog,
      lastMonthlyTournament: result,
      currentMonth: state.currentMonth + 1,
    };
  }

  if (action.type === "CLEAR_MONTHLY_TOURNAMENT_RESULT") {
    return {
      ...state,
      lastMonthlyTournament: null,
    };
  }

  // 4. 进入年度结算
  if (action.type === "START_ANNUAL_SETTLEMENT") {
    const report = computeAnnualReport(p, state.seasonLog);
    return {
      ...state,
      annualReport: report,
    };
  }

  // 5. 应用年度结算加点 & 开始新的一年
  if (action.type === "APPLY_ANNUAL_SETTLEMENT") {
    const updatedPlayer = applyAnnualSettlement(p, action.payload.allocatedAttributes);
    return {
      ...state,
      player: updatedPlayer,
      currentMonth: 1,
      seasonLog: initialSeasonLog,
      annualReport: null,
      lastMonthlyTournament: null,
    };
  }

  if (action.type === "RESET") return initialState;

  return state;
}
