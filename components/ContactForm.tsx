"use client";

import { useState, FormEvent } from "react";
import { MapPin, Clock, Phone } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: new FormData(e.currentTarget),
      headers: { Accept: "application/json" },
    });
    setLoading(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-shadow";
  const inputStyle = {
    border: "1.5px solid #e5e7eb",
    color: "#111111",
  };

  return (
    <section id="contact" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2
          className="section-heading text-3xl md:text-4xl text-center mb-14 tracking-tight"
          style={{ fontWeight: 900, color: "#111111", letterSpacing: "-0.02em" }}
        >
          Walk In or Send a Message
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Form */}
          <div
            className="bg-white rounded-2xl p-8"
            style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(139,26,26,0.07)" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="#8B1A1A" strokeWidth={2.5}>
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#111111" }}>Got it!</h3>
                <p style={{ color: "#6b7280" }}>We&apos;ll call or text you back shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                <input name="name" required placeholder="Your Name" className={inputClass} style={inputStyle} />
                <input name="phone" type="tel" required placeholder="Phone Number" className={inputClass} style={inputStyle} />
                <input name="device" required placeholder="Device (e.g. iPhone 14, Samsung S23)" className={inputClass} style={inputStyle} />
                <textarea
                  name="issue"
                  required
                  placeholder="What's the issue?"
                  rows={5}
                  className={`${inputClass} resize-none flex-1`}
                  style={inputStyle}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-crimson cursor-pointer text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  style={{ boxShadow: "0 4px 20px rgba(139,26,26,0.25)" }}
                >
                  {loading ? "Sending…" : "Submit Request"}
                </button>
              </form>
            )}
          </div>

          {/* Map + info card overlay */}
          <div className="relative rounded-2xl overflow-hidden min-h-[480px]" style={{ border: "1.5px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Map fills the full column */}
            <iframe
              title="Davis Cell Phone Repair location"
              src="https://maps.google.com/maps?q=140+B+St+Suite+4+Davis+CA+95616&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Info card pinned to bottom, overlaid on the map */}
            <div
              className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-3.5"
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(8px)",
                borderTop: "1.5px solid #e5e7eb",
              }}
            >
              {[
                { icon: MapPin, label: "Location", value: "140 B St Suite 4, Davis, CA 95616", href: "https://maps.google.com/?q=140+B+St+Suite+4+Davis+CA+95616" },
                { icon: Clock, label: "Hours", value: "Mon – Sat: 10am – 6pm  ·  Sun: 12pm – 4pm", href: undefined },
                { icon: Phone, label: "Phone", value: "(530) 341-3384", href: "tel:+15303413384" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(139,26,26,0.07)" }}
                  >
                    <Icon size={14} style={{ color: "#8B1A1A" }} strokeWidth={2} />
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                    <span className="font-semibold text-xs uppercase tracking-wide flex-shrink-0" style={{ color: "#6b7280" }}>{label}</span>
                    {href ? (
                      <a href={href} className="font-semibold text-sm hover:opacity-75 transition-opacity truncate" style={{ color: "#111111" }}>
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm" style={{ color: "#111111" }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}

              <a
                href="tel:+15303413384"
                className="btn-crimson text-white font-bold py-3 rounded-lg text-center text-sm mt-1"
              >
                Call Now — (530) 341-3384
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
