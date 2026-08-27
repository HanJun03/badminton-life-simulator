import type { CareerEvent } from "../data/events";

export interface EventCardProps {
  event: CareerEvent;
  onChoose: (choiceId: string) => void;
  currentIndex?: number;
  totalEvents?: number;
}

export function EventCard({
  event,
  onChoose,
  currentIndex,
  totalEvents,
}: EventCardProps) {
  return (
    <div className="event-card result">
      {currentIndex !== undefined && totalEvents !== undefined && (
        <p className="eyebrow" style={{ textAlign: "left", marginBottom: "8px" }}>
          EVENT {currentIndex + 1} / {totalEvents}
        </p>
      )}
      <h2>{event.title}</h2>
      <p style={{ margin: "8px 0 20px", color: "#a9bdd0" }}>{event.description}</p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {event.choices.map((choice, index) => (
          <button
            key={choice.id}
            type="button"
            className={index === 0 ? "" : "secondary"}
            onClick={() => onChoose(choice.id)}
            style={{ flex: 1, minWidth: "140px" }}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
