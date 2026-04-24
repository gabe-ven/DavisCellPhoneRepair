type LogoProps = {
  /** "light" = dark text on light bg, "dark" = white text on dark bg */
  variant?: "light" | "dark";
};

export default function Logo({ variant = "dark" }: LogoProps) {
  const scriptColor = "#8B1A1A";
  const capsColor = variant === "dark" ? "#ffffff" : "#111111";

  return (
    <div className="flex items-center gap-2.5">
      {/* Cracked-phone icon */}
      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" aria-hidden="true">
        {/* Tablet body (back) */}
        <rect x="0" y="3" width="21" height="31" rx="3" fill={scriptColor} />
        <rect x="2" y="6" width="17" height="23" rx="1.5" fill="white" fillOpacity="0.12" />
        {/* Phone body (front) */}
        <rect x="9" y="0" width="21" height="34" rx="3" fill={scriptColor} />
        <rect x="11" y="3" width="17" height="26" rx="1.5" fill="white" fillOpacity="0.15" />
        {/* Lightning crack */}
        <path
          d="M20 3 L15 14 L19 14 L14 31"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Wordmark */}
      <div className="leading-none">
        <div
          style={{
            fontFamily: "var(--font-dancing)",
            color: scriptColor,
            fontSize: "22px",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Davis
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            color: capsColor,
            fontSize: "8.5px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            lineHeight: 1.3,
          }}
        >
          CELL PHONE REPAIR
        </div>
      </div>
    </div>
  );
}
