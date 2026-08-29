export interface RestPanelProps {
  onConfirmRest: () => void;
}

export function RestPanel({ onConfirmRest }: RestPanelProps) {
  return (
    <div className="bg-[#0d1926] border border-[#1d334a] rounded-xl p-4 sm:p-5 mt-1 flex flex-col gap-3 text-center items-center">
      <p className="text-sm text-slate-300 font-medium m-0">安排本月进行深度放松、理疗与休整。</p>
      <div className="flex flex-col gap-1 text-xs text-sky-200">
        <span>✨ 疲劳值大幅下降 (-25)</span>
        <span>🩹 促进伤病周期康复</span>
        <span>📉 稍许降低竞技紧绷感 (-2 状态)</span>
      </div>
      <button
        type="button"
        className="mt-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold px-6 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
        onClick={onConfirmRest}
      >
        确认休整 1 个月
      </button>
    </div>
  );
}

