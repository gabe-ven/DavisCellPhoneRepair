"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#hero"
            className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Davis Cell Phone Repair
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {(["Services", "Reviews", "Contact"] as const).map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:+15307534888"
              className="text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: "#16a34a" }}
            >
              Call Now
            </a>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="tel:+15307534888"
              className="text-white text-sm font-bold px-4 py-2 rounded-lg"
              style={{ background: "#16a34a" }}
            >
              Call Now
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="text-slate-600 p-1"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 py-5 flex flex-col gap-5">
            {["Services", "Reviews", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="text-slate-700 font-medium"
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
