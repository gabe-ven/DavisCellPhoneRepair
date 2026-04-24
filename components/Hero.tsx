import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden text-white"
      style={{ background: "#0a0f1e" }}
    >
      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 40% 50%, rgba(37,99,235,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-14">
          {/* Text column */}
          <div className="flex-1 text-center md:text-left">
            {/* Review badge */}
            <div className="inline-flex items-center gap-2.5 border border-white/15 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="text-yellow-400 text-sm tracking-widest leading-none">
                ★★★★★
              </span>
              <span className="text-white/80 text-sm font-medium">
                4.6 · 131 Google Reviews
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 tracking-tight"
              style={{ fontWeight: 900 }}
            >
              Davis&apos; #1 Rated
              <br />
              Phone Repair Shop
            </h1>

            <p className="text-white/55 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Most repairs done same day while you wait. Walk-ins always
              welcome. Pricing you can count on.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#contact"
                className="font-bold text-lg px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 text-center"
                style={{
                  background: "#2563eb",
                  boxShadow: "0 0 32px rgba(37,99,235,0.45)",
                }}
              >
                Get a Quote
              </a>
              <a
                href="tel:+15307534888"
                className="font-bold text-lg px-8 py-4 rounded-xl text-white transition-all hover:opacity-90 text-center"
                style={{ background: "#16a34a" }}
              >
                Call Now
              </a>
            </div>
          </div>

          {/* Image column */}
          <div className="flex-1 w-full max-w-md md:max-w-none">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src="/technician.jpg"
                alt="Davis Cell Phone Repair technician at work"
                width={600}
                height={500}
                className="w-full h-72 md:h-[420px] object-cover object-top"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
