import { useState } from "react";
import { useGame } from "../state/GameContext";
import { calculateSinglesOverall, createPlayer } from "../game/player";
import { CountryPicker } from "../components/CountryPicker";
import { SliderCard } from "../components/SliderCard";
import { AttributeList, type Tab } from "../components/AttributeList";

export function CreatorPage() {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState<Tab>("physical");
  const [name, setName] = useState("");
  const [nation, setNation] = useState("MAS");
  const [hand, setHand] = useState<"left" | "right">("right");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);

  if (state.player) return null;

  const preview = createPlayer(
    name || "预览球员",
    "all-round",
    nation,
    hand,
    height,
    weight,
  );

  return (
    <div className="creator-v4">
      <section className="creator-panel">
        <p className="eyebrow">
          {step === 1 ? "01 · 创建球员" : "02 · 属性面板"}
        </p>
        {step === 1 ? (
          <>
            <h1>羽球人生模拟器</h1>
            <p className="subtitle">球风将在职业生涯中逐步发展。</p>
            <input
              placeholder="输入球员名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <h2>选择国籍</h2>
            <CountryPicker value={nation} onChange={setNation} />

            <h2>惯用手</h2>
            <div className="hand-grid">
              <button
                className={
                  hand === "left" ? "country-chip selected" : "country-chip"
                }
                type="button"
                onClick={() => setHand("left")}
              >
                左手
              </button>
              <button
                className={
                  hand === "right" ? "country-chip selected" : "country-chip"
                }
                type="button"
                onClick={() => setHand("right")}
              >
                右手
              </button>
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
              onClick={() => setStep(2)}
            >
              下一步
            </button>
          </>
        ) : (
          <>
            <h1>{name}</h1>
            <p className="subtitle">
              初始总评 {calculateSinglesOverall(preview)}
            </p>

            <AttributeList
              attributes={preview.attributes}
              activeTab={tab}
              onTabChange={setTab}
            />

            <div className="wizard-actions">
              <button
                className="secondary"
                type="button"
                onClick={() => setStep(1)}
              >
                上一步
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "CREATE_PLAYER",
                    payload: {
                      name,
                      nationality: nation,
                      handedness: hand,
                      height,
                      weight,
                    },
                  })
                }
              >
                开始人生
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
