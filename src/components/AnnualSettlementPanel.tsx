import { useState } from "react";
import type { Player } from "../game/player";
import type { AnnualReport } from "../game/monthly";
import { AttributeList, type Tab } from "./AttributeList";

export interface AnnualSettlementPanelProps {
  player: Player;
  report: AnnualReport;
  onConfirm: (allocatedAttributes: Record<string, number>) => void;
}

export function AnnualSettlementPanel({
  player,
  report,
  onConfirm,
}: AnnualSettlementPanelProps) {
  const [tab, setTab] = useState<Tab>("physical");
  const [points, setPoints] = useState(report.totalPoints);
  const [values, setValues] = useState<Record<string, number>>({
    ...player.attributes,
  });

  const add = (key: string) => {
    if (points <= 0) return;
    setPoints(points - 1);
    setValues((prev) => ({
      ...prev,
      [key]: Math.min(100, (prev[key] ?? player.attributes[key]) + 1),
    }));
  };

  return (
    <div className="mt-6 flex flex-col gap-4 text-left">
      <div>
        <h2 className="text-xl font-black text-white m-0">🎉 第 {player.currentSeason} 赛季年度总结</h2>
        <p className="text-xs text-slate-400 mt-1 mb-0">你完成了本年度 12 个月的征程！根据本年度成就评定可分配点数：</p>
      </div>

      <div className="bg-[#0d1a29] border border-[#1e354c] rounded-xl p-3.5 flex flex-col gap-2 shadow-sm">
        <div className="flex justify-between items-center text-xs text-slate-300 border-b border-[#162738] pb-1.5">
          <span>📅 年度基础加点</span>
          <strong className="text-sky-400">+{report.basePoints} 点</strong>
        </div>
        {report.achievements.map((item, idx) => (
          <div className="flex justify-between items-center text-xs text-slate-300 border-b border-[#162738] pb-1.5" key={idx}>
            <span>🏆 {item.label}</span>
            <strong className="text-sky-400">+{item.points} 点</strong>
          </div>
        ))}
        <div className="flex justify-between items-center text-sm font-bold text-slate-100 pt-1">
          <span>年度总计可分配点数</span>
          <span className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-2.5 py-1 rounded-md text-sm font-extrabold shadow-sm">
            {report.totalPoints} 点
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-emerald-400 tracking-wider m-0">ATTRIBUTE ALLOCATION</p>
          <h3 className="text-base font-extrabold text-white m-0">能力点数分配</h3>
        </div>
        <strong className="text-sm font-black text-amber-400">剩余 {points} 点</strong>
      </div>

      <AttributeList
        attributes={values}
        activeTab={tab}
        onTabChange={setTab}
        mode="add"
        onAdd={add}
        disabledAdd={points <= 0}
      />

      <button
        type="button"
        className="mt-3 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-black p-3.5 rounded-xl cursor-pointer transition-colors shadow-lg text-center"
        onClick={() => onConfirm(values)}
      >
        完成加点，迈入第 {player.currentSeason + 1} 赛季 ( {player.age + 1} 岁 )
      </button>
    </div>
  );
}

