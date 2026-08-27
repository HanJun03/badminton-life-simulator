import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  gameReducer,
  initialState,
  type GameAction,
  type GameState,
} from "./gameReducer";
import { loadGame, saveGame } from "../utils/storage";
const GameContext = createContext<{
  state: GameState;
  dispatch: (action: GameAction) => void;
} | null>(null);
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    () => loadGame() ?? initialState,
  );
  useEffect(() => {
    if (state.player) saveGame(state);
  }, [state]);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
