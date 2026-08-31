import type { ReactNode } from "react";

export interface SelectableOption<T extends string> {
  value: T;
  label: string;
  leading?: ReactNode;
}

interface SelectableGridProps<T extends string> {
  options: readonly SelectableOption<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
  ariaLabel: string;
  className?: string;
}

export function SelectableGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
  ariaLabel,
  className = "",
}: SelectableGridProps<T>) {
  return (
    <div className={`selectable-grid selectable-grid-${columns} ${className}`} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className={`selectable-option${selected ? " is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {option.leading}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
