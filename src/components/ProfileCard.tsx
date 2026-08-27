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
  // 状态：取士气 (morale)
  const morale = player.morale ?? 70;
  // 信心：confidence
  const confidence = player.confidence ?? 60;
  // 疲劳：fatigue
  const fatigue = player.fatigue ?? 0;

  // 积分、声望、知名度
  const rankingPoints = player.rankingPoints ?? 0;
  const reputation = player.reputation ?? 0;
  // 知名度以粉丝/知名度数值或声望衍生
  const fame = Math.round((player.reputation * 1.5) + (player.careerStats?.titles || 0) * 100);

  return (
    <div className="profile-card">
      {/* 顶部：国籍 - 阶段 - 等级评定 */}
      <div className="profile-card-header">
        <div className="profile-stage-left">
          {country && <FlagImage iso2={country.iso2} alt={country.label} width={20} height={14} />}
          <span className="country-code-tag">{country?.code ?? player.nationality}</span>
          <span className="stage-badge">{stage}</span>
          <span className="stage-title">{country?.label ?? ""}羽球</span>
        </div>
        <div className="profile-stage-right">
          <span>{level}</span>
        </div>
      </div>

      {/* 中部：号码徽章 + 姓名/年龄 + OVR 总评 */}
      <div className="profile-main-row">
        <div className="profile-player-info">
          <div className="player-number-badge">
            {player.currentSeason || 1}
          </div>
          <div className="player-name-block">
            <h2 className="player-name-text">{player.name}</h2>
            <p className="player-sub-meta">
              <span>{player.handedness === "left" ? "左手持拍" : "右手持拍"}</span>
              <span className="dot-divider">·</span>
              <span>{player.age} 岁</span>
              <span className="dot-divider">·</span>
              <span>{player.height}cm / {player.weight}kg</span>
            </p>
            <p className="player-archetype-line">
              生涯球风 <strong className="archetype-highlight">{player.archetype || "全面型"}</strong>
            </p>
          </div>
        </div>

        {/* 右侧总评 */}
        <div className="profile-ovr-box">
          <span className="ovr-number">{overall}</span>
          <span className="ovr-label">OVR</span>
        </div>
      </div>

      {/* 状态栏 4 栏：健康、疲劳、状态（士气）、信心 */}
      <div className="profile-status-grid">
        <div className="status-item">
          <span className="status-value health">{health}</span>
          <span className="status-label">健康</span>
        </div>
        <div className="status-item">
          <span className="status-value fatigue">{fatigue}</span>
          <span className="status-label">疲劳</span>
        </div>
        <div className="status-item">
          <span className="status-value morale">{morale}</span>
          <span className="status-label">状态</span>
        </div>
        <div className="status-item">
          <span className="status-value confidence">{confidence}</span>
          <span className="status-label">信心</span>
        </div>
      </div>

      {/* 底部 3 栏：积分、声望、知名度 */}
      <div className="profile-stats-grid">
        <div className="stats-col">
          <span className="stat-num">{rankingPoints}</span>
          <span className="stat-tag">积分</span>
        </div>
        <div className="stats-col">
          <span className="stat-num">{reputation}</span>
          <span className="stat-tag">声望</span>
        </div>
        <div className="stats-col">
          <span className="stat-num">{fame}</span>
          <span className="stat-tag">知名度</span>
        </div>
      </div>
    </div>
  );
}
