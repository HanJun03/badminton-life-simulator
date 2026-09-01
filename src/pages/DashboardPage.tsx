import { useGame } from "../state/GameContext";
import { ProfileCard } from "../components/ProfileCard";
import { MonthlyActionPanel } from "../components/MonthlyActionPanel";
import { TournamentResultCard } from "../components/TournamentResultCard";
import { AnnualSettlementPanel } from "../components/AnnualSettlementPanel";
import type { MonthlyTraining } from "../game/monthly";
import { BodyGrowthCard } from "../components/BodyGrowthCard";
import { DebugBalancePanel } from "../components/DebugBalancePanel";

export function DashboardPage() {
  const { state, dispatch } = useGame();

  if (!state.player) return null;
  const p = state.player;

  // 判断当前界面状态
  const isAnnualSettlement = state.currentMonth > 12 || Boolean(state.annualReport);
  const showTournamentResult = Boolean(state.lastMonthlyTournament);

  const handleTrain = (kind: MonthlyTraining) => {
    dispatch({ type: "MONTHLY_ACTION_TRAIN", payload: { kind } });
    if (state.currentMonth === 12) {
      dispatch({ type: "START_ANNUAL_SETTLEMENT" });
    }
  };

  const handleRest = () => {
    dispatch({ type: "MONTHLY_ACTION_REST" });
    if (state.currentMonth === 12) {
      dispatch({ type: "START_ANNUAL_SETTLEMENT" });
    }
  };

  const handleCompete = (tournamentId: string) => {
    dispatch({ type: "MONTHLY_ACTION_TOURNAMENT", payload: { tournamentId } });
  };

  const handleDismissTournamentResult = () => {
    dispatch({ type: "CLEAR_MONTHLY_TOURNAMENT_RESULT" });
    if (state.currentMonth > 12 && !state.annualReport) {
      dispatch({ type: "START_ANNUAL_SETTLEMENT" });
    }
  };

  const handleConfirmAnnualSettlement = (allocatedAttributes: Record<string, number>) => {
    dispatch({
      type: "APPLY_ANNUAL_SETTLEMENT",
      payload: { allocatedAttributes },
    });
  };

  return (
    <main className="min-h-screen flex justify-center items-start p-4 sm:p-8 box-border text-center bg-[#070d14] text-slate-100 font-sans">
      <section className="w-full max-w-[680px] bg-[#09111b] border border-[#1a2d3f] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4">
        {/* 顶部始终显示 ProfileCard */}
        <ProfileCard player={p} />
        <BodyGrowthCard player={p} />
        {import.meta.env.DEV && <DebugBalancePanel player={p} />}

        {/* 1. 如果有刚打完的比赛结果，优先展示战报 */}
        {showTournamentResult && state.lastMonthlyTournament && (
          <TournamentResultCard
            result={state.lastMonthlyTournament}
            onContinue={handleDismissTournamentResult}
          />
        )}

        {/* 2. 如果已完成 12 个月，展示年度结算与加点 */}
        {!showTournamentResult && isAnnualSettlement && state.annualReport && (
          <AnnualSettlementPanel
            player={p}
            report={state.annualReport}
            onConfirm={handleConfirmAnnualSettlement}
          />
        )}

        {/* 3. 正常 1-12 月份行动选择面板 */}
        {!showTournamentResult && !isAnnualSettlement && (
          <MonthlyActionPanel
            player={p}
            month={state.currentMonth}
            onTrain={handleTrain}
            onRest={handleRest}
            onCompete={handleCompete}
          />
        )}
      </section>
    </main>
  );
}
