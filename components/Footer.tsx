import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-14 px-4" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="mb-4">
              <Logo variant="dark" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              Half a mile from UC Davis.
              <br />
              Most repairs done while you wait.
            </p>
          </div>

          <div>
            <div
              className="font-semibold text-xs mb-4 uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Hours
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Mon – Sat: 10am – 6pm</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Sunday: 12pm – 4pm</p>
          </div>

          <div>
            <div
              className="font-semibold text-xs mb-4 uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Contact
            </div>
            <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              140 B St Suite 4, Davis, CA 95616
            </p>
            <a
              href="tel:+15303413384"
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: "#e57373" }}
            >
              (530) 341-3384
            </a>
          </div>
        </div>

        <div
          className="border-t pt-6 text-center text-xs"
          style={{
            borderColor: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          © {year} Davis Cell Phone Repair. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
