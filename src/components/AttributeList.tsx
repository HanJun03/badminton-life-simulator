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
    <>
      {showTabs && (
        <div className="tab-bar">
          {(["physical", "technical", "mental"] as Tab[]).map((k) => (
            <button
              className={tab === k ? "tab active" : "tab"}
              key={k}
              type="button"
              onClick={() => setTab(k)}
            >
              {k === "physical" ? "身体" : k === "technical" ? "技术" : "心理"}
            </button>
          ))}
        </div>
      )}
      <div className={mode === "add" ? "attribute-cards" : "attribute-list"}>
        {attributeGroups[tab].map(([key, label]) => {
          const value = attributes[key] ?? 0;

          if (mode === "add") {
            return (
              <div className="attribute-card" key={key}>
                <div className="attribute-top">
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <button
                    className="plus-icon"
                    type="button"
                    aria-label={`增加${label}`}
                    onClick={() => onAdd?.(key)}
                    disabled={disabledAdd}
                  >
                    <IconPlus size={20} />
                  </button>
                </div>
                <div className="attribute-track">
                  <div
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  />
                </div>
                <div className="attribute-scale">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            );
          }

          return (
            <div className="attribute-row" key={key}>
              <span>{label}</span>
              <strong>{value}</strong>
              <progress min="0" max="100" value={value} />
            </div>
          );
        })}
      </div>
    </>
  );
}
