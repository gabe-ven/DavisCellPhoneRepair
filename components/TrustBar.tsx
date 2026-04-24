const items = [
  "Done in Under an Hour",
  "1-Year Warranty",
  "No Appointment Needed",
  "Free Diagnosis",
];

export default function TrustBar() {
  return (
    <div
      className="relative z-10"
      style={{
        background: "#0d0d0d",
        clipPath: "polygon(0 18px, 100% 0, 100% calc(100% - 18px), 0 100%)",
        marginTop: "-18px",
        marginBottom: "-18px",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <ul className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 md:gap-x-12">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#8B1A1A" }}
                aria-hidden="true"
              />
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                {item}
              </span>
              {i < items.length - 1 && (
                <span
                  className="hidden md:block w-px h-4 ml-4 flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
