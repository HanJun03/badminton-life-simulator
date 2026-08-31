import { useState } from "react";
import { useGame } from "../state/GameContext";
import { calculateSinglesOverall, createPlayer } from "../game/player";
import { CountryPicker } from "../components/CountryPicker";
import { SliderCard } from "../components/SliderCard";
import { AttributeList, type Tab } from "../components/AttributeList";
import { SelectableGrid } from "../components/SelectableGrid";

export function CreatorPage() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState<Tab>("physical");
  const [name, setName] = useState("");
  const [nation, setNation] = useState("MAS");
  const [hand, setHand] = useState<"left" | "right">("right");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [seed, setSeed] = useState("");

  if (state.player) return null;

  const preview = createPlayer(
    name || "预览球员",
    "all-round",
    nation,
    hand,
    height,
    weight,
    seed || undefined,
  );

  return (
    <div className="min-h-screen flex justify-center items-start p-4 sm:p-8 box-border text-center bg-[#070d14] text-slate-100 font-sans">
      <section className="w-full max-w-160 bg-[#09111b] border border-[#1a2d3f] rounded-3xl p-4 sm:p-8 shadow-2xl flex flex-col gap-2 text-left">
        <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase m-0">
          {step === 1 ? "01 · 创建球员" : "02 · 属性面板"}
        </p>

        {step === 1 ? (
          <>
            <div>
              <h1 className="text-xl font-black text-white m-0">
                羽球人生模拟器
              </h1>
              <p className="text-sm text-slate-400 mt-1 mb-0">
                球风将在职业生涯中逐步发展。
              </p>
            </div>

            {/* 输入框：修复字体颜色为高亮白底深色输入框 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                球员姓名
              </label>
              <input
                className="w-full bg-[#112030] border focus:border-blue-500 focus:outline-none text-black text-sm font-semibold rounded-xl px-4 py-3 transition-colors shadow-inner"
                placeholder="输入球员名字（如：李宗伟、林丹）"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold text-slate-300 m-0">选择国籍</h2>
              <CountryPicker value={nation} onChange={setNation} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Character Seed（可选）</label>
              <input
                className="w-full bg-[#112030] border border-[#263d55] focus:border-amber-400 focus:outline-none text-slate-100 text-sm rounded-xl px-4 py-3 transition-colors shadow-inner"
                placeholder="留空则自动生成"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-bold text-slate-300 m-0">持拍手</h2>
              <SelectableGrid
                options={[{ value: "left", label: "左手持拍" }, { value: "right", label: "右手持拍" }] as const}
                value={hand}
                onChange={(v) => setHand(v)}
                ariaLabel="选择持拍手"
              />
            </div>

            <SliderCard
              label="身高"
              unit="cm"
              min={165}
              max={195}
              value={height}
              onChange={setHeight}
            />

            <SliderCard
              label="体重"
              unit="kg"
              min={60}
              max={90}
              value={weight}
              onChange={setWeight}
            />

            <button
              disabled={!name.trim()}
              type="button"
              className="mt-2 w-full bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-40 text-white text-sm font-black py-3.5 rounded-xl cursor-pointer transition-all shadow-lg"
              onClick={() => setStep(2)}
            >
              下一步：预览属性
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center border-b border-[#182a3c] pb-3">
              <div>
                <h1 className="text-2xl font-black text-white m-0">{name}</h1>
                <p className="text-xs text-slate-400 mt-0.5 mb-0">
                  初始总评 OVR{" "}
                  <strong className="text-sky-400">
                    {calculateSinglesOverall(preview)}
                  </strong>
                </p>
              </div>
              <span className="bg-blue-600/20 border border-blue-500 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg">
                13 岁 · 少年组
              </span>
            </div>

            <AttributeList
              attributes={preview.attributes}
              potentialDetails={preview.potentialDetails}
              activeTab={tab}
              onTabChange={(t) => setTab(t)}
            />

            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 bg-[#112030] hover:bg-[#182b40] border border-[#1e354c] text-slate-300 text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors"
                type="button"
                onClick={() => setStep(1)}
              >
                上一步
              </button>
              <button
                type="button"
                className="flex-2 bg-linear-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-black py-3 rounded-xl cursor-pointer transition-colors shadow-lg"
                onClick={() =>
                  dispatch({
                    type: "CREATE_PLAYER",
                    payload: {
                      name,
                      nationality: nation,
                      handedness: hand,
                      height,
                      weight,
                      seed: seed || undefined,
                    },
                  })
                }
              >
                开启羽球人生 🚀
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
