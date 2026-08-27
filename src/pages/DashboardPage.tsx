import { useState } from "react";
import { useGame } from "../state/GameContext";
import { calculateSinglesOverall } from "../game/player";
import { createRNG } from "../game/rng";
import { countryMap } from "../components/CountryPicker";
import { AttributeList, type Tab } from "../components/AttributeList";
import { EventCard } from "../components/EventCard";
import { ProfileCard } from "../components/ProfileCard";
import { careerEvents } from "../data/events";
type Phase = "roll" | "allocate" | "season" | "settlement";
export function DashboardPage() {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<Phase>("roll");
  const [tab, setTab] = useState<Tab>("physical");
  const [_dice, setDice] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [values, setValues] = useState<Record<string, number>>({});
  const [eventIndex, setEventIndex] = useState(0);
  const [score, setScore] = useState(0);
  if (!state.player) return null;
  const p = state.player;
  const currentEvent = careerEvents[eventIndex % careerEvents.length];
  const roll = () => {
    const r = createRNG(`${p.id}-${p.currentSeason}-${Date.now()}`);
    const d = Array.from({ length: r.int(3, 6) }, () => r.int(1, 6));
    setDice(d);
    setPoints(d.reduce((a, b) => a + b, 0));
    setValues(Object.fromEntries(Object.entries(p.attributes)));
    setPhase("allocate");
  };
  const add = (key: string) => {
    if (points <= 0) return;
    setPoints(points - 1);
    setValues({
      ...values,
      [key]: Math.min(100, (values[key] ?? p.attributes[key]) + 1),
    });
  };
  const handleEventChoice = (choiceId: string) => {
    const choice = currentEvent?.choices.find((c) => c.id === choiceId);
    if (choice && state.player) {
      const updatedPlayer = choice.apply(state.player);
      dispatch({
        type: "UPDATE_ATTRIBUTES",
        payload: { attributes: updatedPlayer.attributes },
      });
    }
    setScore(score + 10);
    if (eventIndex >= 5) {
      setPhase("settlement");
    } else {
      setEventIndex(eventIndex + 1);
    }
  };
  return (
    <main className="app-shell">
      <section className="card">
        <ProfileCard player={p} />
        {phase === "roll" && (
          <>
            <h2>休赛季</h2>
            <p>投掷骰子，获得本赛季的可分配点数。</p>
            <button onClick={roll}>投掷 3–6 颗骰子</button>
          </>
        )}
        {phase === "allocate" && (
          <>
            <div className="allocation-head">
              <div>
                <p className="eyebrow">ATTRIBUTE BUILDER</p>
                <h2>初始属性加点</h2>
              </div>
              <strong>剩余点数 {points}</strong>
            </div>

            <AttributeList
              attributes={values}
              activeTab={tab}
              onTabChange={setTab}
              mode="add"
              onAdd={add}
              disabledAdd={points <= 0}
            />

            <button
              onClick={() => {
                dispatch({
                  type: "UPDATE_ATTRIBUTES",
                  payload: { attributes: values },
                });
                setPhase("season");
              }}
            >
              开始新赛季
            </button>
          </>
        )}
        {phase === "season" && currentEvent && (
          <EventCard
            event={currentEvent}
            onChoose={handleEventChoice}
            currentIndex={eventIndex}
            totalEvents={6}
          />
        )}
        {phase === "settlement" && (
          <>
            <h2>赛季结算</h2>
            <div className="stats">
              <div>
                <span>事件成绩</span>
                <strong>{score}</strong>
              </div>
              <div>
                <span>冠军数</span>
                <strong>{score > 35 ? 1 : 0}</strong>
              </div>
              <div>
                <span>排名积分</span>
                <strong>{Math.max(0, score * 10)}</strong>
              </div>
            </div>
            <button
              onClick={() => {
                setPhase("roll");
                setEventIndex(0);
                setScore(0);
              }}
            >
              开始新赛季
            </button>
          </>
        )}
      </section>
    </main>
  );
}
