export default function Hero() {
  return (
    <section id="hero" className="relative bg-white overflow-hidden">

      {/* Mobile: image in-flow with bottom fade to white */}
      <div className="md:hidden relative h-80 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/o (2).jpg"
          alt="Davis Cell Phone Repair store front"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 20%",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.85) 75%, white 100%)" }}
        />
      </div>

      {/* Desktop: image covers left ~65%, fades right into white */}
      <div
        className="hidden md:block absolute inset-y-0 left-0 w-[65%]"
        style={{ minHeight: "100%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/o (2).jpg"
          alt="Davis Cell Phone Repair store front"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "40% center",
          }}
        />
        {/* Left edge darkening for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.08) 0%, transparent 25%)",
          }}
        />
        {/* Right fade to white */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent 40%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.5) 68%, rgba(255,255,255,0.85) 80%, white 95%)",
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-10 md:py-28 min-h-0 md:min-h-[560px]">
          {/* Spacer pushes text to right half on desktop */}
          <div className="hidden md:block flex-1" />

          {/* Text — full width on mobile, right ~40% on desktop */}
          <div className="w-full md:w-[42%] text-center md:text-left">
            {/* Rating badge */}
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-8"
              style={{
                background: "rgba(139,26,26,0.06)",
                border: "1px solid rgba(139,26,26,0.18)",
              }}
            >
              <span className="text-sm tracking-widest leading-none" style={{ color: "#f59e0b" }}>
                ★★★★★
              </span>
              <span className="text-sm font-medium" style={{ color: "#8B1A1A" }}>
                4.6 · 131 Google Reviews
              </span>
            </div>

            <h1
              className="text-[38px] sm:text-5xl md:text-[52px] lg:text-[60px] leading-[1.05] mb-5"
              style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
            >
              Davis&apos; #1 Rated
              <br />
              <span style={{ color: "#8B1A1A" }}>Phone Repair</span> Shop
            </h1>

            <p
              className="text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed"
              style={{ color: "#6b7280" }}
            >
              Cracked screen? Dead battery? Most repairs take under 60 minutes
              while you wait — no appointment, no Apple Store markup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#contact"
                className="btn-crimson btn-cta-pulse font-bold text-base px-8 py-4 rounded-lg text-white text-center"
                style={{ boxShadow: "0 4px 20px rgba(139,26,26,0.3)" }}
              >
                Get a Free Quote
              </a>
              <a
                href="tel:+15303413384"
                className="btn-crimson-outline font-bold text-base px-8 py-4 rounded-lg text-center"
              >
                Call (530) 341-3384
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
