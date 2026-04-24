"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
            Davis Cell Phone Repair
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {["Services", "Reviews", "Contact"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:+15307534888"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Call Now
            </a>
          </div>

          {/* Mobile: always-visible Call Now + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href="tel:+15307534888"
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Call Now
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="text-slate-700 text-xl p-1"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-5 pb-6">
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
