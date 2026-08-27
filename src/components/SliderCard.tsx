interface SliderCardProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export function SliderCard({
  label,
  unit,
  min,
  max,
  value,
  onChange,
}: SliderCardProps) {
  return (
    <div className="slider-card">
      <div>
        <b>{label}</b>
        <strong>
          {value} {unit}
        </strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <div className="slider-minmax">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
