export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-white py-14 px-4" style={{ background: "#0a0f1e" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div
              className="text-lg font-black tracking-tight mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Davis Cell Phone Repair
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Davis&apos; #1 rated phone repair shop.
              <br />
              Walk-ins always welcome.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3 text-white/80 uppercase tracking-wider">
              Hours
            </div>
            <p className="text-white/50 text-sm">Mon – Sat: 10am – 7pm</p>
            <p className="text-white/50 text-sm">Sunday: 11am – 6pm</p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-3 text-white/80 uppercase tracking-wider">
              Contact
            </div>
            <p className="text-white/50 text-sm mb-1.5">
              1818 2nd St, Davis, CA 95616
            </p>
            <a
              href="tel:+15307534888"
              className="font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ color: "#4ade80" }}
            >
              (530) 753-4888
            </a>
          </div>
        </div>

        <div
          className="border-t pt-6 text-center text-xs"
          style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)" }}
        >
          © {year} Davis Cell Phone Repair. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
