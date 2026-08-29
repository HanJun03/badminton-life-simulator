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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {countries.map(({ code, iso2, label }) => (
        <button
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            value === code
              ? "bg-[#18344e] border-blue-400 text-white shadow-sm"
              : "bg-[#112030] border-[#1e354c] text-slate-400 hover:bg-[#16273b] hover:text-slate-200"
          }`}
          key={code}
          type="button"
          onClick={() => onChange(code)}
        >
          <FlagImage iso2={iso2} alt={label} width={18} height={12} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

