export default function Hero() {
  return (
    <section id="top" className="v2-hero grain">
      <div className="v2-hero-grid">
        {/* Left: copy */}
        <div>
          <div className="mono micro v2-hero-eyebrow">
            <span className="v2-cr-dot" />
            DAVIS, CA · SINCE 2017
          </div>
          <h1 className="v2-hero-title">
            <span className="serif-it">Repaired right.</span>
            <br />
            <span className="serif-it">Right here</span>{" "}
            <span className="serif-r">in Davis.</span>
          </h1>
          <p className="v2-hero-lede">
            Cracked screen? Dead battery? Most repairs done{" "}
            <em>in under an hour</em> — no appointment, no Apple Store pricing.
            Family-owned on B Street since 2017.
          </p>
          <div className="v2-hero-cta">
            <a href="#services" className="btn-cr">GET A FREE QUOTE →</a>
            <a href="tel:+15303413384" className="btn-cr-out">
              <span className="v2-dot" /> (530) 341-3384
            </a>
          </div>
          <div className="v2-hero-stats">
            <div className="v2-hero-stat">
              <div className="v2-big-num">4.6</div>
              <div className="mono micro muted">★★★★½ AVG</div>
            </div>
            <div className="v2-hero-stat">
              <div className="v2-big-num">131</div>
              <div className="mono micro muted">GOOGLE REVIEWS</div>
            </div>
            <div className="v2-hero-stat">
              <div className="v2-big-num">#1</div>
              <div className="mono micro muted">RATED IN DAVIS</div>
            </div>
            <div className="v2-hero-stat">
              <div className="v2-big-num">&lt;60</div>
              <div className="mono micro muted">MIN AVG REPAIR</div>
            </div>
          </div>
        </div>

        {/* Right: photo */}
        <div className="v2-hero-right">
          <div className="v2-photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero.jpg" alt="Technician repairing a phone at 140 B St Davis" />
            <div className="v2-photo-caption">
              FIG. 01 — INSIDE THE WORKSHOP, 140 B ST.
            </div>
          </div>
          <div className="v2-stamp v2-hero-stamp">
            RANKED #1<br />IN DAVIS
          </div>
        </div>
      </div>
    </section>
  );
}
