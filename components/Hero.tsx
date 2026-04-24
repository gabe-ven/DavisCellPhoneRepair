import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 py-20 md:py-28">
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
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
              className="text-[38px] sm:text-5xl md:text-[52px] lg:text-[60px] leading-[1.05] mb-5 tracking-tight"
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
              Most repairs done same day while you wait. Walk-ins always
              welcome. Pricing you can count on.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#contact"
                className="btn-crimson font-bold text-base px-8 py-4 rounded-lg text-white text-center"
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

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
              {["Same-Day Repair", "1-Year Warranty", "Walk-Ins Welcome"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "#f9f9f9", color: "#374151", border: "1px solid #e5e7eb" }}
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Image column */}
          <div className="flex-1 w-full max-w-sm md:max-w-none">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                border: "1.5px solid #e5e7eb",
              }}
            >
              <Image
                src="/technician.jpg"
                alt="Davis Cell Phone Repair — technician at work"
                width={600}
                height={520}
                className="w-full h-72 md:h-[460px] object-cover object-top"
                priority
              />
              {/* Crimson accent bar at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1.5"
                style={{ background: "#8B1A1A" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
