import type { Player } from "../game/player";
export interface CareerEvent {
  id: string;
  title: string;
  description: string;
  choices: { id: string; label: string; apply: (player: Player) => Player }[];
}
export const careerEvents: CareerEvent[] = [
  {
    id: "coach",
    title: "教练提出新计划",
    description: "教练认为你可以挑战更高强度的训练。",
    choices: [
      {
        id: "accept",
        label: "接受挑战",
        apply: (p) => ({
          ...p,
          fatigue: Math.min(100, p.fatigue + 12),
          confidence: Math.min(100, p.confidence + 5),
        }),
      },
      {
        id: "rest",
        label: "优先恢复",
        apply: (p) => ({
          ...p,
          fatigue: Math.max(0, p.fatigue - 10),
          morale: Math.min(100, p.morale + 3),
        }),
      },
    ],
  },
  {
    id: "media",
    title: "媒体关注",
    description: "一场精彩比赛后，你获得了采访机会。",
    choices: [
      {
        id: "speak",
        label: "接受采访",
        apply: (p) => ({
          ...p,
          confidence: Math.min(100, p.confidence + 7),
          morale: Math.min(100, p.morale + 5),
        }),
      },
      {
        id: "focus",
        label: "专注训练",
        apply: (p) => ({
          ...p,
          attributes: {
            ...p.attributes,
            workEthic: Math.min(99, p.attributes.workEthic + 1),
          },
        }),
      },
    ],
  },
  {
    id: "equipment",
    title: "装备赞助试用",
    description: "一家新品牌邀请你试用他们的球拍。",
    choices: [
      {
        id: "try",
        label: "接受试用",
        apply: (p) => ({ ...p, confidence: Math.min(100, p.confidence + 3) }),
      },
      {
        id: "decline",
        label: "坚持熟悉装备",
        apply: (p) => ({ ...p, morale: Math.min(100, p.morale + 2) }),
      },
    ],
  },
];
careerEvents.push(
  ...Array.from({ length: 27 }, (_, index) => ({
    id: `career-${index + 4}`,
    title: `职业旅程事件 ${index + 4}`,
    description: "职业生涯中出现了一个需要你判断的时刻。",
    choices: [
      {
        id: "commit",
        label: "迎接挑战",
        apply: (p: Player) => ({
          ...p,
          confidence: Math.min(100, p.confidence + 2),
          fatigue: Math.min(100, p.fatigue + 4),
        }),
      },
      {
        id: "balance",
        label: "保持平衡",
        apply: (p: Player) => ({
          ...p,
          morale: Math.min(100, p.morale + 2),
          fatigue: Math.max(0, p.fatigue - 3),
        }),
      },
    ],
  })),
);
