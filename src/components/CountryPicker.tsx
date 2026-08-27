import { FlagImage } from "./FlagImage";

export interface CountryInfo {
  code: string; // 3-letter Olympic / BWF code
  iso2: string; // 2-letter ISO code for flagcdn
  label: string;
}

export const countries: CountryInfo[] = [
  { code: "CHN", iso2: "cn", label: "中国" },
  { code: "INA", iso2: "id", label: "印度尼西亚" },
  { code: "KOR", iso2: "kr", label: "韩国" },
  { code: "DEN", iso2: "dk", label: "丹麦" },
  { code: "MAS", iso2: "my", label: "马来西亚" },
  { code: "JPN", iso2: "jp", label: "日本" },
  { code: "THA", iso2: "th", label: "泰国" },
  { code: "IND", iso2: "in", label: "印度" },
];

export const countryMap = Object.fromEntries(
  countries.map((c) => [c.code, c]),
);

interface CountryPickerProps {
  value: string;
  onChange: (code: string) => void;
}

export function CountryPicker({ value, onChange }: CountryPickerProps) {
  return (
    <div className="country-grid">
      {countries.map(({ code, iso2, label }) => (
        <button
          className={
            value === code ? "country-chip selected" : "country-chip"
          }
          key={code}
          type="button"
          onClick={() => onChange(code)}
        >
          <FlagImage iso2={iso2} alt={label} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
