import { GameProvider, useGame } from "./state/GameContext";
import { CreatorPage } from "./pages/CreatorPage";
import { DashboardPage } from "./pages/DashboardPage";

function PageRouter() {
  const { state } = useGame();
  const page = state.player === null ? "creator" : "dashboard";

  return (
    <div className="app-root">
      {page === "creator" && <CreatorPage />}
      {page === "dashboard" && <DashboardPage />}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <PageRouter />
    </GameProvider>
  );
}
