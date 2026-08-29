import { useState } from "react";
import type { Player } from "../game/player";
import type { MonthlyTraining } from "../game/monthly";
import { getAvailableTournamentsForPlayer } from "../data/youthCalendar";
import { CompetitionSelector } from "./CompetitionSelector";
import { TrainingSelector } from "./TrainingSelector";
import { RestPanel } from "./RestPanel";

export interface MonthlyActionPanelProps {
  player: Player;
  month: number;
  onTrain: (kind: MonthlyTraining) => void;
  onRest: () => void;
  onCompete: (tournamentId: string) => void;
}

type MainCategory = "none" | "compete" | "train" | "rest";

export function MonthlyActionPanel({
  player,
  month,
  onTrain,
  onRest,
  onCompete,
}: MonthlyActionPanelProps) {
  const [mainCat, setMainCat] = useState<MainCategory>("none");

  const availableTourneys = getAvailableTournamentsForPlayer(month, player);
  const isInjured = (player.injuries?.length ?? 0) > 0;

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* 顶部月份提示栏 */}
      <div className="flex items-center gap-3 bg-[#0f1c29] px-3.5 py-2.5 rounded-xl border border-[#1c3247]">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
          第 {month} 月
        </div>
        <div className="text-sm font-semibold text-slate-200">
          请选择本月专注的行动方向：
        </div>
      </div>

      {/* 3 个主要行动选项按钮（从上到下排列） */}
      <div className="flex flex-col gap-2.5">
        {/* 1. 参加比赛 */}
        <button
          type="button"
          onClick={() => setMainCat(mainCat === "compete" ? "none" : "compete")}
          disabled={isInjured || availableTourneys.length === 0}
          className={`flex flex-row items-center text-left gap-4 p-3.5 sm:px-4.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            mainCat === "compete"
              ? "bg-[#172433] border-orange-500 shadow-[0_0_0_1px_#f97316]"
              : "bg-[#0b1520] border-[#1c3044] hover:bg-[#102233] hover:border-blue-500 hover:translate-x-1"
          } ${isInjured || availableTourneys.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="text-2xl w-11 h-11 flex items-center justify-center bg-[#112030] rounded-xl shrink-0">
            🏸
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="text-sm font-bold text-slate-100">参加比赛</div>
            <div className="text-xs text-slate-400 leading-tight">
              {isInjured
                ? "受伤养伤中，禁止参赛"
                : availableTourneys.length > 0
                ? `本月有 ${availableTourneys.length} 项可选赛事`
                : "本月无符合资格赛事"}
            </div>
          </div>
        </button>

        {/* 2. 专项训练 */}
        <button
          type="button"
          onClick={() => setMainCat(mainCat === "train" ? "none" : "train")}
          className={`flex flex-row items-center text-left gap-4 p-3.5 sm:px-4.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            mainCat === "train"
              ? "bg-[#172433] border-orange-500 shadow-[0_0_0_1px_#f97316]"
              : "bg-[#0b1520] border-[#1c3044] hover:bg-[#102233] hover:border-blue-500 hover:translate-x-1"
          }`}
        >
          <div className="text-2xl w-11 h-11 flex items-center justify-center bg-[#112030] rounded-xl shrink-0">
            ⚡
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="text-sm font-bold text-slate-100">专项训练</div>
            <div className="text-xs text-slate-400 leading-tight">
              +状态与信心，定向强化属性
            </div>
          </div>
        </button>

        {/* 3. 休整恢复 */}
        <button
          type="button"
          onClick={() => setMainCat(mainCat === "rest" ? "none" : "rest")}
          className={`flex flex-row items-center text-left gap-4 p-3.5 sm:px-4.5 rounded-xl border transition-all duration-200 cursor-pointer ${
            mainCat === "rest"
              ? "bg-[#172433] border-orange-500 shadow-[0_0_0_1px_#f97316]"
              : "bg-[#0b1520] border-[#1c3044] hover:bg-[#102233] hover:border-blue-500 hover:translate-x-1"
          }`}
        >
          <div className="text-2xl w-11 h-11 flex items-center justify-center bg-[#112030] rounded-xl shrink-0">
            ☕
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="text-sm font-bold text-slate-100">休整恢复</div>
            <div className="text-xs text-slate-400 leading-tight">
              +健康，-疲劳，恢复伤势
            </div>
          </div>
        </button>
      </div>

      {/* 独立组件 1：赛事选择器 */}
      {mainCat === "compete" && (
        <CompetitionSelector
          tournaments={availableTourneys}
          isInjured={isInjured}
          onSelectTournament={onCompete}
        />
      )}

      {/* 独立组件 2：训练选择器 */}
      {mainCat === "train" && (
        <TrainingSelector onSelectTraining={onTrain} />
      )}

      {/* 独立组件 3：休整面板 */}
      {mainCat === "rest" && (
        <RestPanel onConfirmRest={onRest} />
      )}
    </div>
  );
}


