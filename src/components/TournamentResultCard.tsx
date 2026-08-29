import type { MonthlyTournamentResult } from "../game/monthlyTournament";

export interface TournamentResultCardProps {
  result: MonthlyTournamentResult;
  onContinue: () => void;
}

export function TournamentResultCard({ result, onContinue }: TournamentResultCardProps) {
  const isGood = result.placement === "winner" || result.placement === "finalist";

  return (
    <div className="mt-6 bg-[#0d1926] border border-[#1f364d] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-center shadow-xl">
      <div className="flex items-center justify-center gap-2">
        <span className="bg-orange-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded">
          {result.tier}
        </span>
        <h2 className="text-lg font-black text-slate-100 m-0">{result.tournamentName} 战报</h2>
      </div>

      <div
        className={`py-3 px-4 rounded-xl text-xl sm:text-2xl font-black border ${
          isGood
            ? "bg-yellow-500/15 border-yellow-500 text-yellow-300"
            : "bg-[#142436] border-[#233e59] text-slate-300"
        }`}
      >
        <span>{result.placementName}</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#112030] rounded-xl p-2.5 flex flex-col gap-1 border border-[#1c3044]">
          <span className="text-[11px] text-slate-400">获得积分</span>
          <strong className="text-base font-extrabold text-sky-400">+{result.rankingPointsEarned}</strong>
        </div>
        <div className="bg-[#112030] rounded-xl p-2.5 flex flex-col gap-1 border border-[#1c3044]">
          <span className="text-[11px] text-slate-400">获得声望</span>
          <strong className="text-base font-extrabold text-sky-400">+{result.reputationEarned}</strong>
        </div>
        <div className="bg-[#112030] rounded-xl p-2.5 flex flex-col gap-1 border border-[#1c3044]">
          <span className="text-[11px] text-slate-400">积累疲劳</span>
          <strong className="text-base font-extrabold text-orange-400">+{result.fatigueAdded}</strong>
        </div>
      </div>

      {result.injurySustained && (
        <div className="bg-red-500/15 border border-red-500 text-red-300 p-2.5 rounded-xl text-xs text-left">
          ⚠️ <strong>发生伤病</strong>：在激烈的比赛中遭受了 {result.injurySustained.type} 损伤（需康复 {result.injurySustained.remainingWeeks} 周）。
        </div>
      )}

      <button
        type="button"
        className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors shadow-md"
        onClick={onContinue}
      >
        确认并进入下个月
      </button>
    </div>
  );
}

