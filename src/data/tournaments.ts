export type YouthTier = "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7";
export interface Tournament {
  id: string;
  name: string;
  tier: YouthTier;
  level:
    | "youth"
    | "local"
    | "national"
    | "international-series"
    | "international-challenge";
  difficulty: number;
  prestige: number;
  requiredPoints: number;
  requiredReputation: number;
  rankingPoints: {
    winner: number;
    finalist: number;
    semifinal: number;
    quarterfinal: number;
    round16: number;
    round32: number;
  };
  reputationRewards: {
    winner: number;
    finalist: number;
    semifinal: number;
    quarterfinal: number;
    round16: number;
    round32: number;
  };
}
const rewards = (
  winner: number,
  finalist = 0,
  semifinal = 0,
  quarterfinal = 0,
  round16 = 0,
) => ({ winner, finalist, semifinal, quarterfinal, round16, round32: 0 });
const make = (
  id: string,
  name: string,
  tier: YouthTier,
  requiredPoints: number,
  requiredReputation: number,
  reward: ReturnType<typeof rewards>,
): Tournament => ({
  id,
  name,
  tier,
  level:
    tier === "T7" || tier === "T6"
      ? "local"
      : tier === "T5"
        ? "national"
        : tier === "T4"
          ? "international-series"
          : "international-challenge",
  difficulty: 15 + (7 - Number(tier.slice(1))) * 12,
  prestige: reward.winner,
  requiredPoints,
  requiredReputation,
  rankingPoints: reward,
  reputationRewards: reward,
});
export const tournaments: Tournament[] = [
  ...["牵牛花杯", "胡姬花杯", "大红花杯", "太阳花杯", "全校运动会"].map(
    (n, i) => make(`t7-${i}`, n, "T7", 0, 0, rewards(0, 0, 30, 15)),
  ),
  ...["新星赛", "勇者赛", "传奇赛", "总决赛"].map((n, i) =>
    make(`t6-${i}`, n, "T6", 0, 70, rewards(0, 0, 100, 75)),
  ),
  ...["全国羽毛球锦标赛", "全国学生运动会"].map((n, i) =>
    make(`t5-${i}`, n, "T5", 0, 240, rewards(300, 0, 200, 150)),
  ),
  ...[
    "马来西亚青年挑战赛",
    "泰国青年挑战赛",
    "韩国青年挑战赛",
    "日本青年挑战赛",
    "德国青年挑战赛",
    "荷兰青年挑战赛",
    "法国青年挑战赛",
    "丹麦青年挑战赛",
  ].map((n, i) =>
    make(`t3-${i}`, n, "T3", 1000, 0, rewards(2500, 2130, 1750, 1370, 1000)),
  ),
  ...[
    "新加坡青年系列赛",
    "越南青年系列赛",
    "菲律宾青年系列赛",
    "斯里兰卡青年系列赛",
    "葡萄牙青年系列赛",
    "西班牙青年系列赛",
    "爱尔兰青年系列赛",
    "瑞典青年系列赛",
    "美国青年系列赛",
    "秘鲁青年系列赛",
    "新西兰青年系列赛",
    "南非青年系列赛",
  ].map((n, i) =>
    make(`t4-${i}`, n, "T4", 400, 0, rewards(1700, 1450, 1190, 930, 680)),
  ),
  make(
    "t2-korea",
    "韩国青年大奖赛",
    "T2",
    5000,
    0,
    rewards(4000, 3400, 2800, 2200, 1600),
  ),
  make(
    "t2-indonesia",
    "印尼青年大奖赛",
    "T2",
    5000,
    0,
    rewards(4000, 3400, 2800, 2200, 1600),
  ),
  make(
    "t2-india",
    "印度青年大奖赛",
    "T2",
    5000,
    0,
    rewards(4000, 3400, 2800, 2200, 1600),
  ),
  make(
    "t1-asian",
    "亚青赛（U19）",
    "T1",
    10000,
    0,
    rewards(4600, 3900, 3210, 2520, 1800),
  ),
  make(
    "t1-world",
    "BWF世青赛（U19）",
    "T1",
    14000,
    0,
    rewards(6000, 5100, 4200, 3300, 2400),
  ),
];
