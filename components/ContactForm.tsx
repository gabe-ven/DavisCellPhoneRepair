export default function ContactForm() {
  return (
    <section id="contact" className="v2-contact v2-section">
      <div className="container">
        <div className="v2-section-head">
          <div className="mono micro muted">04 — VISIT THE SHOP</div>
          <h2 className="v2-section-title">
            <span className="serif-it">Come say hi. </span>
            <span className="serif-r">Walk-ins always welcome.</span>
          </h2>
        </div>

        <div className="v2-contact-grid">
          {/* CTA card — replaces the Formspree form */}
          <div className="v2-card v2-form-card" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 28 }}>
            <div>
              <div className="mono micro muted" style={{ marginBottom: 12 }}>GET A QUOTE IN 60 SECONDS</div>
              <p className="serif-it" style={{ fontSize: "clamp(22px,3vw,32px)", color: "var(--ink)", lineHeight: 1.15, maxWidth: 320 }}>
                Tell us what&apos;s broken.<br />We&apos;ll price it on the spot.
              </p>
              <p className="muted" style={{ fontSize: 14, marginTop: 12, maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
                Use our repair wizard — takes under a minute. No phone call required.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
              <a href="#services" className="btn-cr" style={{ textAlign: "center" }}>
                START A REPAIR TICKET →
              </a>
              <a href="tel:+15303413384" className="btn-cr-out" style={{ textAlign: "center" }}>
                OR CALL — (530) 341-3384
              </a>
            </div>
            <div className="mono micro muted" style={{ fontSize: 11 }}>
              FREE DIAGNOSIS · 12-MO WARRANTY · NO HIDDEN FEES
            </div>
          </div>

          {/* Visit info + map */}
          <div className="v2-visit">
            <div className="v2-visit-card">
              <div className="v2-visit-name">
                Davis
                <span style={{
                  fontStyle: "normal",
                  display: "block",
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  fontWeight: 700,
                  color: "var(--cr)",
                  marginTop: 4,
                }}>
                  CELL PHONE REPAIR
                </span>
              </div>
              <div className="v2-visit-rule" />
              <div className="v2-visit-row">
                <div className="mono micro">ADDRESS</div>
                <div className="v2-visit-val">140 B St, Suite 4<br />Davis, CA 95616</div>
              </div>
              <div className="v2-visit-row">
                <div className="mono micro">PHONE</div>
                <a href="tel:+15303413384" className="v2-visit-val v2-visit-link">(530) 341-3384</a>
              </div>
              <div className="v2-visit-row">
                <div className="mono micro">HOURS</div>
                <div className="v2-visit-val mono" style={{ fontSize: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>MON — SAT</span><span>10A — 6P</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>SUNDAY</span><span>12P — 4P</span>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=140+B+St+Suite+4+Davis+CA+95616"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cr"
                style={{ width: "100%", marginTop: 4 }}
              >
                GET DIRECTIONS →
              </a>
            </div>
            <div className="v2-map-frame">
              <iframe
                title="Davis Cell Phone Repair location"
                src="https://maps.google.com/maps?q=140+B+St+Suite+4+Davis+CA+95616&t=&z=15&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0, width: "100%", height: "100%" }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
