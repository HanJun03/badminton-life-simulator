import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

export type Tab = "physical" | "technical" | "mental";

export const attributeGroups = {
  physical: [
    ["endurance", "体能"],
    ["power", "力量"],
    ["agility", "敏捷"],
    ["reaction", "反应"],
  ],
  technical: [
    ["footwork", "步法"],
    ["receive", "接发"],
    ["netPlay", "网前"],
    ["clear", "高远"],
    ["smash", "杀球"],
    ["dropShot", "吊球"],
    ["drive", "平抽"],
    ["reverse", "反手"],
  ],
  mental: [
    ["IQ", "球商"],
    ["pressure", "抗压"],
    ["mentality", "心态"],
    ["willpower", "意志"],
  ],
} as const;

export interface AttributeListProps {
  attributes: Record<string, number>;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
  showTabs?: boolean;
  mode?: "view" | "add";
  onAdd?: (key: string) => void;
  disabledAdd?: boolean;
}

export function AttributeList({
  attributes,
  activeTab,
  onTabChange,
  showTabs = true,
  mode = "view",
  onAdd,
  disabledAdd = false,
}: AttributeListProps) {
  const [internalTab, setInternalTab] = useState<Tab>("physical");
  const tab = activeTab ?? internalTab;
  const setTab = onTabChange ?? setInternalTab;

  return (
    <div className="flex flex-col gap-3">
      {showTabs && (
        <div className="flex bg-[#0b1520] p-1 rounded-xl border border-[#1b2f42] gap-1">
          {(["physical", "technical", "mental"] as Tab[]).map((k) => (
            <button
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === k
                  ? "bg-[#1a334d] text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              key={k}
              type="button"
              onClick={() => setTab(k)}
            >
              {k === "physical" ? "身体" : k === "technical" ? "技术" : "心理"}
            </button>
          ))}
        </div>
      )}

      <div className={mode === "add" ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5" : "flex flex-col gap-2"}>
        {attributeGroups[tab].map(([key, label]) => {
          const value = attributes[key] ?? 0;

          if (mode === "add") {
            return (
              <div className="bg-[#112030] border border-[#1b334a] rounded-xl p-3 flex flex-col gap-2 text-left" key={key}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-extrabold text-sky-400">{value}</strong>
                    <button
                      className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                      type="button"
                      aria-label={`增加${label}`}
                      onClick={() => onAdd?.(key)}
                      disabled={disabledAdd}
                    >
                      <IconPlus size={16} />
                    </button>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#1b2d3d] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between gap-3 bg-[#112030] border border-[#1a3045] rounded-lg p-2.5 text-left" key={key}>
              <span className="text-xs font-medium text-slate-300 w-16 shrink-0">{label}</span>
              <div className="h-2 flex-1 bg-[#1b2d3d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
              </div>
              <strong className="text-xs font-bold text-sky-400 w-8 text-right shrink-0">{value}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

