import type { Player } from "../game/player";
import { createPlayer } from "../game/player";
import { trainPlayer } from "../game/training";
import { createRNG } from "../game/rng";
import { createAIPool } from "../game/ai";
import { tournaments } from "../data/tournaments";
import {
  canEnterTournament,
  runTournament,
  type TournamentResult,
} from "../game/tournament";
import { updateRankings } from "../game/ranking";
import { advanceAge } from "../game/progression";
import { recoverFromInjuries } from "../game/injury";
import { careerEvents } from "../data/events";
export interface GameState {
  player: Player | null;
  seed: string;
  lastTournament: TournamentResult | null;
  activeEvent: string | null;
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
        archetype?:
          | "all-round"
          | "attacking"
          | "defensive"
          | "technical"
          | "speed";
      };
    }
  | {
      type: "TRAIN";
      payload: {
        category: "technical" | "physical" | "mental" | "recovery";
        intensity: "low" | "normal" | "high";
      };
    }
  | { type: "PLAY_TOURNAMENT"; payload: { tournamentId: string } }
  | { type: "ADVANCE_SEASON" }
  | { type: "TRIGGER_EVENT" }
  | { type: "CHOOSE_EVENT"; payload: { choiceId: string } }
  | {
      type: "UPDATE_ATTRIBUTES";
      payload: { attributes: Record<string, number> };
    }
  | { type: "RETIRE" }
  | { type: "RESET" };
export const initialState: GameState = {
  player: null,
  seed: "MALAYSIA2026",
  lastTournament: null,
  activeEvent: null,
};
export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "UPDATE_ATTRIBUTES" && state.player) {
    return {
      ...state,
      player: {
        ...state.player,
        attributes: {
          ...state.player.attributes,
          ...action.payload.attributes,
        } as typeof state.player.attributes,
      },
    };
  }
  if (action.type === "CREATE_PLAYER")
    return {
      ...state,
      player: createPlayer(
        action.payload.name,
        "all-round",
        action.payload.nationality ?? "MAS",
        action.payload.handedness ?? "right",
        action.payload.height ?? 165,
        action.payload.weight ?? 65,
      ),
    };
  if (action.type === "TRAIN" && state.player && !state.player.retired)
    return {
      ...state,
      player: trainPlayer(
        state.player,
        action.payload.category,
        action.payload.intensity,
        createRNG(
          `${state.seed}-${state.player.currentSeason}-${state.player.fatigue}`,
        ),
      ),
    };
  if (
    action.type === "PLAY_TOURNAMENT" &&
    state.player &&
    !state.player.retired
  ) {
    const tournament = tournaments.find(
      (t) => t.id === action.payload.tournamentId,
    );
    if (!tournament || !canEnterTournament(state.player, tournament))
      return state;
    const result = runTournament(
      state.player,
      createAIPool(
        5,
        createRNG(
          `${state.seed}-${tournament.id}-${state.player.currentSeason}`,
        ),
      ),
      tournament,
      createRNG(`${state.seed}-matches-${state.player.currentSeason}`),
    );
    const ranked =
      updateRankings([
        result.player,
        ...createAIPool(20, createRNG(`${state.seed}-ranking`)),
      ]).find((p) => p.id === result.player.id) ?? result.player;
    return { ...state, player: ranked, lastTournament: result.result };
  }
  if (action.type === "ADVANCE_SEASON" && state.player && !state.player.retired)
    return {
      ...state,
      player: recoverFromInjuries(advanceAge(state.player)),
      lastTournament: null,
    };
  if (action.type === "TRIGGER_EVENT" && state.player && !state.player.retired)
    return { ...state, activeEvent: careerEvents[0]?.id ?? null };
  if (action.type === "CHOOSE_EVENT" && state.player && state.activeEvent) {
    const event = careerEvents.find((e) => e.id === state.activeEvent);
    const choice = event?.choices.find((c) => c.id === action.payload.choiceId);
    return choice
      ? { ...state, player: choice.apply(state.player), activeEvent: null }
      : state;
  }
  if (action.type === "RETIRE" && state.player)
    return {
      ...state,
      player: { ...state.player, retired: true },
      activeEvent: null,
    };
  if (action.type === "RESET") return initialState;
  return state;
}
