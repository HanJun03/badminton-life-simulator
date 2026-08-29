import type { Tournament } from "../data/tournaments";

export interface CompetitionSelectorProps {
  tournaments: Tournament[];
  isInjured: boolean;
  onSelectTournament: (tournamentId: string) => void;
}

export function CompetitionSelector({
  tournaments,
  isInjured,
  onSelectTournament,
}: CompetitionSelectorProps) {
  if (isInjured) {
    return (
      <div className="bg-[#0d1926] border border-[#1d334a] rounded-xl p-3.5 mt-1 animate-fadeIn">
        <div className="bg-red-500/15 border border-red-500 text-red-300 p-2.5 rounded-lg text-xs text-left">
          ⚠️ <strong>处于伤病康复期</strong>：当前身体状况无法承受高强度对抗，禁止出征赛事。
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="bg-[#0d1926] border border-[#1d334a] rounded-xl p-3.5 mt-1 animate-fadeIn">
        <p className="text-slate-400 text-center my-2 text-xs">
          本月无符合参赛资格的赛事（需满足年龄及积分/声望要求）
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1926] border border-[#1d334a] rounded-xl p-3.5 mt-1 flex flex-col gap-2.5">
      <h3 className="text-xs font-bold text-slate-400 mb-1 text-left">
        本月可参加赛事（最多 3 场）
      </h3>
      <div className="flex flex-col gap-2.5">
        {tournaments.map((t) => (
          <div
            className="bg-[#112233] border border-[#233e59] rounded-lg p-3 flex flex-col gap-2 text-left"
            key={t.id}
          >
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                {t.tier}
              </span>
              <strong className="text-sm text-slate-100">{t.name}</strong>
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <span>难度: {t.difficulty}</span>
              <span>
                积分奖励: {t.rankingPoints.winner || t.rankingPoints.semifinal || 30}
              </span>
            </div>
            <button
              type="button"
              className="self-end bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-md cursor-pointer transition-colors"
              onClick={() => onSelectTournament(t.id)}
            >
              出征此赛事
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

