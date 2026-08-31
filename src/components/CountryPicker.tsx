import { FlagImage } from "./FlagImage";
import { SelectableGrid } from "./SelectableGrid";

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
    <SelectableGrid
      options={countries.map(({ code, iso2, label }) => ({
        value: code,
        label,
        leading: <FlagImage iso2={iso2} alt={label} width={24} height={16} />,
      }))}
      value={value}
      onChange={onChange}
      columns={2}
      ariaLabel="选择国籍"
    />
  );
}
