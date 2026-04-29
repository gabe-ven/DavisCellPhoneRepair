const REVIEWS = [
  { quote: "Cracked my screen the night before finals. Walked in the next morning, walked out an hour later with a brand-new screen. Saved my whole quarter.", name: "Sarah M.", tag: "UC Davis · Senior" },
  { quote: "Quoted me $89 over the phone. Charged me $89. No upsell, no surprises. That's rare.", name: "James R.", tag: "Davis · Local" },
  { quote: "Tried Apple first — they wanted $329 and three days. These guys did the same repair for less than half, in 45 minutes.", name: "Priya K.", tag: "Sacramento" },
  { quote: "Battery on my old iPhone was at 67%. Got it swapped while I grabbed coffee at Mishka's. It's like new.", name: "Marcus T.", tag: "Davis · Resident" },
  { quote: "Family-owned, knows what they're doing, treats you right. Won't take my phone anywhere else.", name: "Linda H.", tag: "Davis · Regular" },
  { quote: "Got my MacBook keyboard fixed for half what the Apple Store quoted. Same-day. These folks are the real deal.", name: "Daniel C.", tag: "Woodland" },
];

const MARQUEE_DOUBLED = [...REVIEWS, ...REVIEWS];

export default function Reviews() {
  return (
    <section id="reviews" className="v2-reviews grain v2-section">
      <div className="container">
        {/* Header */}
        <div className="v2-reviews-head">
          <div className="mono micro" style={{ color: "rgba(244,239,230,0.5)" }}>03 — WHAT NEIGHBORS SAY</div>
          <div className="v2-reviews-hero">
            <div>
              <div className="v2-reviews-big">4.6</div>
              <div className="v2-stars-row">
                ★★★★
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ color: "rgba(245,158,11,0.25)" }}>★</span>
                  <span style={{ position: "absolute", left: 0, top: 0, width: "60%", overflow: "hidden", display: "block", color: "#f59e0b" }}>★</span>
                </span>
              </div>
              <div className="mono micro muted" style={{ marginTop: 6 }}>
                AVERAGE OVER 131 REVIEWS
              </div>
            </div>
            <h2 className="v2-section-title" style={{ flex: 1, maxWidth: 540, color: "var(--cream)" }}>
              <span className="serif-r" style={{ color: "var(--cr-soft)" }}>A 4.6-star average. </span>
              <span className="serif-it">131 voices.</span>
              <span className="serif-r" style={{ color: "var(--cream)" }}> One repair shop.</span>
            </h2>
          </div>
        </div>

        {/* 3 feature quotes */}
        <div className="v2-quotes-grid">
          {REVIEWS.slice(0, 3).map((r, i) => (
            <figure key={i} className="v2-quote-card">
              <div className="mono micro" style={{ color: "var(--cr)" }}>★★★★★</div>
              <blockquote className="v2-quote-text">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <figcaption className="v2-quote-cap">
                <span className="v2-quote-name">{r.name}</span>
                <span className="v2-quote-tag mono micro">{r.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Marquee */}
        <div className="v2-marquee-wrap">
          <div className="mono micro muted v2-marquee-label">— MORE FROM THE NEIGHBORHOOD —</div>
          <div className="v2-marquee">
            <div className="v2-marquee-track">
              {MARQUEE_DOUBLED.map((r, i) => (
                <div key={i} className="v2-marquee-card">
                  <div className="mono micro" style={{ color: "var(--cr)" }}>★★★★★</div>
                  <p className="v2-marquee-quote">&ldquo;{r.quote}&rdquo;</p>
                  <div className="v2-marquee-name mono micro">
                    — {r.name.toUpperCase()}, {r.tag.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="v2-reviews-cta">
          <a
            href="https://www.google.com/maps?q=Davis+Cell+Phone+Repair"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cr-out"
          >
            READ ALL 131 ON GOOGLE →
          </a>
        </div>
      </div>
    </section>
  );
}
