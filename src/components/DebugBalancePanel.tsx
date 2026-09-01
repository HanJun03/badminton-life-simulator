import { useState } from "react";
import type { Player } from "../game/player";
import { analyzeBalanceAsync, type BalanceReport } from "../game/balance";
import { getCountryProfile } from "../data/countryProfiles";

export function DebugBalancePanel({ player }: { player: Player }) {
  const [report, setReport] = useState<BalanceReport | null>(null);
  const [running, setRunning] = useState(0);
  const country = getCountryProfile(player.nationality);

  return (
    <details className="rounded-2xl border border-amber-500/30 bg-[#0b1520] text-left">
      <summary className="cursor-pointer px-4 py-3 text-xs font-bold text-amber-300">DEV · Debug / Balance</summary>
      <div className="grid gap-3 border-t border-[#1d354b] p-4 text-xs text-slate-300">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <DebugValue label="Character Seed" value={player.characterSeed} />
          <DebugValue label="Peak Age" value={`${player.peakAge} 岁`} />
          <DebugValue label="Height Ceiling" value={`${player.bodyPotential.heightCeiling} cm`} />
          <DebugValue label="Weight Ceiling" value={`${player.bodyPotential.weightCeiling} kg`} />
        </div>
        <div className="rounded-lg border border-[#263d55] bg-[#101e2d] p-3">
          <p className="m-0 text-sky-300 font-bold">Country Profile</p>
          <p className="m-0 mt-1 text-slate-400">普及 {country.popularity} · 青训竞争 {country.youthCompetition} · 教练 {country.coachingQuality} · 场地 {country.facilityQuality}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[100, 1000, 10000].map((size) => (
            <button key={size} type="button" disabled={running > 0} className="rounded-lg border border-[#315171] bg-[#122235] px-3 py-2 text-xs font-bold text-sky-300 hover:border-sky-400 disabled:cursor-wait disabled:opacity-50" onClick={async () => { setRunning(size); setReport(null); setReport(await analyzeBalanceAsync(size)); setRunning(0); }}>
              {running === size ? `分析中… ${size}` : `分析 ${size} Seeds`}
            </button>
          ))}
        </div>
        {report && (
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#263d55] bg-[#101e2d] p-3 sm:grid-cols-4">
            <DebugValue label="样本数" value={`${report.sampleSize}`} />
            <DebugValue label="Overall 平均" value={`${report.overall.average}`} />
            <DebugValue label="Ceiling 平均" value={`${report.ceilings.average}`} />
            <DebugValue label="突出能力率" value={`${report.standoutRate}%`} />
          </div>
        )}
      </div>
    </details>
  );
}

function DebugValue({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-[#101e2d] p-2"><span className="block text-[10px] text-slate-500">{label}</span><strong className="mt-1 block break-all text-amber-300">{value}</strong></div>;
}
