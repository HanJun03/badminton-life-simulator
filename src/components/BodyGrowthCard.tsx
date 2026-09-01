import type { Player } from "../game/player";

export function BodyGrowthCard({ player }: { player: Player }) {
  const heightProgress = Math.min(100, Math.round((player.height - 140) / 0.6));
  const weightProgress = Math.min(100, Math.round((player.weight - 35) / 0.65));
  const growthMessage = player.age < 18
    ? "身体仍在发育中，身高与体重会随着年龄逐步变化。"
    : "身体发育已基本稳定，训练会更直接地影响表现。";

  return (
    <section className="rounded-2xl border border-[#1d354b] bg-gradient-to-br from-[#0c1622] to-[#09111b] p-4 sm:p-5 text-left shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-400 m-0">Body Development</p>
          <h2 className="text-base font-black text-white m-0 mt-1">身体成长</h2>
        </div>
        <span className="rounded-lg border border-[#294763] bg-[#122235] px-2 py-1 text-xs font-bold text-slate-300">{player.age} 岁</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <BodyMetric label="当前身高" value={`${player.height} cm`} progress={heightProgress} />
        <BodyMetric label="当前体重" value={`${player.weight} kg`} progress={weightProgress} />
      </div>
      <p className="mt-3 mb-0 text-xs leading-relaxed text-slate-400">{growthMessage}</p>
    </section>
  );
}

function BodyMetric({ label, value, progress }: { label: string; value: string; progress: number }) {
  return (
    <div className="rounded-xl border border-[#1c344b] bg-[#101e2d] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">{label}</span>
        <strong className="text-sm font-black text-amber-300">{value}</strong>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1c3042]">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
