import type { Player } from "../game/player";
import { calculateSinglesOverall } from "../game/player";
import { countryMap } from "./CountryPicker";
import { FlagImage } from "./FlagImage";

export interface ProfileCardProps {
  player: Player;
}

export function getPlayerStage(age: number): string {
  if (age < 15) return "少年组";
  if (age < 18) return "青年组";
  if (age < 22) return "初入成年组";
  if (age < 29) return "巅峰期";
  if (age < 34) return "老将期";
  return "生涯末期";
}

export function getPlayerLevel(overall: number): string {
  if (overall < 40) return "业余新手";
  if (overall < 50) return "业余进阶";
  if (overall < 60) return "省队 / 地区主力";
  if (overall < 70) return "国家队二线 / 挑战赛级";
  if (overall < 80) return "国际健将 / 巡回赛主力";
  if (overall < 90) return "世界名将 / 超级赛争冠";
  return "传奇球星 / 世界顶级";
}

export function ProfileCard({ player }: ProfileCardProps) {
  const country = countryMap[player.nationality];
  const stage = getPlayerStage(player.age);
  const overall = calculateSinglesOverall(player);
  const level = getPlayerLevel(overall);

  // 计算健康值：100 减去伤病影响或疲劳过载
  const health = Math.max(0, 100 - (player.injuries?.length ? player.injuries.length * 20 : 0));
  const morale = player.morale ?? 70;
  const confidence = player.confidence ?? 60;
  const fatigue = player.fatigue ?? 0;

  // 积分、声望、知名度
  const rankingPoints = player.rankingPoints ?? 0;
  const reputation = player.reputation ?? 0;
  const fame = Math.round((player.reputation * 1.5) + (player.careerStats?.titles || 0) * 100);

  return (
    <div className="bg-gradient-to-br from-[#0c1622] via-[#09111b] to-[#060c14] border border-[#1d354b] rounded-2xl p-4 sm:p-5 text-slate-100 shadow-xl flex flex-col gap-4 text-left">
      {/* 顶部：国籍 - 阶段 - 等级评定 */}
      <div className="flex items-center justify-between border-b border-[#182a3c] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {country && <FlagImage iso2={country.iso2} alt={country.label} width={20} height={14} />}
          <span className="bg-[#192b3d] text-[#8fa7ba] font-bold px-1.5 py-0.5 rounded text-[11px]">
            {country?.code ?? player.nationality}
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold px-2 py-0.5 rounded text-[11px]">
            {stage}
          </span>
          <span className="text-slate-400 font-semibold">{country?.label ?? ""}羽球</span>
        </div>
        <div className="text-xs font-bold text-sky-400">
          <span>{level}</span>
        </div>
      </div>

      {/* 中部：号码徽章 + 姓名/年龄 + OVR 总评 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0">
            {player.currentSeason || 1}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0 truncate">
              {player.name}
            </h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 m-0 flex-wrap">
              <span>{player.handedness === "left" ? "左手持拍" : "右手持拍"}</span>
              <span className="text-slate-600">·</span>
              <span>{player.age} 岁</span>
              <span className="text-slate-600">·</span>
              <span>{player.height}cm / {player.weight}kg</span>
            </p>
            <p className="text-xs text-slate-400 m-0">
              生涯球风 <strong className="text-orange-400 font-bold">{player.archetype || "全面型"}</strong>
            </p>
          </div>
        </div>

        {/* 右侧总评 */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#162738] to-[#0e1b27] border border-[#243e59] rounded-xl px-3 py-2 min-w-[64px] shrink-0 shadow-md">
          <span className="text-2xl sm:text-3xl font-black text-white leading-none">{overall}</span>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">OVR</span>
        </div>
      </div>

      {/* 状态栏 4 栏：健康、疲劳、状态（士气）、信心 */}
      <div className="grid grid-cols-4 py-3 border-y border-[#182a3c] text-center">
        <div className="flex flex-col gap-0.5 relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-[#182a3c]">
          <span className="text-lg font-extrabold text-emerald-400">{health}</span>
          <span className="text-[11px] text-slate-400">健康</span>
        </div>
        <div className="flex flex-col gap-0.5 relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-[#182a3c]">
          <span className="text-lg font-extrabold text-orange-400">{fatigue}</span>
          <span className="text-[11px] text-slate-400">疲劳</span>
        </div>
        <div className="flex flex-col gap-0.5 relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-[#182a3c]">
          <span className="text-lg font-extrabold text-blue-400">{morale}</span>
          <span className="text-[11px] text-slate-400">状态</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-extrabold text-amber-300">{confidence}</span>
          <span className="text-[11px] text-slate-400">信心</span>
        </div>
      </div>

      {/* 底部 3 栏：积分、声望、知名度 */}
      <div className="grid grid-cols-3 pt-1 text-center">
        <div className="flex flex-col gap-0.5 relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-[#182a3c]">
          <span className="text-sm font-bold text-slate-200">{rankingPoints}</span>
          <span className="text-[11px] text-slate-500">积分</span>
        </div>
        <div className="flex flex-col gap-0.5 relative after:content-[''] after:absolute after:right-0 after:top-[15%] after:h-[70%] after:w-px after:bg-[#182a3c]">
          <span className="text-sm font-bold text-slate-200">{reputation}</span>
          <span className="text-[11px] text-slate-500">声望</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-slate-200">{fame}</span>
          <span className="text-[11px] text-slate-500">知名度</span>
        </div>
      </div>
    </div>
  );
}

