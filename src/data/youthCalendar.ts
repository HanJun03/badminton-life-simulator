import { tournaments, type Tournament } from "./tournaments";
import type { Player } from "../game/player";
import { canEnterTournament } from "../game/tournament";

// 12 个月青少年赛事日历（严格按照规则排布，全年无重复赛事）
// T7: 牵牛花杯(1月), 胡姬花杯(4月), 大红花杯(7月), 太阳花杯(10月), 全校运动会(10月)
// T6: 新星赛(2月), 勇者赛(5月), 传奇赛(8月), 总决赛(11月)
// T5: 全国学生运动会(9月), 全国羽毛球锦标赛(12月)
// T4: 每个月 1 项系列赛 (1~12月对应 12 个国家青年系列赛)
// T3+T2: 穿插覆盖 11 个月 (留下 7 月作为大赛/备战月不排T2/T3)
// T1: 亚青赛(7月), 世青赛(11月)
export const youthCalendar: Record<number, string[]> = {
  1: ["t7-0", "t4-0", "t3-0"], // 1月: 牵牛花杯(T7), 新加坡青年系列赛(T4), 马来西亚青年挑战赛(T3)
  2: ["t6-0", "t4-1", "t3-1"], // 2月: 新星赛(T6), 越南青年系列赛(T4), 泰国青年挑战赛(T3)
  3: ["t4-2", "t2-korea"], // 3月: 菲律宾青年系列赛(T4), 韩国青年大奖赛(T2)
  4: ["t7-1", "t4-3", "t3-2"], // 4月: 胡姬花杯(T7), 斯里兰卡青年系列赛(T4), 韩国青年挑战赛(T3)
  5: ["t6-1", "t4-4", "t2-indonesia"], // 5月: 勇者赛(T6), 葡萄牙青年系列赛(T4), 印尼青年大奖赛(T2)
  6: ["t7-4", "t4-5", "t3-3"], // 6月: 西班牙青年系列赛(T4), 日本青年挑战赛(T3)
  7: ["t7-2", "t4-6", "t1-asian"], // 7月: 大红花杯(T7), 爱尔兰青年系列赛(T4), 亚青赛(T1) [T2/T3轮空]
  8: ["t6-2", "t4-7", "t2-india"], // 8月: 传奇赛(T6), 瑞典青年系列赛(T4), 印度青年大奖赛(T2)
  9: ["t5-1", "t4-8", "t3-4"], // 9月: 全国学生运动会(T5), 美国青年系列赛(T4), 德国青年挑战赛(T3)
  10: ["t7-3", "t4-9", "t3-5"], // 10月: 太阳花杯(T7), 全校运动会(T7), 秘鲁青年系列赛(T4), 荷兰青年挑战赛(T3)
  11: ["t6-3", "t4-10", "t3-6", "t1-world"], // 11月: 总决赛(T6), 新西兰青年系列赛(T4), 法国青年挑战赛(T3), BWF世青赛(T1)
  12: ["t5-0", "t4-11", "t3-7"], // 12月: 全国羽毛球锦标赛(T5), 南非青年系列赛(T4), 丹麦青年挑战赛(T3)
};

export function tournamentsForMonth(month: number): Tournament[] {
  const ids = youthCalendar[month] ?? [];
  return ids
    .map((id) => tournaments.find((t) => t.id === id))
    .filter((t): t is Tournament => Boolean(t));
}

export function getAvailableTournamentsForPlayer(
  month: number,
  player: Player,
): Tournament[] {
  const monthTourneys = tournamentsForMonth(month);
  const eligible = monthTourneys.filter((t) => canEnterTournament(player, t));

  // 按照 difficulty / tier 从高到低排序，最多提供 3 个级别最高的可选赛事
  eligible.sort((a, b) => b.difficulty - a.difficulty);

  // 如果球员一个高阶的都进不去，但本月有低级别赛事，取门槛最低的保底
  if (eligible.length === 0) {
    const baseline = monthTourneys.filter(
      (t) =>
        t.requiredPoints === 0 &&
        t.requiredReputation === 0 &&
        player.age >= 13 &&
        player.age <= 18,
    );
    return baseline.slice(0, 1);
  }

  return eligible.slice(0, 3);
}
