"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="v2-nav">
      <div className="v2-nav-strap mono micro">
        <span>EST. 2017 · 140 B ST, DAVIS, CA</span>
        <span className="hide-sm">★★★★½ — 131 GOOGLE REVIEWS</span>
        <span>MON–SAT 10–6 · SUN 12–4</span>
      </div>
      <div className="v2-nav-main">
        <a href="#top" className="v2-logo" aria-label="Davis Cell Phone Repair home">
          <span className="v2-logo-davis">Davis</span>
          <span className="v2-logo-sub">CELL PHONE REPAIR</span>
        </a>
        <nav className="v2-nav-links">
          <a href="#services">Services</a>
          <a href="#why">Why Us</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Visit</a>
        </nav>
        <a href="tel:+15303413384" className="btn-cr v2-nav-cta">
          <span className="v2-dot" /> CALL — (530) 341-3384
        </a>
        <button
          className="v2-hamburger"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="v2-nav-mobile">
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#why" onClick={() => setOpen(false)}>Why Us</a>
          <a href="#reviews" onClick={() => setOpen(false)}>Reviews</a>
          <a href="#contact" onClick={() => setOpen(false)}>Visit</a>
          <a
            href="tel:+15303413384"
            className="btn-cr"
            style={{ marginTop: 8 }}
            onClick={() => setOpen(false)}
          >
            CALL — (530) 341-3384
          </a>
        </div>
      )}
    </header>
  );
}
