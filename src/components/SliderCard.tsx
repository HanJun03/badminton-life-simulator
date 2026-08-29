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
    <div className="bg-[#112030] border border-[#1e354c] rounded-xl p-3.5 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-300">{label}</span>
        <strong className="text-sm font-extrabold text-sky-400">
          {value} {unit}
        </strong>
      </div>
      <input
        type="range"
        className="w-full accent-blue-500 cursor-pointer h-2 bg-[#1b2d3d] rounded-lg"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <div className="flex justify-between text-[10px] font-medium text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

