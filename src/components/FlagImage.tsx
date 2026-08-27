interface FlagImageProps {
  iso2: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function getFlagUrl(iso2: string) {
  return `https://flagcdn.com/${iso2.toLowerCase()}.svg`;
}

export function FlagImage({
  iso2,
  alt = "",
  width = 24,
  height = 16,
  className = "country-flag-img",
}: FlagImageProps) {
  return (
    <img
      src={getFlagUrl(iso2)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
