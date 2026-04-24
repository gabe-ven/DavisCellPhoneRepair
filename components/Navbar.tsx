"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50" style={{ background: "#0d0d0d" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" aria-label="Davis Cell Phone Repair home">
            <Logo variant="dark" />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {["Services", "Reviews", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium nav-link"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:+15303413384"
              className="btn-crimson text-white text-sm font-bold px-5 py-2.5 rounded-lg"
            >
              Call Now
            </a>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="tel:+15303413384"
              className="text-white text-sm font-bold px-4 py-2 rounded-lg"
              style={{ background: "#8B1A1A" }}
            >
              Call Now
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-1"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            className="md:hidden border-t py-5 flex flex-col gap-5"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            {["Services", "Reviews", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="font-medium"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
