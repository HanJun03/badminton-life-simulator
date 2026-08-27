import type { GameState } from "../state/gameReducer";
const KEY = "badminton-life-save";
const VERSION = "0.1.0";
export function saveGame(state: GameState) {
  sessionStorage.setItem(KEY, JSON.stringify({ gameVersion: VERSION, state }));
}
export function loadGame(): GameState | null {
  try {
    const data = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as {
      gameVersion: string;
      state: GameState;
    } | null;
    return data?.gameVersion === VERSION ? data.state : null;
  } catch {
    return null;
  }
}
export function deleteSave() {
  sessionStorage.removeItem(KEY);
}
