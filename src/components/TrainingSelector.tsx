import { useState } from "react";
import type { MonthlyTraining } from "../game/monthly";

export interface TrainingSelectorProps {
  onSelectTraining: (kind: MonthlyTraining) => void;
}

type TrainTab = "body" | "tech" | "mental";

export function TrainingSelector({ onSelectTraining }: TrainingSelectorProps) {
  const [trainTab, setTrainTab] = useState<TrainTab>("body");

  return (
    <div className="bg-[#0d1926] border border-[#1d334a] rounded-xl p-3.5 mt-1 flex flex-col gap-3">
      {/* 3 个训练子 Tab */}
      <div className="flex gap-2 border-b border-[#1c3044] pb-2">
        <button
          type="button"
          className={`text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
            trainTab === "body"
              ? "bg-[#1a334d] text-sky-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setTrainTab("body")}
        >
          身体训练
        </button>
        <button
          type="button"
          className={`text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
            trainTab === "tech"
              ? "bg-[#1a334d] text-sky-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setTrainTab("tech")}
        >
          技术训练
        </button>
        <button
          type="button"
          className={`text-xs font-semibold px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
            trainTab === "mental"
              ? "bg-[#1a334d] text-sky-400 font-bold"
              : "text-slate-400 hover:text-slate-200"
          }`}
          onClick={() => setTrainTab("mental")}
        >
          心理训练
        </button>
      </div>

      {/* 训练选项列表 */}
      <div className="flex flex-col gap-2">
        {trainTab === "body" && (
          <>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">体能拉练</strong>
                <p className="text-xs text-slate-400 m-0">强化心肺耐力与移动脚步（+体能、+敏捷）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("endurance")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">力量核心</strong>
                <p className="text-xs text-slate-400 m-0">增强核心与挥拍爆发杀伤力（+力量）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("power")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">反应敏捷</strong>
                <p className="text-xs text-slate-400 m-0">多球反应训练与接杀预判（+反应）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("reaction")}
              >
                执行训练
              </button>
            </div>
          </>
        )}

        {trainTab === "tech" && (
          <>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">专项补强</strong>
                <p className="text-xs text-slate-400 m-0">将自身最擅长的两项技术推向极致（+最高2项能力）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("top")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">补足弱点</strong>
                <p className="text-xs text-slate-400 m-0">针对全场技术短板进行特训（+最低2项能力）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("weak")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">全面综合训练</strong>
                <p className="text-xs text-slate-400 m-0">进行综合多球与对抗演练（+随机4项能力）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("all")}
              >
                执行训练
              </button>
            </div>
          </>
        )}

        {trainTab === "mental" && (
          <>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">研究录像与战术</strong>
                <p className="text-xs text-slate-400 m-0">钻研对手习惯与球路套路（+球商）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("IQ")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">极限抗压特训</strong>
                <p className="text-xs text-slate-400 m-0">关键分逆境模拟（+抗压、+意志）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("pressure")}
              >
                执行训练
              </button>
            </div>
            <div className="flex items-center justify-between bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 sm:px-3 text-left">
              <div>
                <strong className="text-sm text-slate-200 block">接受心理辅导</strong>
                <p className="text-xs text-slate-400 m-0">心理疏导与自我建设（+心态）</p>
              </div>
              <button
                type="button"
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap transition-colors"
                onClick={() => onSelectTraining("mentality")}
              >
                执行训练
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

